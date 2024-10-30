import { Response } from "express";
import CourseModel from "../models/course.model";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import { redis } from "../utils/redis";

export const createCourse = catchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    const allCourses = await CourseModel.find().select(
      "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
    );
    await redis.set("allCourses", JSON.stringify(allCourses));
    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get all courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses,
  });
};
