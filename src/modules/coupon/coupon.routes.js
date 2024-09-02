import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { couponVal, updateCouponVal } from "./coupon.validation.js";

import * as CC from "./coupon.controller.js";
import { systemRoles } from "../../utils/system.roles.js";

const couponRouter = Router();

couponRouter.post(
  "/createCoupon",
  validation(couponVal),
  auth(Object.values(systemRoles)),
  CC.createCoupon
);
couponRouter.put(
  "/updateCoupon/:id",
  validation(updateCouponVal),
  auth(["admin"]),
  CC.updateCoupon
);
export default couponRouter;
