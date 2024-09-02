import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { subCategoryVal } from "./subCategory.validation.js";
import { updateCategoryVal } from "../category/category.validation.js";
import { multerHost, validExtensions } from "../../middleware/multer.host.js";

import * as SC from "./subCategory.controller.js";
import { systemRoles } from "../../utils/system.roles.js";

const subCatRouter = Router({ mergeParams: true });

subCatRouter.post(
  "/createSub/:categoryId",
  multerHost(validExtensions.image).single("image"),
  validation(subCategoryVal),
  auth(["user"]),
  SC.createSubCategory
);

subCatRouter.get(
  "/getSub",
  // auth(Object.values(systemRoles)),
  SC.getSubCategories
);

subCatRouter.put(
  "/updateSub/:id",
  multerHost(validExtensions.image).single("image"),
  validation(updateCategoryVal),
  auth(["user"]),
  SC.updateSubCategory
);
export default subCatRouter;
