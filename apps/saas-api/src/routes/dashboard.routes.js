import { Router } from "express";
import apiKeyRoutes from "./api-key.routes.js";
import authRoutes from "./auth.routes.js";
import logRoutes from "./log.routes.js";
import statsRoutes from "./stats.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use(authRoutes);
router.use("/stats", statsRoutes);
router.use("/api-keys", apiKeyRoutes);
router.use("/logs", logRoutes);
router.use("/users", userRoutes);

export default router;
