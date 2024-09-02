import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const brandVal = {
  body: joi.object({ name: generalFiled.name }),
  file: generalFiled.file,
  headers: headers.headers,
};
