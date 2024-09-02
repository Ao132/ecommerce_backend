import { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "code is required"],
      minlength: 3,
      maxlength: 15,
      lowercase: true,
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    usedBy: [{
      type: Types.ObjectId,
      ref: "user",
    }],
    fromDate: {
      type: Date,
      required:  [true, "fromDate is required"],
    },
    toDate: {
      type: Date,
      required:  [true, "toDate is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const couponModel = model("coupon", couponSchema);
