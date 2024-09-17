import { Response } from "express";
import CourseModel from "../models/course.model";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";

export const createCourse = catchAsyncError(
    async (data: any, res: Response) => {
        const course = await CourseModel.create(data);

        res.status(201).json({
            success: true,
            course,
        });
    }
)