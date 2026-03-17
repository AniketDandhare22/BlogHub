import rateLimit from "express-rate-limit";

/* 🔒 Auth limiter (strict) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    res.status(429).json({
      message: "Too many login attempts. Try again later.",
    });
  },
});

/* 🌐 General API limiter */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});