import { customAlphabet } from "nanoid";
import { userModel } from "../../../db/models/user.model.js";
import { sendEmail } from "../../service/send.email.js";
import { asyncHandler } from "../.././middleware/async.handler.js";
import { AppError } from "../../utils/class.error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ============================== signup =====================================//

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, age, phone, address, cPassword } = req.body;

  const userExist = await userModel.findOne({ email: email.toLowerCase() });

  userExist && next(new AppError("user already exists", 409));

  const token = jwt.sign({ email }, process.env.EMAIL_TOKEN, { expiresIn: 10 });
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  const refToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_REF);
  const refLink = `${req.protocol}://${req.headers.host}/users/reSend/${refToken}`;

  await sendEmail(
    email,
    "verify your email",
    `<a href='${link}'> confirm email</a> <br> <a href='${refLink}'> resend email </a>`
  );
  const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
  const user = new userModel({
    name,
    email,
    password: hash,
    age,
    phone,
    address,
  });
  const newUser = await user.save();
  newUser
    ? res.status(200).json({ msg: "done", user: newUser })
    : next(new AppError("user not created"));
});
// ============================== confirmEmail =====================================//

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAIL_TOKEN);
  if (!decoded?.email) return next(new AppError("Invalid token", 400));
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  user
    ? res.status(200).json({ msg: "Confirmed" })
    : next(new AppError("user not exist or already confirmed"));
});
// ============================== reSendEmail =====================================//

export const reSendEmail = asyncHandler(async (req, res, next) => {
  const { refToken } = req.params;
  const decoded = jwt.verify(refToken, process.env.EMAIL_TOKEN_REF);
  if (!decoded?.email) return next(new AppError("Invalid token", 400));

  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
  });
  if (user) return next(new AppError("email already confirmed"));

  const token = jwt.sign({ email: decoded.email }, process.env.EMAIL_TOKEN, {
    expiresIn: 15,
  });

  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  await sendEmail(
    decoded.email,
    "verify your email",
    `<a href='${link}'> confirm email </a>`
  );
  res.status(200).json({ msg: "done" });
});
// ============================== forgetPassword =====================================//

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    next(new AppError("email not exist", 400));
  }

  const otp = customAlphabet("0123456789", 6);
  const code = otp();
  await sendEmail(email, "password otp", `<h1> otp is ${code} </h1>`);
  await userModel.updateOne({ email }, { otpCode: code });
  res.status(200).json({ msg: "done" });
});
// ============================== resetPassword =====================================//

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otpCode, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user || user.otpCode !== otpCode)
    return next(new AppError("email not exist or invalid code", 400));

  // if (!user) return next(new AppError("email not exist", 400));
  // if (user.otpCode !== otpCode) {
  //   return next(new AppError("invalid code", 400));
  // }

  const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
  await userModel.updateOne(
    { email },
    { password: hash, otpCode: "", passwordChangedAt: Date.now() }
  );
  res.status(200).json({ msg: "done" });
});
// ============================== signIn =====================================//

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email.toLowerCase(),
    confirmed: true,
  });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("email not exist or invalid password", 400));
  }
  const token = jwt.sign(
    { email, role: user.role },
    process.env.SECRET_KEY_DECODED_AUTH
  );
  await userModel.updateOne({ email }, { loggedIn: true });
  res.status(200).json({ msg: "sign in successfully", token });
});
