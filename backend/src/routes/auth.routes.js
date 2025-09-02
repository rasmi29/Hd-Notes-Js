import { Router } from "express";
import isLoggedIn from "../middleware/isLogin.middleware.js";
import validate from "../middleware/validator.middleware.js";
import { registerUser, logoutUser, verifyOTP, sendOTP } from "../controllers/auth.controller.js";
import { userRegistrationValidator, emailOtpValidator, emailValidator } from "../validators/validator.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validate, registerUser);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/send-otp", emailValidator(), validate, sendOTP);
router.post("/verify-otp", emailOtpValidator(), validate, verifyOTP);

export default router;
