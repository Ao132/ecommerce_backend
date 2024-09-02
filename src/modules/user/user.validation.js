import joi from "joi";
import { generalFiled } from "../../utils/general.joi.validation.js";

export const signUpValidation = {
  body: joi
    .object({
      name: generalFiled.name,
      email: generalFiled.email,
      password: generalFiled.password,
      cPassword: generalFiled.rePassword,
      phone: generalFiled.phone,
      address: generalFiled.address,

      // gender: joi.string().valid("male", "female"),
    })
    .with("password", "cPassword "),
};
export const signInValidation = joi.object({
  email: joi.string().email(),

  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
});
