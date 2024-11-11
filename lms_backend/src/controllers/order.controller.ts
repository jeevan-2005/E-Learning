require("dotenv").config();
import { IOrder } from "../models/order.model";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";
import { UserModel } from "../models/user.model";
import CourseModel from "../models/course.model";
import NotificationModel from "../models/notification.model";
import sendEmail from "../utils/mailSender";
import ejs from "ejs";
import path from "path";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized", 400));
          }
        }
      }

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
        message: `${user?.name} has placed an order for ${course?.name}`,
      });

      user?.courses.push({
        _id: course?._id,
      } as any);

      await redis.set(user?._id as string, JSON.stringify(user) as any);

      await user?.save();

      if (course?.purchased) {
        course.purchased += 1;
      } else {
        course.purchased = 1;
      }

      await course?.save();

      const updatedCourse = await CourseModel.findById(course?._id).select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );

      await redis.set(course?._id as string, JSON.stringify(course) as any);

      const redisAllCourses = await redis.get("allCourses");
      if (redisAllCourses) {
        const allCourses = JSON.parse(redisAllCourses);
        const newAllCourses = allCourses.map((course: any) => {
          if (course._id.toString() === courseId) {
            return updatedCourse;
          }
          return course;
        });
        await redis.set("allCourses", JSON.stringify(newAllCourses));
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const getStripePublishableKey = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

const newPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        clientSecret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { createOrder, getAllOrders, getStripePublishableKey, newPayment };
