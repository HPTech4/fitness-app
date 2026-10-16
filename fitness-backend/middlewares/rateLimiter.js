// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Strict limiter for auth endpoints — prevents brute-force
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  message: {
    message: 'Too many attempts. Please try again in 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for all API routes
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200, // 200 requests per 15 min
  message: {
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };