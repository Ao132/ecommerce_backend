import express, { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { cancelOrderVal, orderVal } from "./order.validation.js";
import { systemRoles } from "../../utils/system.roles.js";
import { validation } from "../../middleware/validation.js";

import * as OC from "./order.controller.js";

const orderRouter = Router();

orderRouter.post(
  "/createOrder",
  validation(orderVal),
  auth(Object.values(systemRoles)),
  OC.createOrder
);
orderRouter.post("/webhook", express.raw({ type: "application/json" }),OC.webhook);
orderRouter.put(
  "/cancelOrder/:id",
  validation(cancelOrderVal),
  auth(Object.values(systemRoles)),
  OC.cancelOrder
);

export default orderRouter;
