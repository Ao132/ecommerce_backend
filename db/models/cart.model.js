import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const cartModel = model("cart", cartSchema);
