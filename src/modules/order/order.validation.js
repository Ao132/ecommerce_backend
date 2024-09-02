import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const orderVal = {
  body: joi.object({
    productId: generalFiled.id,
    quantity: joi.number().integer(),
    address:generalFiled.address,
    phone: generalFiled.phone,
    couponCode:joi.string().min(3),
    status:joi.string().min(3),
    paymentMethod:joi.string().valid("card","cash").required(),
  }),
  headers: headers.headers,
};
export const cancelOrderVal = {
  body: joi.object({
    reason:joi.string().min(3),
  }),
  // params:generalFiled.id,
  headers: headers.headers,
};