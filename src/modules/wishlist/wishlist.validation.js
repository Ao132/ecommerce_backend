import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const wishlistVal = {
  params:joi.object({
    productId: generalFiled.id,
  }),
  headers: headers.headers,
};
