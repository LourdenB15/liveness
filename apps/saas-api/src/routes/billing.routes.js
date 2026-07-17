import { Router } from "express";
import * as billingController from "../controllers/billing.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, billingController.getBillingInfo);
router.post(
  "/upgrade",
  authenticateToken,
  billingController.upgradeSubscriptionTier,
);

export default router;
