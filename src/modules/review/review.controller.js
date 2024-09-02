import { AppError } from "../../utils/class.error.js";
import { asyncHandler } from "../../middleware/async.handler.js";
import { cartModel } from "../../../db/models/cart.model.js";
import { orderModel } from "../../../db/models/order.model.js";
import { couponModel } from "../../../db/models/coupon.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { reviewModel } from "../../../db/models/review.model.js";

// ============================== createReview =====================================//

export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params;

  const product = await productModel.findById(productId);

  if (!product) return next(new AppError("product not found ", 400));

  // const reviewExist = await reviewModel.findOne({
  //   createdBy: req.user._id,
  //   productId,
  // });

  // if (reviewExist)
  //   return next(new AppError("you can make only one review", 400));

  const order = await orderModel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered",
  });
  if (!order)
    return next(
      new AppError("you din't make order or order not delivered", 400)
    );

  const review = await reviewModel.create({
    createdBy: req.user._id,
    comment,
    rate,
    productId,
  });

  const reviews = await reviewModel.find({ productId });
  let sum = 0;

  for (const review of reviews) {
    sum += review.rate;
  }
  product.rateAvg = sum / reviews.length;

  // let sum = product.rateAvg * product.rateNum;

  // sum = sum + rate;

  // product.rateAvg = sum / (product.rateNum + 1);

  product.rateNum += 1;

  await product.save();
  res.status(200).json({ msg: "review created", review });
});

// ============================== createReview =====================================//
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await reviewModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!review) return next(new AppError("review not found", 400));
  const product = await productModel.findById(review.productId);

  // let sum = 0;

  // // for (const item of review) {
  // sum -= review.rate;
  // // }
  // product.rateAvg = sum / review.length;
  // product.rateNum -= 1;


  let sum = product.rateAvg * product.rateNum;

  sum = sum - review.rate;

  product.rateAvg = sum / (product.rateNum - 1);

  product.rateNum -= 1;


  await product.save();

  res.status(200).json({ msg: "review deleted" });
});
