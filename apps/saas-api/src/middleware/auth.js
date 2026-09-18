import jwt from "jsonwebtoken";
import { findApiKeyDetails } from "../services/api-key.service.js";
import { findAdminTokenVersion } from "../repositories/auth.repository.js";
import { getClearCookieOptions } from "../utils/cookie.js";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: JWT_SECRET environment variable is required in production mode.",
    );
  }
  console.warn(
    "SECURITY WARNING: Using fallback JWT secret for local development. Set JWT_SECRET in production.",
  );
  return "your-fallback-secret-for-dev-only";
};

const JWT_SECRET = getJwtSecret();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null) ||
    req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, async (err, user) => {
    if (err) {
      res.clearCookie("token", getClearCookieOptions());
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    try {
      const currentVersion = await findAdminTokenVersion(user.id);
      if (
        currentVersion === null ||
        (user.tokenVersion !== undefined && user.tokenVersion !== currentVersion)
      ) {
        res.clearCookie("token", getClearCookieOptions());
        return res
          .status(401)
          .json({ error: "Session revoked or expired. Please sign in again." });
      }

      req.user = user;
      next();
    } catch (dbError) {
      console.error("Token version verification error:", dbError);
      return res
        .status(500)
        .json({ error: "Internal server error during authentication" });
    }
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
    const details = await findApiKeyDetails(apiKey);
    req.adminId = details.adminId;
    req.apiKeyId = details.apiKeyId;
    req.apiKeyName = details.keyName;
    req.apiKeyMasked = details.maskedKey;
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
