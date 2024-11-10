import Ratings from "../../utils/Ratings";
import Image from "next/image";
import React, { FC } from "react";

type Props = {
  review: any;
};

const ReviewCard: FC<Props> = ({ review }) => {
  return (
    <div className="w-full h-max pb-4 dark:bg-slate-500 dark:bg-opacity-[0.20] border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur rounded-lg shadow-[bg-slate-700] p-3 shadow-inner">
      <div className="flex w-full">
        <Image
          src={review?.avatar}
          alt="avatar"
          className="w-[50px] h-[50px] rounded-full object-cover"
          height={50}
          width={50}
        />
        <div className="1000px:flex justify-between w-full hidden">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {review?.name}
            </h5>
            <h6 className="text-[16px] text-black dark:text-white">
              {review?.profession}
            </h6>
          </div>
          <Ratings rating={review?.rating} />
        </div>
        {/* for mobile */}
        <div className="1000px:hidden flex flex-col justify-between w-full">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {review?.name}
            </h5>
            <h6 className="text-[16px] text-black dark:text-white pb-1">
              {review?.profession}
            </h6>
          <Ratings rating={review?.rating} />
          </div>
        </div>
      </div>
      <p className="pt-2 px-2 font-Poppins text-black dark:text-white">
        {review?.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
