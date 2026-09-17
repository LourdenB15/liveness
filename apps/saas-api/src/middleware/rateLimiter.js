import rateLimit from "express-rate-limit";

export function createRateLimiter({ windowMs, max, message, keyGenerator }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
    ...(keyGenerator ? { keyGenerator } : {}),
  });
}
