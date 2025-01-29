import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendEmail from "../utils/mailSender";
import NotificationModel from "../models/notification.model";

// create course
const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface Thumbnail {
  public_id: string;
  url: string;
}

// edit course
const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data?.thumbnail;
      const courseId = req.params.id;
      const course = await CourseModel.findById(courseId);

      if (thumbnail.startsWith("https://res.cloudinary.com")) {
        data.thumbnail = course?.thumbnail;
      } else {
        await cloudinary.v2.uploader.destroy((course?.thumbnail as { public_id: string }).public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          new: true,
        }
      ).select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );

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

      res.status(201).json({
        success: true,
        updatedCourse,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// since there can can be many user(1000) sending request to get single course info so it may take time and server may go down so we can use redis here to store the data(but not all data).

// for both single course and all courses......

// fetch single course info without purchasing
const getSingleCourseUnpaid = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCourseExistInCache = await redis.get(courseId);
      if (isCourseExistInCache) {
        const course = JSON.parse(isCourseExistInCache);
        return res.status(201).json({
          success: true,
          course,
        });
      }

      const course = await CourseModel.findById(courseId).select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );

      await redis.set(courseId, JSON.stringify(course), "EX", 7 * 60 * 60 * 24); // 7 days expires

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// fetch all courses
const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isAllCoursesExistInCache = await redis.get("allCourses");
      if (isAllCoursesExistInCache) {
        const allCourses = JSON.parse(isAllCoursesExistInCache);
        return res.status(201).json({
          success: true,
          allCourses,
        });
      }
      const allCourses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );

      await redis.set("allCourses", JSON.stringify(allCourses));

      res.status(201).json({
        success: true,
        allCourses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course detials for paid user
const getSingleCoursePaid = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseList = req.user?.courses;
      const courseId = req.params.id;
      const course = await CourseModel.findById(courseId);

      const isCourseExistsInCourseList = courseList?.find(
        (course: any) => course._id.toString() === courseId
      );
    
      if (!isCourseExistsInCourseList && req.user?.role !== "admin" && course?.price !== 0) {
        return next(
          new ErrorHandler("You are not authorized to access this content", 400)
        );
      }
      
      const courseContent = course?.courseData;

      res.status(201).json({
        success: true,
        courseContent,
      });
    } catch (error: any) {
      return next(new ErrorHandler("get-course-content-error", 500));
    }
  }
);

// add question to course by user
interface IQuestionBody {
  question: string;
  courseId: string;
  courseContentId: string;
}

const addQuestion = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, courseContentId } = req.body as IQuestionBody;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      if (!mongoose.Types.ObjectId.isValid(courseContentId)) {
        return next(new ErrorHandler("Invalid course-content id", 400));
      }

      const courseContent = course?.courseData?.find(
        (content: any) => content._id.toString() === courseContentId
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid course-content id", 400));
      }
      const newQuestion: any = {
        user: req?.user,
        question,
        questionReplies: [],
      };
      // add this newQuestion to courseContent.questions
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer to the question
interface IAnswerBody {
  questionId: string;
  answer: string;
  courseId: string;
  courseContentId: string;
}
const addAnswer = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId, answer, courseId, courseContentId } =
        req.body as IAnswerBody;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      const courseContent = course?.courseData?.find(
        (content: any) => content._id.toString() === courseContentId
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid course-content id", 400));
      }

      const question = courseContent?.questions?.find(
        (ques: any) => ques._id.toString() === questionId
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      const newAnswer: any = {
        user: req?.user,
        answer,
        createdAt: new Date().toISOString(),
      };
      question?.questionReplies?.push(newAnswer);
      await course?.save();

      if (req?.user?._id?.toString() === question?.user?._id?.toString()) {
        await NotificationModel.create({
          userId: req.user?._id,
          title: "New Question Reply Received",
          message: `You have new question reply in ${courseContent?.title} in the course:${course?.name}`,
        });
      } else {
        // send email to the user that answer has been added by admin to question asked by the user...
        const data = {
          name: question?.user?.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/questionReply.ejs"),
          data
        );

        try {
          await sendEmail({
            email: question?.user?.email,
            subject: "Question Reply",
            template: "questionReply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        message: "Answer added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review to the course
interface IReviewBody {
  review: string;
  rating: number;
}

const addReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const courseList = req.user?.courses;

      const courseExists = courseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not authorized to access this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      const { review, rating } = req.body as IReviewBody;

      const newReview: any = {
        user: req?.user,
        comment: review,
        rating,
      };

      course?.reviews?.push(newReview);

      let avg = 0;
      course?.reviews.forEach((review: any) => {
        avg += review.rating;
      });

      course.rating = avg / course.reviews.length;

      await course?.save();

      const updatedCourse = await CourseModel.findById(courseId).select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );
      await redis.set(
        courseId,
        JSON.stringify(updatedCourse),
        "EX",
        7 * 60 * 60 * 24
      ); // 7 days expires

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

      await NotificationModel.create({
        userId: req?.user?._id,
        title: "New Course Review",
        message: `${req.user?.name} has given a review on the course ${course?.name}`,
      });

      res.status(200).json({
        success: true,
        message: "Review added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// giving reply to reviews by admin
interface IReplyReviewBody {
  adminReply: string;
  reviewId: string;
  courseId: string;
}

const addReviewReply = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { adminReply, reviewId, courseId } = req.body as IReplyReviewBody;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (review: any) => review._id.toString() === reviewId.toString()
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
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

      const updatedCourse = await CourseModel.findById(courseId).select(
        "-courseData.videoUrl -courseData.links -courseData.suggestions -courseData.questions"
      );
      await redis.set(
        courseId,
        JSON.stringify(updatedCourse),
        "EX",
        7 * 60 * 60 * 24
      ); // 7 days expires

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

      res.status(200).json({
        success: true,
        message: "Review reply by admin added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses
const getAllCoursesAdmin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete course by admin
const deleteCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({ courseId });
      const allCourses = await redis.get("allCourses");

      if (allCourses) {
        const courses = JSON.parse(allCourses);
        const newCourses = courses.filter(
          (course: any) => course._id.toString() !== courseId
        );
        await redis.set("allCourses", JSON.stringify(newCourses));
      }

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export {
  uploadCourse,
  editCourse,
  getSingleCourseUnpaid,
  getAllCourses,
  getSingleCoursePaid,
  addQuestion,
  addAnswer,
  addReview,
  addReviewReply,
  getAllCoursesAdmin,
  deleteCourse,
};
