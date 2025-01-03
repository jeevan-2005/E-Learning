"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.getStripePublishableKey = exports.getAllOrders = exports.createOrder = void 0;
require("dotenv").config();
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = require("../models/user.model");
const course_model_1 = __importDefault(require("../models/course.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const createOrder = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("Payment not authorized", 400));
                }
            }
        }
        const user = await user_model_1.UserModel.findById(req.user?._id);
        const isCourseExists = user?.courses.some((course) => course._id.toString() === courseId);
        if (isCourseExists) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const orderData = {
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
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/orderConfirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, mailSender_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "orderConfirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        await notification_model_1.default.create({
            userId: user?._id,
            title: "New Order",
            message: `${user?.name} has placed an order for ${course?.name}`,
        });
        user?.courses.push({
            _id: course?._id,
        });
        await redis_1.redis.set(user?._id, JSON.stringify(user));
        await user?.save();
        if (course?.purchased) {
            course.purchased += 1;
        }
        else {
            course.purchased = 1;
        }
        await course?.save();
        const updatedCourse = await course_model_1.default.findById(course?._id).select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
        await redis_1.redis.set(course?._id, JSON.stringify(course));
        const redisAllCourses = await redis_1.redis.get("allCourses");
        if (redisAllCourses) {
            const allCourses = JSON.parse(redisAllCourses);
            const newAllCourses = allCourses.map((course) => {
                if (course._id.toString() === courseId) {
                    return updatedCourse;
                }
                return course;
            });
            await redis_1.redis.set("allCourses", JSON.stringify(newAllCourses));
        }
        (0, order_service_1.newOrder)(orderData, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.createOrder = createOrder;
// get all orders
const getAllOrders = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllOrders = getAllOrders;
const getStripePublishableKey = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
exports.getStripePublishableKey = getStripePublishableKey;
const newPayment = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.newPayment = newPayment;
