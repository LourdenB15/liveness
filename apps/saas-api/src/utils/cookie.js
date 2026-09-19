/**
 * Utility functions for authentication cookie configurations.
 * Ensures cross-site compatibility when frontend and backend are hosted on different domains
 * (e.g. liveness.cloud frontend and onrender.com backend).
 */

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSitePolicy =
    process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");
  const isSecure = isProduction || sameSitePolicy === "none";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSitePolicy,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...(sameSitePolicy === "none" ? { partitioned: true } : {}),
  };
}

export function getClearCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSitePolicy =
    process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");
  const isSecure = isProduction || sameSitePolicy === "none";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSitePolicy,
    path: "/",
    ...(sameSitePolicy === "none" ? { partitioned: true } : {}),
  };
}
