import { AppError } from "../utils/class.error.js";

const dataMethods = ["body", "query", "headers", "params", "file", "files"];

export const validation = (schema) => {
  return (req, res, next) => {
    let arrayError = [];
    dataMethods.forEach((method) => {
      if (schema[method]) {
        const { error } = schema[method].validate(req[method], {
          abortEarly: false,
        });
        if (error) {
          error.details.forEach((err) => {
            arrayError.push(err);
          });
        }
      }
    });
    arrayError.length
      ? // next(new AppError("validation error"), arrayError)
        res.json({ mfg: "validation error", arrayError })
      : next();
  };
};
