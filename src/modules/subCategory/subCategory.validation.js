import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const subCategoryVal = {
  body: joi.object({ name: generalFiled.name }),
  params: joi.object({ categoryId: generalFiled.id }),
  file: generalFiled.file,
  headers: headers.headers,
};
