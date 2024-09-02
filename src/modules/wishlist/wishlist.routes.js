import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { wishlistVal } from "./wishlist.validation.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";

import * as WC from "./wishlist.controller.js";

const wishlistRouter = Router({mergeParams: true});

wishlistRouter.post(
  "/createWishList",
  validation(wishlistVal),
  auth(Object.values(systemRoles)),
  WC.createWishList
);
wishlistRouter.delete(
  "/deleteWishList",
  validation(wishlistVal),
  auth(Object.values(systemRoles)),
  WC.removeWishList
);
wishlistRouter.delete(
  "/clearWishList",
  validation(wishlistVal),
  auth(Object.values(systemRoles)),
  WC.clearWishList
);
export default wishlistRouter;
