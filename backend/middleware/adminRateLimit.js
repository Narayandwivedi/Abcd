const rateLimit = require("express-rate-limit");

// Rate limiter for admin login - 3 attempts per 24 hours
const adminLoginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 24 hours."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts from this IP. Please try again after 24 hours.",
      retryAfter: "24 hours"
    });
  }
});

module.exports = { adminLoginLimiter };
