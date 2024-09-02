import { AppError } from "../../utils/class.error.js";
import { asyncHandler } from "../../middleware/async.handler.js";
import { couponModel } from "../../../db/models/coupon.model.js";

// ============================== createCoupon =====================================//

export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;

  const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
  if (couponExist) return next(new AppError("code exist", 400));

  const coupon = await couponModel.create({
    code,
    amount,
    toDate,
    fromDate,
    createdBy: req.user._id,
  });
  return res.status(200).json({ msg: "coupon created", coupon });
});
// ============================== updateCoupon =====================================//

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      code,
      amount,
      toDate,
      fromDate,
      createdBy: req.user._id,
    }
  );
  if (!coupon)
    return next(new AppError("code exist or you don't have permission", 400));

  return res.status(200).json({ msg: "coupon updated", coupon });
});
