import Ratings from "../../utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  course: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ course, isProfile }) => {
  
  return (
    <Link
      href={
        !isProfile ? `/course/${course?._id}` : `/course-access/${course?._id}`
      }
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner">
        <Image
          src={course?.thumbnail?.url}
          width={500}
          height={300}
          objectFit="contain"
          alt={course?.name}
          className="h-[220px]  rounded w-full"
        />
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-white">
          {course?.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={course?.rating} />
          <h5
            className={`text-black dark:text-white ${
              isProfile && "hidden 800px:inline"
            }`}
          >
            {course?.purchased} Students
          </h5>
        </div>
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex items-center">
            <h3 className="text-black dark:text-white">
              {course?.price === 0 ? "Free" : course?.price + "$"}
            </h3>
            <h5 className="text-black dark:text-white opacity-80 line-through pl-3 text-[14px]">
              {course?.estimatedPrice}$
            </h5>
          </div>
          <div className="flex items-center">
            <AiOutlineUnorderedList
              className="text-black dark:text-white"
              size={20}
            />
            <h5 className="pl-2 text-black dark:text-white">
              {course?.courseData?.length} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
