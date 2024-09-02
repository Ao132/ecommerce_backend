import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const couponVal = {
  body: joi.object({
    code: joi.string().min(3).max(15).required(),
    amount: joi.number().min(1).max(100).integer().required(),
    fromDate: joi.date().greater(Date.now()).required(),
    toDate: joi.date().greater(joi.ref("fromDate")).required(),
  }),
  headers: headers.headers,
};
export const updateCouponVal = {
  body: joi.object({
    code: joi.string().min(3).max(15),
    amount: joi.number().min(1).max(100).integer(),
    fromDate: joi.date().greater(Date.now()),
    toDate: joi.date().greater(joi.ref("fromDate")),
  }),
  headers: headers.headers,
};
