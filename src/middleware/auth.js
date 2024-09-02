import { userModel } from "../../db/models/user.model.js";
import { asyncHandler } from "../middleware/async.handler.js";
import { AppError } from "../utils/class.error.js";
import jwt from "jsonwebtoken";

export const auth = (role = []) => {
  return asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(new AppError("token not set", 400));
    }
    if (!token.startsWith(process.env.BEARER_KEY)) {
      return next(new AppError("Invalid B token", 401));
    }
    const newToken = token.split(process.env.BEARER_KEY)[1];
    if (!newToken) {
      return next(new AppError("Invalid token", 400));
    }
    const decoded = jwt.verify(newToken, process.env.SECRET_KEY_DECODED_AUTH);
    if (!decoded?.email) {
      return next(new AppError("Invalid payload", 400));
    }
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (!role.includes(user.role))
      return next(
        new AppError(" you are not allowed to visit this route", 403)
      );
    if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat)
      return next(new AppError("Token is Expired. Please Log in Again", 400));
    req.user = user;

    next();
  });
};
