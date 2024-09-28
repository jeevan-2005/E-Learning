import express from "express";
import {
  addAnswer,
  addQuestion,
  addReview,
  addReviewReply,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllCoursesAdmin,
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
courseRouter.get(
  "/get-all-courses",
  isAuth,
  authorizeRoles("admin"),
  getAllCoursesAdmin
);
courseRouter.delete(
  "/delete-course/:id",
  isAuth,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
