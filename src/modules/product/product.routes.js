import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { productVal, updateProductVal } from "./product.validation.js";
import { validation } from "../../middleware/validation.js";
import { multerHost, validExtensions } from "../../middleware/multer.host.js";

import * as PC from "./product.controller.js";
import reviewRouter from "../review/review.routes.js";
import wishlistRouter from "../wishlist/wishlist.routes.js";
import { systemRoles } from "../../utils/system.roles.js";

const productRouter = Router();

productRouter.use("/:productId/review", reviewRouter)
productRouter.use("/:productId/wishlist", wishlistRouter)

productRouter.post(
  "/createProduct",
  multerHost(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(productVal),
  auth(["admin"]),
  PC.createProduct
);
productRouter.put(  
  "/updateProduct/:id",
  multerHost(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(updateProductVal),
  auth(Object.values(systemRoles)),
  PC.updateProduct
);
productRouter.get(
  "/getProducts",
  // validation(productVal),
  // auth(Object.values(systemRoles)),
  PC.getProducts
);

export default productRouter;
