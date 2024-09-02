import { asyncHandler } from "../../middleware/async.handler.js";
import { AppError } from "../../utils/class.error.js";
import { brandModel } from "../../../db/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import { categoryModel } from "../../../db/models/category.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";
import slugify from "slugify";
import { ApiFeature } from "../../utils/api.features.js";
import { cartModel } from "../../../db/models/cart.model.js";
import { orderModel } from "../../../db/models/order.model.js";

// ============================== createProduct =====================================//

export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
    title,
  } = req.body;

  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) return next(new AppError("category not exists", 400));

  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist)
    return next(new AppError("subCategory not exists", 400));

  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) return next(new AppError("brand not exists", 400));

  const productExist = await productModel.findOne({
    title: title.toLowerCase(),
  });
  if (productExist) return next(new AppError("product already exist", 400));

  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) return next(new AppError("image is required", 400));

  const customId = nanoid(5);
  let covImgsList = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${customId}/coverImages`,
      }
    );
    covImgsList.push({ secure_url, public_id });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${customId}/mainImages`,
    }
  );

  const product = await productModel.create({
    customId,
    title,
    description,
    price,
    subPrice,
    stock,
    discount,
    brand,
    subCategory,
    category,
    image: { secure_url, public_id },
    coverImages: covImgsList,
    slug: slugify(title, {
      replacement: "_",
      lower: true,
    }),
    createdBy: req.user._id,
  });

  return res.status(201).json({ msg: "product created", product });
});
// ============================== updateProduct =====================================//

export const updateProduct = asyncHandler(async (req, res, next) => {
  const {
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
    title,
  } = req.body;
  const { id } = req.params;

  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) return next(new AppError("category not exists", 400));

  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist)
    return next(new AppError("subCategory not exists", 400));

  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) return next(new AppError("brand not exists", 400));

  const product = await productModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!product) return next(new AppError("product not exist", 400));

  if (title) {
    if (title.toLowerCase() == product.title)
      return next(new AppError("title matches old title"));
    if (await productModel.findOne({ title: title.toLowerCase() }))
      return next(new AppError("title already exists", 400));
    product.title = title;
  }
  if (description) {
    product.description = description;
  }
  if (stock) {
    product.stock = stock;
  }
  if (price & discount) {
    product.subPrice = price - price * (discount / 100);
    product.price = price;
    product.discount = discount;
  } else if (price) {
    product.subPrice = price - price * (product.discount / 100);
    product.price = price;
  } else if (discount) {
    product.subPrice = product.price - product.price * (discount / 100);
    product.discount = discount;
  }

  const orders =   await orderModel.find({
    "products.productId": id,
  })

  if (orders) {
  for (const order of orders) {
    order.products[0].title=title
    await order.save()
  }
  }

  if (req.files) {
    if (req.files?.image?.length) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${product.customId}/mainImages`,
        }
      );
      product.image = { secure_url, public_id };
    }
    if (req.files?.coverImages?.length) {
      await cloudinary.api.delete_resources_by_prefix(
        `ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${product.customId}/coverImages`
      );
      let covImgsList = [];
      for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${product.customId}/coverImages`,
          }
        );
        covImgsList.push({ secure_url, public_id });
      }
      product.coverImages = covImgsList;
    }
  }
  await product.save();
  return res.status(201).json({ msg: "product updated", product });
});

// ============================== getProducts =====================================//

export const getProducts = asyncHandler(async (req, res, next) => {
  const apiFeature = new ApiFeature(
    productModel.find(),
    req.query
  ).pagination();

  const products = await apiFeature.mongooseQuery;
  res
    .status(200)
    .json({
      msg: "products fetched",
      page: apiFeature.page,
      products: products,
    });
});
