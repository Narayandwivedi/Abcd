const rateLimit = require("express-rate-limit");

// Rate limiter for admin login - 3 attempts per 24 hours PER IP ADDRESS
const adminLoginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 failed login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 24 hours."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful logins (only failed attempts)

  // Custom key generator to ensure we get the real client IP
  keyGenerator: (req) => {
    // Get IP from X-Forwarded-For (if behind proxy) or direct connection
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const ip = req.ip;

    // Priority: X-Real-IP > first IP in X-Forwarded-For > req.ip
    if (realIp) {
      return realIp;
    } else if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, get the first one (client IP)
      return forwardedFor.split(',')[0].trim();
    } else {
      return ip;
    }
  },

  // Skip rate limiting for successful logins
  skip: (req, res) => {
    // This will be called after the request, so we check if login was successful
    return res.statusCode === 200;
  },

  handler: (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                     req.headers['x-real-ip'] ||
                     req.ip;

    console.log(`[RATE LIMIT] IP ${clientIp} exceeded admin login attempts`);

    return res.status(429).json({
      success: false,
      message: "Too many login attempts from this IP address. Please try again after 24 hours.",
      retryAfter: "24 hours"
    });
  }
});

module.exports = { adminLoginLimiter };
