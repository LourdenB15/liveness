import { Router } from "express";
import * as statsController from "../controllers/stats.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, statsController.getStats);

export default router;
