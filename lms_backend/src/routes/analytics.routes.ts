import express from "express";
import { authorizeRoles, isAuth } from "../middlewares/auth";
import {
  getCourseAnalytics,
  getOrdersAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";
import { updateAccessToken } from "../controllers/user.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getUserAnalytics
);
analyticsRouter.get(
  "/get-course-analytics",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getCourseAnalytics
);
analyticsRouter.get(
  "/get-order-analytics",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getOrdersAnalytics
);

export default analyticsRouter;
