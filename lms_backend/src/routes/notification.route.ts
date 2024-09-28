import express from "express";
import {
  getAllNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  isAuth,
  authorizeRoles("admin"),
  getAllNotifications
);

notificationRouter.put(
  "/update-notification-status/:id",
  isAuth,
  authorizeRoles("admin"),
  updateNotificationStatus
);

export default notificationRouter;
