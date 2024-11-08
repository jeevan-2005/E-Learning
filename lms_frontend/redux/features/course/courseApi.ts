import { METHODS } from "http";
import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/course/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/course/get-all-courses", //only for admin functionality
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllCoursesUser: builder.query({
      query: () => ({
        url: "/course/get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `course/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getSingleCourseDetails: builder.query({
      query: (id) => ({
        url: `/course/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getPurchasedCourseDetials: builder.query({
      query: (id) => ({
        url: `/course/get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, courseContentId }) => ({
        url: `/course/add-question`,
        method: "PUT",
        body: {
          question,
          courseId,
          courseContentId,
        },
        credentials: "include" as const,
      }),
    }),
    addAnswerToQuestion: builder.mutation({
      query: ({ questionId, answer, courseId, courseContentId }) => ({
        url: `/course/add-answer`,
        method: "PUT",
        body: {
          answer,
          questionId,
          courseId,
          courseContentId,
        },
        credentials: "include" as const,
      }),
    }),
    addReview: builder.mutation({
      query: ({ courseId, review, rating }) => ({
        url: `/course/add-review/${courseId}`,
        method: "PUT",
        body: {
          review,
          rating,
        },
        credentials: "include" as const,
      }),
    }),
    addReviewReply: builder.mutation({
      query: ({ adminReply, reviewId, courseId }) => ({
        url: "/course/review-reply",
        method: "PUT",
        body: {
          adminReply,
          reviewId,
          courseId,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetAllCoursesUserQuery,
  useGetSingleCourseDetailsQuery,
  useGetPurchasedCourseDetialsQuery,
  useAddNewQuestionMutation,
  useAddAnswerToQuestionMutation,
  useAddReviewMutation,
  useAddReviewReplyMutation,
} = courseApi;
