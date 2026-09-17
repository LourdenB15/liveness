/**
 * Lightweight defense-in-depth HTTP security headers middleware.
 * Provides core protections equivalent to Helmet without requiring external dependencies,
 * avoiding npm lockfile alterations across multi-platform CI/CD runners.
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking by disallowing framing
  res.setHeader("X-Frame-Options", "DENY");

  // Control DNS prefetching
  res.setHeader("X-DNS-Prefetch-Control", "off");

  // Enforce HTTPS in production via HTTP Strict Transport Security
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Prevent Adobe Flash / PDF cross-domain policy downloads
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  // Prevent browsers from opening untrusted HTML downloads directly
  res.setHeader("X-Download-Options", "noopen");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Cross-Origin Resource and Opener policies
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  next();
}
