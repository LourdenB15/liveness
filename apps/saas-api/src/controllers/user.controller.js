import * as userServices from "../services/user.service.js";
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid user ID format");

export async function getUsers(req, res) {
  const adminId = req.user.id;
  try {
    const users = await userServices.getUsers(adminId);
    return res.json(users);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

export async function deleteUser(req, res) {
  const validation = uuidSchema.safeParse(req.params.id);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const id = validation.data;
  const adminId = req.user.id;
  try {
    await userServices.deleteUser(id, adminId);
    return res.status(204).send();
  } catch (error) {
    console.error("User delete error:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
}
