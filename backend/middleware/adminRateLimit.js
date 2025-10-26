const rateLimit = require("express-rate-limit");

// Simple rate limiter for admin login - 5 attempts per hour per IP
const adminLoginLimiter = rateLimit({
  windowMs: 24 *60 * 60 * 1000, // 1 hour window
  max: 3, // Limit each IP to 5 requests per windowMs

  message: {
    success: false,
    message: "Too many login attempts. Please try again after 1 hour."
  },

  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable old X-RateLimit-* headers

  // Custom response handler
  handler: (req, res) => {
    console.log(`[RATE LIMIT] IP ${req.ip} exceeded login attempts`);

    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 1 hour."
    });
  }
});

module.exports = { adminLoginLimiter };
