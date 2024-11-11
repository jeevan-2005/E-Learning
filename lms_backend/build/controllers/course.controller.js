"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.getAllCoursesAdmin = exports.addReviewReply = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getSingleCoursePaid = exports.getAllCourses = exports.getSingleCourseUnpaid = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
// create course
const uploadCourse = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.uploadCourse = uploadCourse;
// edit course
const editCourse = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data?.thumbnail;
        const courseId = req.params.id;
        const course = await course_model_1.default.findById(courseId);
        if (thumbnail.startsWith("https://res.cloudinary.com")) {
            data.thumbnail = course?.thumbnail;
        }
        else {
            await cloudinary_1.default.v2.uploader.destroy((course?.thumbnail).public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const updatedCourse = await course_model_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, {
            new: true,
        }).select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
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
        res.status(201).json({
            success: true,
            updatedCourse,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editCourse = editCourse;
// since there can can be many user(1000) sending request to get single course info so it may take time and server may go down so we can use redis here to store the data(but not all data).
// for both single course and all courses......
// fetch single course info without purchasing
const getSingleCourseUnpaid = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCourseExistInCache = await redis_1.redis.get(courseId);
        if (isCourseExistInCache) {
            const course = JSON.parse(isCourseExistInCache);
            return res.status(201).json({
                success: true,
                course,
            });
        }
        const course = await course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 7 * 60 * 60 * 24); // 7 days expires
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getSingleCourseUnpaid = getSingleCourseUnpaid;
// fetch all courses
const getAllCourses = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const isAllCoursesExistInCache = await redis_1.redis.get("allCourses");
        if (isAllCoursesExistInCache) {
            const allCourses = JSON.parse(isAllCoursesExistInCache);
            return res.status(201).json({
                success: true,
                allCourses,
            });
        }
        const allCourses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
        await redis_1.redis.set("allCourses", JSON.stringify(allCourses));
        res.status(201).json({
            success: true,
            allCourses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllCourses = getAllCourses;
// get course detials for paid user
const getSingleCoursePaid = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const courseList = req.user?.courses;
        const courseId = req.params.id;
        const isCourseExistsInCourseList = courseList?.find((course) => course._id.toString() === courseId);
        if (!isCourseExistsInCourseList && req.user?.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to access this content", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        const courseContent = course?.courseData;
        res.status(201).json({
            success: true,
            courseContent,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getSingleCoursePaid = getSingleCoursePaid;
const addQuestion = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { question, courseId, courseContentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Invalid course id", 400));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(courseContentId)) {
            return next(new ErrorHandler_1.default("Invalid course-content id", 400));
        }
        const courseContent = course?.courseData?.find((content) => content._id.toString() === courseContentId);
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid course-content id", 400));
        }
        const newQuestion = {
            user: req?.user,
            question,
            questionReplies: [],
        };
        // add this newQuestion to courseContent.questions
        courseContent.questions.push(newQuestion);
        await notification_model_1.default.create({
            userId: req?.user?._id,
            title: "New Question Received",
            message: `${req?.user?.name} has asked a question in ${courseContent?.title} in the course:${course?.name}`,
        });
        await course?.save();
        res.status(200).json({
            success: true,
            message: "Question added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addQuestion = addQuestion;
const addAnswer = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { questionId, answer, courseId, courseContentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Invalid course id", 400));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(questionId)) {
            return next(new ErrorHandler_1.default("Invalid question id", 400));
        }
        const courseContent = course?.courseData?.find((content) => content._id.toString() === courseContentId);
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid course-content id", 400));
        }
        const question = courseContent?.questions?.find((ques) => ques._id.toString() === questionId);
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id", 400));
        }
        const newAnswer = {
            user: req?.user,
            answer,
            createdAt: new Date().toISOString(),
        };
        question?.questionReplies?.push(newAnswer);
        await course?.save();
        if (req?.user?._id?.toString() === question?.user?._id?.toString()) {
            await notification_model_1.default.create({
                userId: req.user?._id,
                title: "New Question Reply Received",
                message: `You have new question reply in ${courseContent?.title} in the course:${course?.name}`,
            });
        }
        else {
            // send email to the user that answer has been added by admin to question asked by the user...
            const data = {
                name: question?.user?.name,
                title: courseContent.title,
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/questionReply.ejs"), data);
            try {
                await (0, mailSender_1.default)({
                    email: question?.user?.email,
                    subject: "Question Reply",
                    template: "questionReply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            message: "Answer added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addAnswer = addAnswer;
const addReview = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const courseList = req.user?.courses;
        const courseExists = courseList?.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not authorized to access this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Invalid course id", 400));
        }
        const { review, rating } = req.body;
        const newReview = {
            user: req?.user,
            comment: review,
            rating,
        };
        course?.reviews?.push(newReview);
        let avg = 0;
        course?.reviews.forEach((review) => {
            avg += review.rating;
        });
        course.rating = avg / course.reviews.length;
        await course?.save();
        const updatedCourse = await course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
        await redis_1.redis.set(courseId, JSON.stringify(updatedCourse), "EX", 7 * 60 * 60 * 24); // 7 days expires
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
        await notification_model_1.default.create({
            userId: req?.user?._id,
            title: "New Course Review",
            message: `${req.user?.name} has given a review on the course ${course?.name}`,
        });
        res.status(200).json({
            success: true,
            message: "Review added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = addReview;
const addReviewReply = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const { adminReply, reviewId, courseId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const review = course?.reviews?.find((review) => review._id.toString() === reviewId.toString());
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 404));
        }
        const replyData = {
            user: req?.user,
            comment: adminReply,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review?.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(replyData);
        await course?.save();
        const updatedCourse = await course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
        await redis_1.redis.set(courseId, JSON.stringify(updatedCourse), "EX", 7 * 60 * 60 * 24); // 7 days expires
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
        res.status(200).json({
            success: true,
            message: "Review reply by admin added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReviewReply = addReviewReply;
// get all courses
const getAllCoursesAdmin = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllCoursesAdmin = getAllCoursesAdmin;
// delete course by admin
const deleteCourse = (0, catchAsyncError_middleware_1.default)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        await course.deleteOne({ courseId });
        const allCourses = await redis_1.redis.get("allCourses");
        if (allCourses) {
            const courses = JSON.parse(allCourses);
            const newCourses = courses.filter((course) => course._id.toString() !== courseId);
            await redis_1.redis.set("allCourses", JSON.stringify(newCourses));
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteCourse = deleteCourse;
