import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { clearCartVal , cartVal } from "./cart.validation.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";

import * as CC from "./cart.controller.js";

const cartRouter = Router();

cartRouter.post(
  "/createCart",
  validation(cartVal),
  auth(Object.values(systemRoles)),
  CC.createCart
);
cartRouter.put(
  "/clearCart",
  validation(clearCartVal),
  auth(Object.values(systemRoles)),
  CC.clearCart
);
export default cartRouter;
