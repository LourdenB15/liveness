import { Router } from "express";
import * as usersController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, usersController.getUsers);
router.delete("/:id", authenticateToken, usersController.deleteUser);

export default router;
