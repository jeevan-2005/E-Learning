import Image from "next/image";
import React from "react";
import bannerImage1 from "../../../public/assests/banner-img-1.png";
import profileImage from "../../../public/assests/profileImg.jpg";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="w-full 1000px:flex items-center justify-center gap-[30px] px-10 mt-3">
      <div
        className="relative z-10 flex items-center justify-center w-[50%]"
        //  className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-center 1000px:pt-[0] z-10"
      >
        <Image
          src={bannerImage1}
          alt="bannerImg1"
          className="w-[90%] h-auto z-[15]"
        />
        <div className="absolute top-0 left-0 z-0 1000px:top-[unset] 1500px:h-[600px] 1500px:w-[600px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-full flex items-center justify-center"></div>
      </div>
      <div className="flex flex-col items-start justify-center w-[30%]">
        <h2 className="dark:text-white text-[#000000c7] 1500px:text-[50px] text-30px 1000px:text-[70px] font-Josefin font-[600]  py-2 1000px:leading-[75px] w-[100%]">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] w-full">
          We have 40k+ Online Courses and 500k+ Online registered students. Find
          your desired courses for them.
        </p>
        <br />
        <br />
        <div className="w-full h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>
        <br />
        <br />
        <div className="w-full flex items-center">
          <Image src={profileImage} alt="" className="rounded-full w-[10%]" />
          <Image
            src={profileImage}
            alt=""
            className="rounded-full ml-[-20px] w-[10%]"
          />
          <Image
            src={profileImage}
            alt=""
            className="rounded-full ml-[-20px] w-[10%]"
          />
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[15px] font-[600]">
            500K+ People already trusted us.{" "}
            <Link
              href={"/courses"}
              className="dark:text-[#46e256] text-[crimson]"
            >
              View Courses
            </Link>{" "}
          </p>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Hero;
