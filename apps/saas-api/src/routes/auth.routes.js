import { Router } from "express";
import { ipKeyGenerator } from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
const router = Router();

const signupLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many signup attempts, please try again later.",
});

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later.",
});

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests, please try again later.",
});

const resetPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many attempts, please try again later.",
});

const changePasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many password change attempts, please try again later.",
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

const verifyOtpLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many verification attempts, please try again later.",
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

const resendOtpLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many OTP resend requests, please wait before requesting another.",
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

router.post("/signup", signupLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post(
  "/verify-otp",
  authenticateToken,
  verifyOtpLimiter,
  authController.verifyOtp,
);
router.post(
  "/resend-otp",
  authenticateToken,
  resendOtpLimiter,
  authController.resendOtp,
);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  resetPasswordLimiter,
  authController.resetPassword,
);
router.post(
  "/change-password",
  authenticateToken,
  changePasswordLimiter,
  authController.changePassword,
);
router.put("/profile", authenticateToken, authController.updateProfile);
router.get("/me", authenticateToken, authController.me);
router.post("/logout", authController.logout);

export default router;
