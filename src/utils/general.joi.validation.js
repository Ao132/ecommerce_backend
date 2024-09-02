import joi from "joi";
import mongoose from "mongoose";

const joiString = joi.string();
const joiStringAndReq = joi.string().required();

const objectIdVal = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid object id");
};

export const generalFiled = {
  id: joiString.custom(objectIdVal),
  // .required(),

  name: joiString
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      "string.min": "name shooooort *_*",
      "any.required": "name requiredddddddddd *_*",
    })
    .required(),

  email: joiString
    .email({
      tlds: { allow: ["outlook", "com"] },
      minDomainSegments: 2,
    })
    .required(),

  password: joiString
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),

  rePassword: joiString.valid(joi.ref("password")).required(),

  phone: joi
    .array()
    .items(joiString.regex(/^(01)[0125][0-9]{8}$/))
    .required(),

  address: joi.array().items(joiString).required(),

  file: joi.object({
    size: joi.number().positive().required(),

    path: joiStringAndReq,

    filename: joiStringAndReq,

    destination: joiStringAndReq,

    mimetype: joiStringAndReq,

    encoding: joiStringAndReq,

    originalname: joiStringAndReq,

    fieldname: joiStringAndReq,
  }),
};
export const headers = {
  headers: joi.object({
    "cache-control": joiString,
    "postman-token": joiString,
    "content-type": joiString,
    "content-length": joiString,
    host: joiString,
    "user-agent": joiString,
    accept: joiString,
    "accept-encoding": joiString,
    connection: joiString,
    token: joiStringAndReq,
  }),
};
