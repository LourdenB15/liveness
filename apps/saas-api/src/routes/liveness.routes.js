import { Router } from "express";
import { authenticateApiKey } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import { validateIntegrity } from "../middleware/validateIntegrity.js";
import * as livenessController from "../controllers/liveness.controller.js";

const router = Router();

const livenessLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many biometric verification requests, please try again later.",
  keyGenerator: (req) => req.apiKeyId || req.ip,
});

router.post(
  "/session",
  authenticateApiKey,
  livenessLimiter,
  livenessController.createSession,
);
router.post(
  "/enroll",
  authenticateApiKey,
  livenessLimiter,
  validateIntegrity,
  livenessController.enrollUser,
);
router.post(
  "/verify",
  authenticateApiKey,
  livenessLimiter,
  validateIntegrity,
  livenessController.verifyUser,
);
router.post(
  "/verify-one",
  authenticateApiKey,
  livenessLimiter,
  validateIntegrity,
  livenessController.verifyUserById,
);

export default router;
