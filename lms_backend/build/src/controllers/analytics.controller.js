"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAnalytics = exports.getCourseAnalytics = exports.getUserAnalytics = void 0;
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const analyticsGenerator_1 = require("../utils/analyticsGenerator");
const user_model_1 = require("../models/user.model");
const course_model_1 = __importDefault(require("../models/course.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
// users analytics -- admin only
const getUserAnalytics = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const users = await (0, analyticsGenerator_1.generateLast12MonthsData)(user_model_1.UserModel);
        return res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getUserAnalytics = getUserAnalytics;
// course analytics -- admin only
const getCourseAnalytics = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const courses = await (0, analyticsGenerator_1.generateLast12MonthsData)(course_model_1.default);
        return res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getCourseAnalytics = getCourseAnalytics;
// orders analytics -- admin only
const getOrdersAnalytics = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const orders = await (0, analyticsGenerator_1.generateLast12MonthsData)(order_model_1.default);
        return res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getOrdersAnalytics = getOrdersAnalytics;
