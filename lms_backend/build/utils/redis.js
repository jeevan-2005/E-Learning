"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
require("dotenv").config();
const ioredis_1 = require("ioredis");
const redisUrl = process.env.REDIS_URL;
const redisOptions = {
    connectTimeout: 30000, // Increase connection timeout to 30 seconds
    retryStrategy: function (times) {
        return Math.min(times * 50, 2000); // Retry strategy
    },
};
exports.redis = new ioredis_1.Redis(redisUrl, redisOptions);
exports.redis.on("error", (error) => {
    console.error("Redis client error:", error);
});
