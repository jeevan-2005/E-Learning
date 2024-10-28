import express from "express";
import {
  getAllNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";
import { updateAccessToken } from "../controllers/user.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getAllNotifications
);

notificationRouter.put(
  "/update-notification-status/:id",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  updateNotificationStatus
);

export default notificationRouter;
