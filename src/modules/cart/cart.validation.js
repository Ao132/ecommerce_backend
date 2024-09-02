import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const cartVal = {
  body: joi.object({
    productId: generalFiled.id,
    quantity: joi.number().integer().required(),
  }),
  headers: headers.headers,
};
export const removeCartVal = {
  body: joi.object({
    productId: generalFiled.id,
  }),
  headers: headers.headers,
};
export const clearCartVal = {
  headers: headers.headers,
};
