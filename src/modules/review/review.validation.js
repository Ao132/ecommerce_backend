import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const reviewVal = {
  body: joi.object({
    comment: joi.string().required(),
    rate: joi.number().integer().min(1).max(5).required(),
  }),
  params: joi.object({
    productId: generalFiled.id,
  }),
  headers: headers.headers,
};
export const deleteReviewwVal = {
 
  params: joi.object({
    id: generalFiled.id,
  }),
  headers: headers.headers,
};
