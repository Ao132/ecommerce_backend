import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { cancelOrderVal, orderVal } from "./order.validation.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";

import * as OC from "./order.controller.js";

const cartRouter = Router();

cartRouter.post(
  "/createOrder",
  validation(orderVal),
  auth(Object.values(systemRoles)),
  OC.createOrder
);
cartRouter.put(
  "/cancelOrder/:id",
  validation(cancelOrderVal),
  auth(Object.values(systemRoles)),
  OC.cancelOrder
);

export default cartRouter;
