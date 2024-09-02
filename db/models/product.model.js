import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: 3,
      maxlength: 30,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      minlength: 3,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "brand",
      required: true,
    },
    customId: String,
    slug: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImages: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 1,
    },
    subPrice: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    rateAvg: {
      type: Number,
      default: 0,
    },
    rateNum: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const productModel = model("product", productSchema);
