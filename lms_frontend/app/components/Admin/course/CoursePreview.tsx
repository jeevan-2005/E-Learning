import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { style } from "../../../styles/styles";
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean;
};

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isEdit,
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-[90%] m-auto mb-5 py-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData.demoUrl}
            title={courseData.title}
          />
        </div>
        <div className="flex items-center text-black dark:text-white mt-5">
          <h1 className="text-[25px] font-[600]">
            {courseData?.price === 0 ? "Free" : `${courseData?.price}$`}
          </h1>
          <h5 className="pl-3 text-[18px] line-through opacity-70">
            {courseData?.estimatedPrice && `(${courseData?.estimatedPrice}$)`}
          </h5>
          <h4 className="pl-3 text-[22px]">- {discountPercentagePrice}% Off</h4>
        </div>

        <div className="flex items-center">
          <div
            className={`${style.btn} !w-[28%] font-Poppins my-3 !bg-[crimson] !cursor-not-allowed`}
          >
            Buy Now {courseData?.price === 0 ? "" : `(${courseData?.price}$)`}
          </div>
        </div>

        <div className="flex items-center my-5">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code...."
            className={`${style.input} !w-[60%] !mt-0`}
          />
          <div
            className={`${style.btn} !w-[20%] !h-[40px] ml-3 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>

        <div className="text-black dark:text-white">
          <p className="pb-1 mt-2">• Source code included</p>
          <p className="pb-1">• Full time access</p>
          <p className="pb-1">• Certification of completion</p>
          <p className="pb-3 800px:pb-1">• Premium support</p>
        </div>
      </div>

      <div className="w-full mt-5 text-black dark:text-white">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600]">
            {courseData?.name}
          </h1>
          <div className="flex w-[90%] items-center justify-between pt-2">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5>0 Reviews</h5>
            </div>
            <h5>0 Students</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            What will you learn from this course?
          </h1>
        </div>
        {courseData?.benefits?.map((benefit: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{benefit.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          What are prerequisites for this course?
        </h1>
        {courseData?.prerequisites?.map((prerequisite: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{prerequisite.title}</p>
          </div>
        ))}
        <br />
        <br />
        {/* course Description */}
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            Course Details
          </h1>
          <p className="text-[18px] mt-[15px] whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className={`${style.btn2}`} onClick={() => prevButton()}>
          Prev
        </div>
        <div className={`${style.btn2}`} onClick={() => createCourse()}>
          {isEdit ? "Update" : "Create"}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
