"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
const redis_1 = require("./redis");
require("dotenv").config();
// parse environment variable to integrate with fallback value
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
// options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
const sendToken = async (user, res, statusCode) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    const userId = user?._id;
    // upload sessions to redis
    await redis_1.redis.set(userId, JSON.stringify(user));
    // only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    // console.log("Cookies sent:", res.get('Set-Cookie'));
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.default = sendToken;
