import { IOrder } from "../models/order.model";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";
import { UserModel } from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import NotificationModel from "../models/notification.model";
import sendEmail from "../utils/mailSender";
import ejs from "ejs";
import path from "path";
import { getAllOrdersService, newOrder } from "../services/order.service";

const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await UserModel.findById(req.user?._id);

      const isCourseExists = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (isCourseExists) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const orderData: any = {
        userId: user?._id,
        courseId: course?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: courseId.slice(0, 6),
          userName: user?.name,
          courseName: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/orderConfirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendEmail({
            email: user.email,
            subject: "Order Confirmation",
            template: "orderConfirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      await NotificationModel.create({
        userId: user?._id,
        title: "New Order",
        message: `${user?.name} has placed an order for ${course?.name} course `,
      });

      user?.courses.push({
        _id: course?._id,
      } as any);

      await user?.save();

      if (course?.purchased) {
        course.purchased += 1;
      } else {
        course.purchased = 1;
      }

      newOrder(orderData, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all orders
const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { createOrder, getAllOrders };
