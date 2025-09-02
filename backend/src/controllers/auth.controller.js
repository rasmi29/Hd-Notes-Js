import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { sendMail, emailOtpMailGenContent } from "../utils/email.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  //fetch data
  const { name, email, dateOfBirth } = req.body;
  //check if user exist or not
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exist with this email.");
  }

  // Generate OTP
  const otpCode = generateOTP();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const otpExpiresAt = new Date(
    Date.now() + parseInt(process.env.OTP_EXPIRY) * 60 * 1000
  );

  //if not exist then register
  const user = await User.create({
    name,
    email,
    dateOfBirth,
    otp: { code: hashedOtp, expiresAt: otpExpiresAt },
  });

  //check user craeted or not
  if (!user) {
    throw new ApiError(500, "error in user creation.Try again!");
  }

  //send email containing otp
  //create mail body
  const mailOption = emailOtpMailGenContent(name, otpCode);
  //send mail
  await sendMail({
    email: email,
    subject: "Verify your Notes account",
    mailGenContent: mailOption,
  });

  // destructure and exclude `otp`
  const { otp, ...safeUser } = user.toObject();

  return res
    .status(201)
    .json(new ApiResponse(201, safeUser, "User created successfully"));
});

//send otp or resend otp to user for login
const sendOTP = asyncHandler(async (req, res) => {
  //fetch data
  const { email } = req.body;

  //check user exist or not
  const user = await User.findOne({ email });
  //if user not found
  if (!user) {
    throw new ApiError(404, "user not found,register first");
  }
  //generate otp
  const otpCode = generateOTP();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const otpExpiresAt = new Date(
    Date.now() + parseInt(process.env.OTP_EXPIRY) * 60 * 1000
  );

  //update otp in user database
  user.otp = { code: hashedOtp, expiresAt: otpExpiresAt };

  //send email containing otp
  //create mail body
  const mailOption = emailOtpMailGenContent(user.name, otpCode);
  //send mail
  await sendMail({
    email: email,
    subject: "OTP to login your Notes account",
    mailGenContent: mailOption,
  });

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {
      message: "Login otp sent successful",
    })
  );
});

//verify otp
const verifyOTP = asyncHandler(async (req, res) => {
  //fetch otp
  const { email, otp } = req.body;

  //validate token
  if (!otp || !email) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });
  //check user found or not
  if (!user) {
    throw new ApiError(404, "user not found during otp verification");
  }
  // check if OTP is avaialble or not
  if (!user.otp.code) {
    throw new ApiError(400, "wrong otp given or otp invalid");
  }

  //check expiry time
  if (user.otp.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  //compare otp
  const isOtpValid = await bcrypt.compare(otp, user.otp.code);
  if (!isOtpValid) throw new ApiError(400, "Invalid OTP");

  //generate referesh token
  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  //validate refresh token & access token
  if (!refreshToken || !accessToken) {
    throw new ApiError(500, "error in token generation");
  }

  //store refreshtoken in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  //update user
  user.otp = undefined;
  user.lastLogin = new Date();
  user.refreshToken = refreshToken;

  //save user
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {
      message: "user otp verified. Login successfully",
      user: {
        _id: user._id,
        email: user.email,
        accessToken,
      },
    })
  );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  //fetch user data ;

  const { email } = req.user;

  const user = await User.findOne({ email });

  user.refreshToken = undefined;

  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
  });
  res.status(200).json(new ApiResponse(200, "user logged out successfully"));
});

export { registerUser, sendOTP, verifyOTP, logoutUser };
