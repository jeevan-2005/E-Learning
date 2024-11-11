require("dotenv").config();
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL as string;
const redisOptions = {
  connectTimeout: 30000, // Increase connection timeout to 30 seconds
  retryStrategy: function (times: number) {
    return Math.min(times * 50, 2000); // Retry strategy
  },
};

export const redis = new Redis(redisUrl, redisOptions);

redis.on("error", (error) => {
  console.error("Redis client error:", error);
});
