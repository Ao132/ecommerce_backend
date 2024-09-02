import { AppError } from "../../utils/class.error.js";
import { asyncHandler } from "../../middleware/async.handler.js";
import { cartModel } from "../../../db/models/cart.model.js";
import { orderModel } from "../../../db/models/order.model.js";
import { couponModel } from "../../../db/models/coupon.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../service/send.email.js"

// ============================== createOrder =====================================//

export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;

  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode.toLowerCase(),
      toDate: { $lte: Date.now() },
      usedBy: { $nin: [req.user._id] },
    });

    if (!coupon) {
      return next(
        new AppError("coupon not found or already used or expierd", 400)
      );
    }
    req.body.coupon = coupon;
  }

  let products = [];
  let falg = false;
  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart?.products?.length) {
      return next(new AppError("cart is empty", 400));
    }
    products = cart.products;
    falg = true;
  }
  let finalProducts = [];
  let subPrice = 0;

  for (let product of products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct) {
      return next(new AppError("product not found or out of stock", 400));
    }
    if (falg) {
      product = product.toObject();
    }
    product.title = checkProduct.title;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.subPrice * product.quantity;
    subPrice += product.finalPrice;
    finalProducts.push(product);
  }
  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
    totalPrice: subPrice - subPrice * ((req.body?.coupon?.amount || 0) / 100),
    address,
    phone,
  });

  if (req.body.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $push: { usedBy: req.user._id } }
    );
  }

  for (const product of finalProducts) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }
  if (falg) {
    await cartModel.updateOne({ user: req.user._id }, { products: [] });
  }

  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.user.address,
      city: "anycity",
      state: "anystate",
      country: "anycountry",
      postal_code: 12345,
    },
    products: order.products,
    date: order.createdAt,
    subtotal: subPrice,
    paid: order.totalPrice,
    invoice_nr: order._id,
    coupon:req.body?.coupon?.amount||0
  };

  await createInvoice(invoice, "invoice.pdf");
  await sendEmail(req.user.email,"order placed","your order has been placed successfully",[
    {
      path: "invoice.pdf",
      contentType: "application/pdf",
      filename: `${req.user.name}'s invoice.pdf`,
    }
  ])

  res.status(200).json({ msg: "order created", order });
});

// ============================== cancelOrder =====================================//

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: id, user: req.user._id });
  if (!order) {
    return next(new AppError("order not found", 400));
  }
  if (
    (order.paymentMethod === "card" && order.status != "waitPayment") ||
    (order.paymentMethod === "cash" && order.status != "placed")
  ) {
    return next(new AppError("you can't cancel this order", 400));
  }
  await orderModel.updateOne(
    { _id: id },
    {
      status: "cancelled",
      canceledBy: req.user._id,
      reason,
    }
  );
  if (order.couponId) {
    await couponModel.updateOne(
      { _id: order?.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  for (const product of order?.products) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  }
  res.status(200).json({ msg: "order canceled" });
});
