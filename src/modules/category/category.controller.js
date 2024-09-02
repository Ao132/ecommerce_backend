import { asyncHandler } from "../../middleware/async.handler.js";
import { AppError } from "../../utils/class.error.js";
import { categoryModel } from "../../../db/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";

// ============================== createCategory =====================================//

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });

  categoryExist && next(new AppError("category already exists", 409));
  !req.file && next(new AppError("image is required", 409));

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `ecommerce/categories/${customId}` }
  );

  req.filePath = `ecommerce/categories/${customId}`;


  const category = await categoryModel.create({
    name,
    image: { secure_url, public_id },
    createdBy: req.user._id,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    customId,
  });

req.data={
  model: categoryModel,
  id:category._id
}
  const x = 4;
  x = 5;

  return res.status(201).json({ msg: "category created", category });
});
// ============================== getCategories =====================================//ies
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find().populate("subCategories");
  res.status(200).json({ msg: "done", categories });
});
// ============================== updateCategory =====================================//

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  !category && next(new AppError("category not exists", 409));

  if (name) {
    if (name.toLowerCase() === category.name)
      return next(new AppError("category name must be different", 409));

    if (await categoryModel.findOne({ name: name.toLowerCase() }))
      return next(new AppError("category name already exists", 409));

    category.name = name.toLowerCase();

    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `ecommerce/categories/${category.customId}` }
    );
    category.image = { secure_url, public_id };
  }

  await category.save();

  name || req.file
    ? res.status(200).json({ msg: "category updated", category })
    : res.status(400).json({ msg: "no fields to update" });
});

// ============================== delteCategories =====================================//ies
export const delteCategories = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category)
    return next(
      new AppError("category not exists or you don't have permission", 400)
    );

  await subCategoryModel.deleteMany({ category: category._id });

  await cloudinary.api.delete_resources_by_prefix(
    `ecommerce/categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `ecommerce/categories/${category.customId}`
  );

  res.status(200).json({ msg: "done" });
});
