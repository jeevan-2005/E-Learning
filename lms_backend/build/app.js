"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
exports.app = (0, express_1.default)();
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cookie-parser
exports.app.use((0, cookie_parser_1.default)());
// cors
exports.app.use((0, cors_1.default)({
    origin: ["https://e-learning-lms-ten.vercel.app"],
    credentials: true,
}));
// api request rate-limiter
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
// user Routes
exports.app.use("/api/v1/user", user_routes_1.default);
exports.app.use("/api/v1/course", course_routes_1.default);
exports.app.use("/api/v1/order", order_route_1.default);
exports.app.use("/api/v1/notification", notification_route_1.default);
exports.app.use("/api/v1/analytics", analytics_routes_1.default);
exports.app.use("/api/v1/layout", layout_route_1.default);
// health-check test api...
exports.app.get("/health-check", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Health-Check : server is running fine.",
    });
});
// in no route exists
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} is not found.`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(limiter);
// using custom errorMiddleware
exports.app.use(error_middleware_1.default);
