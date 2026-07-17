import { Router } from "express";
import * as webhooksController from "../controllers/webhook.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, webhooksController.getWebhooks);
router.post("/", authenticateToken, webhooksController.createWebhook);
router.delete("/:id", authenticateToken, webhooksController.deleteWebhook);
router.get("/logs", authenticateToken, webhooksController.getWebhookLogs);

export default router;
