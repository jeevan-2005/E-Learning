"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const notificationRouter = express_1.default.Router();
notificationRouter.get("/get-notifications", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), notification_controller_1.getAllNotifications);
notificationRouter.put("/update-notification-status/:id", user_controller_1.updateAccessToken, auth_1.isAuth, (0, auth_1.authorizeRoles)("admin"), notification_controller_1.updateNotificationStatus);
exports.default = notificationRouter;
