import express from "express";
import {
  addAnswer,
  addQuestion,
  addReview,
  addReviewReply,
  editCourse,
  getAllCourses,
  getSingleCoursePaid,
  getSingleCourseUnpaid,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuth } from "../middlewares/auth";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuth,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuth,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourseUnpaid);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-course-content/:id", isAuth, getSingleCoursePaid);
courseRouter.put("/add-question", isAuth, addQuestion);
courseRouter.put("/add-answer", isAuth, addAnswer);
courseRouter.put("/add-review/:id", isAuth, addReview);
courseRouter.put(
  "/review-reply",
  isAuth,
  authorizeRoles("admin"),
  addReviewReply
);

export default courseRouter;
