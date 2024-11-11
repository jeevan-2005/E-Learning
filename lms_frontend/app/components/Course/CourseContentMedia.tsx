import { style } from "../../styles/styles";
import CoursePlayer from "../../utils/CoursePlayer";
import React, { FC, useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import avatarDefault from "../../../public/assests/avatar.webp";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useAddAnswerToQuestionMutation,
  useAddNewQuestionMutation,
  useAddReviewMutation,
  useAddReviewReplyMutation,
} from "../../../redux/features/course/courseApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "../../utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
});

type Props = {
  content: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
  course: any;
  courseRefetch: any;
};

const CourseContentMedia: FC<Props> = ({
  content,
  id,
  activeVideo,
  user,
  setActiveVideo,
  refetch,
  course,
  courseRefetch,
}) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reviewReply, setReviewReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [
    addNewQuestion,
    { isSuccess, isLoading: questionCreationLoading, error },
  ] = useAddNewQuestionMutation({});

  const [
    addAnswerToQuestion,
    { isSuccess: answerSuccess, error: answerError, isLoading: answerLoading },
  ] = useAddAnswerToQuestionMutation({});

  const [
    addReview,
    { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewLoading },
  ] = useAddReviewMutation({});

  const [
    addReviewReply,
    {
      isSuccess: reviewReplySuccess,
      error: reviewReplyError,
      isLoading: reviewReplyLoading,
    },
  ] = useAddReviewReplyMutation({});

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      toast.success("Question added successfully");
      refetch();
      socketId.emit("notification", {
        title: "New Question Received",
        message: `${user?.name} has asked a question in ${content[activeVideo]?.title} in the course:${course?.name}`,
        userId: user?._id,
      });
    }

    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (answerSuccess) {
      setAnswer("");
      toast.success("Answer added successfully");
      refetch();
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: "New Question Reply Received",
          message: `You have new question reply in ${content[activeVideo]?.title} in the course:${course?.name}`,
          userId: user?._id,
        });
      }
    }

    if (answerError && "data" in answerError) {
      const errorData = answerError.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [answerSuccess, answerError]);

  useEffect(() => {
    if (reviewSuccess) {
      setReview("");
      toast.success("Review added successfully");
      courseRefetch();
      socketId.emit("notification", {
        title: "New Course Review",
        message: `${user?.name} has given a review on the course:${course?.name}`,
        userId: user?._id,
      });
    }
    if (reviewError && "data" in reviewError) {
      const errorData = reviewError.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [reviewSuccess, reviewError]);

  useEffect(() => {
    if (reviewReplySuccess) {
      setReviewReply("");
      toast.success("Review Reply added successfully");
      courseRefetch();
    }
    if (reviewReplyError && "data" in reviewReplyError) {
      const errorData = reviewReplyError.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [reviewReplySuccess, reviewReplyError]);

  const handleAddQuestion = async () => {
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      await addNewQuestion({
        question,
        courseId: id,
        courseContentId: content[activeVideo]?._id,
      });
    }
  };

  const handleAnswerSubmit = async () => {
    await addAnswerToQuestion({
      questionId,
      answer,
      courseId: id,
      courseContentId: content[activeVideo]?._id,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      await addReview({
        courseId: id,
        review,
        rating,
      });
    }
  };

  const handleReviewReplySubmit = async () => {
    if (reviewReply.length === 0) {
      toast.error("Review Reply can't be empty");
    } else {
      await addReviewReply({
        adminReply: reviewReply,
        reviewId,
        courseId: id,
      });
    }
  };

  const isReviewExists = course?.reviews?.find(
    (item: any) => item?.user?._id == user?._id
  );

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={content[activeVideo]?.title}
        videoUrl={content[activeVideo]?.videoUrl}
      />
      <div className="flex items-center justify-between w-full my-3">
        <div
          className={`${style.btn2} !py-[unset] ${
            activeVideo === 0 && "!cursor-not-allowed opacity-[0.7]"
          } `}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft size={20} className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${style.btn2} !py-[unset] ${
            activeVideo === content.length - 1 &&
            "!cursor-not-allowed opacity-[0.6]"
          } `}
          onClick={() =>
            setActiveVideo(
              activeVideo === content.length - 1
                ? content.length - 1
                : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight size={20} className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] text-black dark:text-white">
        {content[activeVideo]?.title}
      </h1>
      <br />
      <div className="w-full flex items-center justify-between p-3 px-4 bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map(
          (text: string, index: number) => (
            <h5
              key={index}
              className={`text-black dark:text-white 800px:text-[20px] cursor-pointer ${
                activeBar === index && "!text-red-500"
              }`}
              onClick={() => setActiveBar(index)}
            >
              {text}
            </h5>
          )
        )}
      </div>
      <br />
      {activeBar === 0 && (
        <div className="w-full">
          <p className="text-black dark:text-white whitespace-pre-line mb-3 800px:text-[18px]">
            {content[activeVideo]?.description}
          </p>
        </div>
      )}
      {activeBar === 1 && (
        <div className="w-full">
          {content[activeVideo]?.links?.map((link: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="text-black dark:text-white 800px:text-[20px] inline-block">
                {link.title && link.title + " : "}
              </h2>
              <a
                href={link.url}
                className="inline-block 800px:text-[20px] 800px:ml-2 text-[#38a9ff] hover:underline"
              >
                {link.url}
              </a>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <>
          {user?.role !== "admin" && (
            <>
              <div className="w-full flex">
                <Image
                  src={user?.avatar ? user?.avatar?.url : avatarDefault}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="rounded-full h-[50px] w-[50px]"
                />
                <textarea
                  name=""
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  cols={40}
                  rows={5}
                  placeholder="ask any question..."
                  className="outline-none bg-transparent ml-3 border dark:border-[#ffffff57] border-[#00000030]  800px:w-full p-2 rounded w-[90%] font-Poppins 800px:text-[18px] text-black dark:text-white"
                ></textarea>
              </div>
              <div className="w-full flex justify-end mt-2">
                <div
                  className={`${style.btn2} ${
                    questionCreationLoading && "!cursor-no-drop opacity-[0.7]"
                  } !mt-0 !h-[35px] !w-[120px] !rounded-lg `}
                  onClick={
                    questionCreationLoading ? () => {} : handleAddQuestion
                  }
                >
                  {questionCreationLoading ? "Submitting..." : "Submit"}
                </div>
              </div>
            </>
          )}
          <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-[#0000003b]  my-4"></div>
          <div>
            <CommentReply
              content={content}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerLoading={answerLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && !(user?.role === "admin") && (
              <>
                <div className="w-full flex items-center justify-between">
                  <Image
                    src={user?.avatar ? user?.avatar?.url : avatarDefault}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full h-[50px] w-[50px]"
                  />
                  <div className="flex items-center">
                    <h5 className="text-black dark:text-white 800px:text-[20px] ml-6 font-[600]">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex ml-4">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            size={25}
                            className="cursor-pointer mr-1"
                            color="rgb(246, 186, 0)"
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            size={25}
                            className="cursor-pointer mr-1"
                            color="rgb(246, 186, 0)"
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <textarea
                  name=""
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  cols={40}
                  rows={5}
                  placeholder="write a review..."
                  className="outline-none bg-transparent border mt-2 dark:border-[#ffffff57] border-[#00000030] 800px:w-full p-2 rounded w-[90%] font-Poppins 800px:text-[18px] dark:text-white text-black"
                ></textarea>
                <div className="w-full flex justify-end mt-2">
                  <div
                    className={`${style.btn2} ${
                      reviewLoading && "!cursor-no-drop opacity-[0.7]"
                    } !mt-0 !h-[35px] !w-[120px] !rounded-lg `}
                    onClick={handleReviewSubmit}
                    aria-disabled={reviewLoading}
                  >
                    {reviewLoading ? "Submitting..." : "Submit"}
                  </div>
                </div>
              </>
            )}
            <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-[#0000003b]  my-4"></div>
            <div className="w-full">
              {course?.reviews &&
                [...course.reviews]
                  .reverse()
                  .map((review: any, index: number) => (
                    <ReviewItem
                      key={index}
                      review={review}
                      user={user}
                      reviewReply={reviewReply}
                      setReviewReply={setReviewReply}
                      handleReviewReplySubmit={handleReviewReplySubmit}
                      reviewReplyLoading={reviewReplyLoading}
                      reviewId={reviewId}
                      setReviewId={setReviewId}
                    />
                  ))}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  content,
  activeVideo,
  answer,
  setAnswer,
  questionId,
  handleAnswerSubmit,
  setQuestionId,
  answerLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {[...content[activeVideo]?.questions]
          .reverse()
          ?.map((question: any, index: number) => (
            <CommentItem
              key={index}
              question={question}
              answer={answer}
              setAnswer={setAnswer}
              questionId={questionId}
              setQuestionId={setQuestionId}
              handleAnswerSubmit={handleAnswerSubmit}
              answerLoading={answerLoading}
            />
          ))}
      </div>
    </>
  );
};

const ReviewItem = ({
  review,
  user,
  reviewReply,
  setReviewReply,
  handleReviewReplySubmit,
  reviewReplyLoading,
  reviewId,
  setReviewId,
}: any) => {
  const [isReplyActive, setIsReplyActive] = useState(false);

  return (
    <div className="w-full my-5">
      <div className="flex w-full text-black dark:text-white">
        <div>
          <Image
            src={
              review?.user?.avatar ? review?.user?.avatar?.url : avatarDefault
            }
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full h-[50px] w-[50px]"
          />
        </div>
        <div className="ml-3">
          <h1 className="text-[18px]">{review?.user?.name}</h1>
          <Ratings rating={review?.rating} />
          <p>{review?.comment}</p>
          <small className="dark:text-[#ffffff83] text-[#00000080]">
            {format(review?.createdAt)}
          </small>
          <div className="w-full mt-2">
            {user?.role === "admin" && (
              <span
                className="cursor-pointer dark:text-[#ffffffba] text-[#000000bf] mr-2"
                onClick={() => {
                  setIsReplyActive(
                    reviewId !== review?._id ? true : !isReplyActive
                  );
                  setReviewId(review?._id);
                }}
              >
                {!isReplyActive || reviewId !== review?._id
                  ? review?.commentReplies?.length > 0
                    ? "View Replies"
                    : "Add Reply"
                  : "Hide Replies"}
              </span>
            )}
            {user?.role === "user" && (
              <span
                className="cursor-pointer dark:text-[#ffffffba] text-[#000000bf] mr-2"
                onClick={() => {
                  setIsReplyActive(!isReplyActive);
                }}
              >
                {!isReplyActive
                  ? review?.commentReplies?.length > 0 && "View Replies"
                  : "Hide Replies"}
              </span>
            )}
          </div>
        </div>
      </div>
      {isReplyActive &&
        (user.role === "admin" ? reviewId === review?._id : true) && (
          <>
            {review?.commentReplies &&
              [...review?.commentReplies]
                .reverse()
                .map((reply: any, index: number) => (
                  <div
                    className="w-full flex my-5 800px:ml-16 text-black dark:text-white"
                    key={index}
                  >
                    <Image
                      src={
                        reply?.user?.avatar
                          ? reply?.user?.avatar?.url
                          : avatarDefault
                      }
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-full h-[50px] w-[50px]"
                    />
                    <div className="pl-3">
                      <div className="flex items-center">
                        <h5 className="text-[20px] text-black dark:text-white">
                          {reply?.user?.name}
                        </h5>
                        {reply?.user?.role === "admin" && (
                          <VscVerifiedFilled className="ml-2 text-[20px] text-[#50c750]" />
                        )}
                      </div>
                      <p className="text-[16px] text-black dark:text-white">
                        {reply?.comment}
                      </p>
                      <small className="dark:text-[#ffffff83] text-[#00000080]">
                        {reply?.createdAt ? format(reply?.createdAt) : ""}
                      </small>
                    </div>
                  </div>
                ))}
            {user.role === "admin" && (
              <div className="w-full flex relative">
                <input
                  type="text"
                  placeholder="enter your reply..."
                  value={reviewReply}
                  onChange={(e) => setReviewReply(e.target.value)}
                  className="block 800px:ml-12 mt-2 outline-none text-black dark:text-white bg-transparent border-b dark:border-[#fff] border-[#000] p-[5px] w-[95%]"
                />
                <button
                  type="submit"
                  className={`absolute bottom-1 right-1 text-black dark:text-white ${
                    reviewReply === "" || reviewReplyLoading
                      ? "!cursor-not-allowed opacity-60"
                      : "!cursor-pointer"
                  }`}
                  onClick={handleReviewReplySubmit}
                  disabled={reviewReply === "" || reviewReplyLoading}
                >
                  {reviewReplyLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
};

const CommentItem = ({
  question,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <Image
            src={
              question?.user?.avatar
                ? question?.user?.avatar?.url
                : avatarDefault
            }
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full h-[50px] w-[50px]"
          />
          <div className="pl-3">
            <h5 className="text-[20px] text-black dark:text-white">
              {question?.user?.name}
            </h5>
            <p className="text-[16px] text-black dark:text-white">
              {question?.question}
            </p>
            <small className="dark:text-[#ffffff83] text-[#00000080]">
              {question?.createdAt ? format(question?.createdAt) : ""}
            </small>
          </div>
        </div>
        <div>
          <span
            className="800px:pl-16 cursor-pointer dark:text-[#ffffff83] text-[#000000bf] mr-2"
            onClick={() => {
              setReplyActive(
                questionId !== question?._id ? true : !replyActive
              );
              setQuestionId(question?._id);
            }}
          >
            {!replyActive || questionId !== question?._id
              ? question?.questionReplies.length > 0
                ? "View Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer ml-4 inline-block dark:fill-[#ffffff83] fill-[#000000bf]"
          />
          <span className="ml-1 dark:text-[#ffffff83] text-[#000000bf] cursor-pointer">
            {question?.questionReplies?.length}
          </span>
        </div>
        {replyActive && questionId === question?._id && (
          <>
            {question?.questionReplies?.map((reply: any, index: number) => (
              <>
                <div
                  className="w-full flex my-5 800px:ml-16 text-black dark:text-white"
                  key={index}
                >
                  <Image
                    src={
                      reply?.user?.avatar
                        ? reply?.user?.avatar?.url
                        : avatarDefault
                    }
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full h-[50px] w-[50px]"
                  />
                  <div className="pl-3">
                    <div className="flex items-center">
                      <h5 className="text-[20px] text-black dark:text-white">
                        {reply?.user?.name}
                      </h5>
                      {reply?.user?.role === "admin" && (
                        <VscVerifiedFilled className="ml-2 text-[20px] text-[#50c750]" />
                      )}
                    </div>
                    <p className="text-[16px] text-black dark:text-white">
                      {reply?.answer}
                    </p>
                    <small className="dark:text-[#ffffff83] text-[#00000080]">
                      {reply?.createdAt ? format(reply?.createdAt) : ""}
                    </small>
                  </div>
                </div>
              </>
            ))}
            <div className="w-full flex relative">
              <input
                type="text"
                placeholder="enter your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="block 800px:ml-12 mt-2 outline-none text-black dark:text-white bg-transparent border-b dark:border-[#fff] border-[#000] p-[5px] w-[95%]"
              />
              <button
                type="submit"
                className={`absolute bottom-1 right-1 text-black dark:text-white ${
                  answer === "" || answerLoading
                    ? "!cursor-not-allowed opacity-60"
                    : "!cursor-pointer"
                }`}
                onClick={handleAnswerSubmit}
                disabled={answer === "" || answerLoading}
              >
                {answerLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
