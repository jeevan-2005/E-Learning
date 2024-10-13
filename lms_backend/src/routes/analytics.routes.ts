import express from "express";
import { authorizeRoles, isAuth } from "../middlewares/auth";
import {
  getCourseAnalytics,
  getOrdersAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  isAuth,
  authorizeRoles("admin"),
  getUserAnalytics
);
analyticsRouter.get(
  "/get-course-analytics",
  isAuth,
  authorizeRoles("admin"),
  getCourseAnalytics
);
analyticsRouter.get(
  "/get-order-analytics",
  isAuth,
  authorizeRoles("admin"),
  getOrdersAnalytics
);

export default analyticsRouter;
