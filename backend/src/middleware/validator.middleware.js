import ApiError from "../utils/api-error.js";
import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedError = [];
  errors.array().map((err) =>
    extractedError.push({
      [err.path]: err.msg,
    })
  );

  throw new ApiError(422, "received data is not valid", extractedError);
};

export default validate;
