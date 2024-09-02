import { AppError } from "../../utils/class.error.js";
import { asyncHandler } from "../../middleware/async.handler.js";
import { cartModel } from "../../../db/models/cart.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { wishlistModel } from "../../../db/models/wishlist.model.js";

// ============================== createWishList =====================================//

export const createWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findById(productId );

  if (!product) return next(new AppError("product not found", 400));

  const wishList = await wishlistModel.findOne({ user: req.user._id });
  if (!wishList) {
    const newWishlist = await wishlistModel.create({
      user: req.user._id,
      products: [productId],
    });
    return res
      .status(200)
      .json({ msg: "Wishlist created", wishList: newWishlist });
  }
  const newWishlist = await wishlistModel.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: [productId] } },
    {
      new: true,
    }
  );

  return res.status(200).json({ msg: "wishlist created", newWishlist });
});
// ============================== removeWishList =====================================//

export const removeWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cartExist = await wishlistModel.findOneAndUpdate(
    {
      user: req.user._id,
      products: productId,
    },

    {
      $pull: { products: productId  },
    }
  );

  return res.status(200).json({ msg: "wishlist removed" });
});
// ============================== clearWishList =====================================//

export const clearWishList = asyncHandler(async (req, res, next) => {
  const cartExist = await wishlistModel.findOneAndUpdate(
    {
      user: req.user._id,
    },

    {
      products: [],
    }
  );

  return res.status(200).json({ msg: "wishlist cleared" });
});
