import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";
import { createCategoryVal, updateCategoryVal } from "./category.validation.js";
import { multerHost, validExtensions } from "../../middleware/multer.host.js";

import * as CC from "./category.controller.js";
import subCatRouter from "../subCategory/subCategory.routes.js";

const catRouter = Router();

catRouter.use("/:categoryId/subCategories",subCatRouter)

catRouter.post(
  "/createCat",
  multerHost(validExtensions.image).single("image"),
  validation(createCategoryVal),
  auth(Object.values(systemRoles)),
  CC.createCategory
);

catRouter.get(
  "/getCat",
  // auth(Object.values(systemRoles)),
  CC.getCategories
);

catRouter.put(
  "/updateCat/:id",
  multerHost(validExtensions.image).single("image"),
  validation(updateCategoryVal),
  auth(["user"]),
  CC.updateCategory
);

catRouter.delete(
  "/deleteCat/:id",
  auth(Object.values(systemRoles)),
  CC.delteCategories
);

export default catRouter;
