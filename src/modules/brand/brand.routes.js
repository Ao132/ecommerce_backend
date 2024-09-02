import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { brandVal } from "./brand.validation.js";
import { multerHost, validExtensions } from "../../middleware/multer.host.js";
import * as BC from "./brand.controller.js";


const brandRouter = Router();

brandRouter.post(
  "/createBrand",
  multerHost(validExtensions.image).single("image"),
  validation(brandVal),
  auth(["user"]),
  BC.createBrand
);
// router.put(
//   "/updateSub/:id",
//   multerHost(validExtensions.image).single("image"),
//   validation(updateCategoryVal),
//   auth(["user"]),
//   SC.updateSubCategory
// );
export default brandRouter;
