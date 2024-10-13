import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analyticsGenerator";
import { UserModel } from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// users analytics -- admin only
const getUserAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(UserModel as any);

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// course analytics -- admin only
const getCourseAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel as any);

      return res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// orders analytics -- admin only
const getOrdersAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel as any);

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { getUserAnalytics, getCourseAnalytics, getOrdersAnalytics };
