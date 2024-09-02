import { asyncHandler } from "../../middleware/async.handler.js";
import { AppError } from "../../utils/class.error.js";
import { brandModel } from "../../../db/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";

// ============================== createBrand =====================================//

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brandExist = await brandModel.findOne({name: name.toLowerCase()});
  if (brandExist) return next(new AppError("brand exist", 400));

  if (!req.file) return next(new AppError("image is required", 400));
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `ecommerce//Brands/${customId}`,
    }
  );
  const brand = await brandModel.create({
    name,
    image: { secure_url, public_id },
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    createdBy: req.user._id,
    brandExist,
    customId,
  });
  return res.status(201).json({ msg: "brand created", brand });
});
