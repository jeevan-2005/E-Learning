import { style } from "../../styles/styles";
import CoursePlayer from "../../utils/CoursePlayer";
import Ratings from "../../utils/Ratings";
import React, { useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import Link from "next/link";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckoutForm";
import avatarDefault from "../../../public/assests/avatar.webp";
import Image from "next/image";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type Props = {
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
  course: any;
  stripePromise: any;
  clientSecret: string;
};

const CourseDetails: React.FC<Props> = ({
  course,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: setOpenAuthModel,
}) => {
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = userData?.user;
  const [open, setOpen] = useState(false);

  const discountPercentage = (
    ((course.estimatedPrice - course.price) / course.estimatedPrice) *
    100
  ).toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === course._id);

  const router = useRouter();

  const handleOrder = () => {
    if (user) {
      if(course?.price === 0){
        router.push(`/course-access/${course?._id}`)
        return;
      }
      setOpen(true);
    } else {
      setRoute("Login");
      setOpenAuthModel(true);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-[90%] m-auto py-5">
      <div className="w-full flex flex-col-reverse 800px:flex-row">
        <div className="w-full 800px:w-[65%] 800px:pr-5">
          <h1 className="font-Poppins text-[25px] text-black dark:text-white font-[600]">
            {course?.name}
          </h1>
          <div className="w-full flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={course?.rating} />
              <h5 className="text-black dark:text-white">
                {course?.reviews?.length} Reviews
              </h5>
            </div>
            <h5 className="text-black dark:text-white">
              {course?.purchased} Students
            </h5>
          </div>
          <br />
          <h1 className="font-Poppins text-[25px] mb-2 text-black dark:text-white font-[600]">
            What you will learn in this course?
          </h1>
          <div>
            {course?.benefits?.map((benefit: any, index: number) => (
              <div key={index} className="flex items-center py-1 w-full">
                <IoCheckmarkDoneOutline
                  size={20}
                  className="text-black dark:text-white"
                />
                <p className="text-black dark:text-white pl-2">
                  {benefit.title}
                </p>
              </div>
            ))}
          </div>
          <br />
          <h1 className="font-Poppins text-[25px] mb-2 text-black dark:text-white font-[600]">
            What are the prerequisites for this course?
          </h1>
          <div>
            {course?.prerequisites?.map((prerequisite: any, index: number) => (
              <div key={index} className="flex items-center py-1 w-full">
                <IoCheckmarkDoneOutline
                  size={20}
                  className="text-black dark:text-white"
                />
                <p className="text-black dark:text-white pl-2">
                  {prerequisite.title}
                </p>
              </div>
            ))}
          </div>
          <br />
          <div>
            <h1 className="font-Poppins text-[25px] mb-2 text-black dark:text-white font-[600]">
              Course Overview
            </h1>
            <CourseContentList content={course?.courseData} isDemo={true} />
          </div>
          <br />
          <div>
            <h1 className="font-Poppins text-[25px] mb-2 text-black dark:text-white font-[600]">
              Course Details
            </h1>
            <p className="text-black dark:text-white text-[18px] whitespace-pre-line w-full overflow-hidden mt-[10px]">
              {course?.description}
            </p>
          </div>
          <br />
          <br />
          <div className="w-full">
            <div className="800px:flex items-center">
              <Ratings rating={course?.rating} />
              <div className="mb-2 800px:mb-[unset]">
                <h5 className="text-black dark:text-white text-[25px] font-Poppins">
                  {Number.isInteger(course?.rating)
                    ? course?.rating.toFixed(1)
                    : course?.rating.toFixed(2)}{" "}
                  Course Rating - {course?.reviews?.length} Reviews
                </h5>
              </div>
            </div>
          </div>
          {course?.reviews &&
            [...course?.reviews].reverse().map((review: any, index: number) => (
              <div className="w-full py-2" key={index}>
                <div className="flex">
                  <div>
                    <Image
                      src={
                        review?.user?.avatar
                          ? review?.user?.avatar?.url
                          : avatarDefault
                      }
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-full h-[50px] w-[50px]"
                    />
                  </div>
                  <div className="hidden 800px:block pl-2">
                    <div className="flex items-center">
                      <h5 className="text-black dark:text-white text-[18px] pr-2">
                        {review?.user?.name}
                      </h5>
                      <Ratings rating={review?.rating} />
                    </div>
                    <p className="text-black dark:text-white">
                      {review?.comment}
                    </p>
                    <small className="text-[#000000d1] dark:text-[#ffffff83]">
                      {format(review?.createdAt)}
                    </small>
                  </div>
                  <div className="flex items-center 800px:hidden pl-2">
                    <h5 className="text-black dark:text-white text-[18px] pr-2">
                      {review?.user?.name}
                    </h5>
                    <Ratings rating={review?.rating} />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="w-full 800px:w-[35%] relative">
          <CoursePlayer videoUrl={course?.demoUrl} title={course?.name} />
          <div className="flex items-center py-3">
            <h1 className="text-black dark:text-white text-[25px]">
              {course?.price === 0 ? "Free" : course?.price + "$"}
            </h1>
            <h5 className="text-black dark:text-white text-[20px] pl-3 line-through opacity-80">
              {course?.estimatedPrice}$
            </h5>
            <h4 className="text-[22px] text-black dark:text-white pl-5">
              {discountPercentage}% off
            </h4>
          </div>
          <div className="flex items-center">
            {isPurchased || user?.role === "admin" ? (
              <Link
                className={`${style.btn} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                href={`/course-access/${course?._id}`}
              >
                Enter to Course
              </Link>
            ) : (
              <div
                className={`${style.btn} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                onClick={handleOrder}
              >
                Buy Now {course?.price === 0 ? "Free" : course?.price + "$"}
              </div>
            )}
          </div>
          <p className="text-black dark:text-white pb-1 mt-3">
            • Source code included
          </p>
          <p className="text-black dark:text-white pb-1">
            • Full lifetime access
          </p>
          <p className="text-black dark:text-white pb-1">
            • Certificate of completion
          </p>
          <p className="text-black dark:text-white pb-3 800px:pb-1">
            • Premium support
          </p>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 flex items-center justify-center z-50">
            <div className="w-[500px] shadow rounded-xl bg-white p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={30}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-black hover:bg-[#0000000f] rounded-full p-1"
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      setOpen={setOpen}
                      course={course}
                      user={user}
                      refetch={refetch}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
