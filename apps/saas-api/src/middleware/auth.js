import jwt from "jsonwebtoken";
import { findAdminByApiKey } from "../services/api-key.service.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-fallback-secret-for-dev-only";

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

export async function authenticateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res
      .status(401)
      .json({ error: "API key is required in x-api-key header" });
  }
  try {
    const adminId = await findAdminByApiKey(apiKey);
    req.adminId = adminId;
    next();
  } catch (error) {
    console.error("API Key Auth Error:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Internal server error during authentication" });
  }
}
