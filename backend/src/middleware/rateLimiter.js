import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),

  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Try again later.",
    });
  },
});

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});