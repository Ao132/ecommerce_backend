import joi from "joi";
import { generalFiled, headers } from "../../utils/general.joi.validation.js";

export const productVal = {
  body: joi.object({
    title: joi.string().min(3).max(30).required(),
    stock: joi.number().min(1).integer().required(),
    discount: joi.number().min(1).max(100),
    price: joi.number().min(1).integer().required(),
    brand: generalFiled.id,
    subCategory: generalFiled.id,
    category: generalFiled.id,
    description: joi.string().required(),
  }),

  files: joi
    .object({
      image: joi.array().items(generalFiled.file).required(),
      coverImages: joi.array().items(generalFiled.file.required()).required(),
    })
    .required(),
  headers: headers.headers.required(),
};
export const updateProductVal = {
  body: joi.object({
    title: joi.string().min(3).max(30),
    stock: joi.number().min(1).integer(),
    discount: joi.number().min(1).max(100),
    price: joi.number().min(1).integer(),
    brand: generalFiled.id,
    subCategory: generalFiled.id,
    category: generalFiled.id,
    description: joi.string(),
  }),

  files: joi.object({
    image: joi.array().items(generalFiled.file),
    coverImages: joi.array().items(generalFiled.file),
  }),
  params: joi.object({ id: generalFiled.id }),
  headers: headers.headers.required(),
};
