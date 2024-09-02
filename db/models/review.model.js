import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 3, trim: true },

    rate: { type: Number, min: 1, max: 5, required: true },

    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const reviewModel = model("review", reviewSchema);
