"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesService = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const catchAsyncError_middleware_1 = __importDefault(require("../middlewares/catchAsyncError.middleware"));
const redis_1 = require("../utils/redis");
exports.createCourse = (0, catchAsyncError_middleware_1.default)(async (data, res) => {
    const course = await course_model_1.default.create(data);
    const allCourses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions");
    await redis_1.redis.set("allCourses", JSON.stringify(allCourses));
    res.status(201).json({
        success: true,
        course,
    });
});
// get all courses
const getAllCoursesService = async (res) => {
    const courses = await course_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses,
    });
};
exports.getAllCoursesService = getAllCoursesService;
