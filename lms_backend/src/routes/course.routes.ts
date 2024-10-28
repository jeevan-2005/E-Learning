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
import { updateAccessToken } from "../controllers/user.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourseUnpaid);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuth,
  getSingleCoursePaid
);
courseRouter.put("/add-question", updateAccessToken, isAuth, addQuestion);
courseRouter.put("/add-answer", updateAccessToken, isAuth, addAnswer);
courseRouter.put("/add-review/:id", updateAccessToken, isAuth, addReview);
courseRouter.put(
  "/review-reply",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  addReviewReply
);
courseRouter.get(
  "/get-all-courses",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  getAllCoursesAdmin
);
courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuth,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
