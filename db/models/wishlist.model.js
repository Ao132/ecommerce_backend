import { model, Schema, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const wishlistModel = model("wishlist", wishlistSchema);
