import { AppError } from "../../utils/class.error.js";
import { asyncHandler } from "../../middleware/async.handler.js";
import { productModel } from "../../../db/models/product.model.js";
import { cartModel } from "../../../db/models/cart.model.js";

// ============================== createCart =====================================//

export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const productExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!productExist)
    return next(new AppError("product not exist or out of stock", 400));

  const cartExist = await cartModel.findOne({ user: req.user._id });
  if (!cartExist) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(200).json({ msg: "cart created", cart });
  }
  let flag = false;
  for (const product of cartExist.products) {
    if (productId == product.productId) {
      product.quantity += +quantity;
      flag = true;
    }
  }
  if (!flag) {
    cartExist.products.push({ productId, quantity });
  }

  await cartExist.save();

  return res.status(200).json({ msg: "cart created", cart: cartExist });
});

// ============================== removeCart =====================================//

export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const cartExist = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },

    {
      $pull: { products: { productId } },
    }
  );

  return res.status(200).json({ msg: "product removed" });
});
// ============================== clearCart =====================================//

export const clearCart = asyncHandler(async (req, res, next) => {
  const cartExist = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
    },

    {
      products: [],
    }
  );

  return res.status(200).json({ msg: "cart cleared" });
});
