"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationStatus = exports.getAllNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const node_cron_1 = __importDefault(require("node-cron"));
const getAllNotifications = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const notifications = await notification_model_1.default.find().sort({
            createdAt: -1,
        });
        if (!notifications) {
            return next(new ErrorHandler_1.default("No notifications found", 404));
        }
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllNotifications = getAllNotifications;
const updateNotificationStatus = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const notification = await notification_model_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Notification not found", 404));
        }
        notification.status = "read";
        await notification.save();
        const notifications = await notification_model_1.default.find().sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateNotificationStatus = updateNotificationStatus;
// deleting notification after 24 hours which are read and created 1 month ago.
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notification_model_1.default.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
});
