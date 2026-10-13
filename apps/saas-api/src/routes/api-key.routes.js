import { Router } from "express";
import * as apiKeyController from "../controllers/api-key.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, apiKeyController.getApiKeys);
router.post("/", authenticateToken, apiKeyController.createApiKey);
router.patch("/:id/revoke", authenticateToken, apiKeyController.revokeApiKey);
router.delete("/:id", authenticateToken, apiKeyController.deleteApiKey);

export default router;
