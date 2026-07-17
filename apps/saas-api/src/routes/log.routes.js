import { Router } from "express";
import * as logsController from "../controllers/log.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, logsController.getLogs);

export default router;
