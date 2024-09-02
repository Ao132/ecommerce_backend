import { asyncHandler } from "../../middleware/async.handler.js";
import { AppError } from "../../utils/class.error.js";
import { categoryModel } from "../../../db/models/category.model.js";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";

// ============================== createSubCategory =====================================//

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) return next(new AppError("category not exists", 409));

  const subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (subCategoryExist)
    return next(new AppError("subCategory already exists", 409));

  if (!req.file) return next(new AppError("image is required", 409));
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `ecommerce/categories/${categoryExist.customId}/subCategories/${customId}`,
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    image: { secure_url, public_id },
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    createdBy: req.user._id,
    category: req.params.categoryId,
    customId,
  });
  return res.status(201).json({ msg: "subcategory created", subCategory });
});

// ============================== getSubCategories =====================================//

export const getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await subCategoryModel.find().populate([
    {
      path: "category",
      select: "",
    },
    {
      path: "createdBy",
      select: "",
    },
  ]);
  res.status(200).json({ msg: "done", subCategories });
});
// ============================== updateSubCategory =====================================//

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const subCategory = await subCategoryModel
    .findOne({ _id: id, createdBy: req.user._id })
    .populate([
      {
        path: "category",
        select: "customId -_id",
      },
      {
        path: "createdBy",
        select: "_id",
      },
    ]);

  if (!subCategory) return next(new AppError("subcategory not exists", 404));
  if (name) {
    if (name.toLowerCase() === subCategory.name)
      return next(new AppError("subcategory name must be different", 400));
    if (await subCategoryModel.findOne({ name: name.toLowerCase() }))
      return next(new AppError("subcategory name already exists", 400));
    subCategory.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    subCategory.name = name.toLowerCase();
  }
  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `ecommerce/categories/${subCategory.category.customId}/subcategories/${subCategory.customId}`,
      }
    );
    subCategory.image = { secure_url, public_id };
  }
  await subCategory.save();

  name || req.file
    ? res.status(200).json({ msg: "subcategory updated", subCategory })
    : res.status(400).json({ msg: "no fields to update" });
});
