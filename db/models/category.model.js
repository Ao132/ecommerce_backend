import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 3,
      maxlength: 15,
      lowercase: true,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
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
    customId: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

categorySchema.virtual("subCategories", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});

export const categoryModel = model("category", categorySchema);
