import Image from "next/image";
import React, { useState } from "react";
import profileImage from "../../../public/assests/profileImg.jpg";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = () => {
    if (search === "") return;

    router.push(`/courses?title=${search}`);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-[80%] 800px:w-full 800px:flex items-center justify-center gap-[30px] 800px:gap-0 800px:px-10 mx-auto mt-3">
      <div
        className="relative z-10 flex items-center justify-center 800px:w-[50%] 800px:h-[300px] h-[45vh]"
        //  className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-center 1000px:pt-[0] z-10"
      >
        <Image
          src={data?.layout?.banner?.image?.url}
          width={400}
          height={400}
          alt="bannerImg1"
          className="800px:w-[80%] h-auto z-[15]"
        />
        <div className="absolute top-0 left-0 z-0 1000px:top-[unset] 1500px:h-[600px] 1500px:w-[600px] 1100px:h-[600px] 1100px:w-[600px] h-[45vh] w-[45vh] 800px:h-[300px] 800px:w-[300px] 800px:left-3 hero_animation rounded-full flex items-center justify-center"></div>
      </div>
      <div className="flex flex-col items-start justify-center 1100px:w-[30%] 800px:w-[50%]">
        <h2 className="dark:text-white text-[#000000c7] 1500px:text-[50px] text-[30px] 800px:text-[28px] 800px:text-left font-Josefin font-[600]  py-2 1000px:leading-[75px] w-[100%] text-center">
          {data?.layout?.banner?.title}
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] w-full">
          {data?.layout?.banner?.subTitle}
        </p>
        <br />
        <br />
        <div className="w-full h-[50px] bg-transparent relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
          />
          <div
            className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]"
            onClick={handleSearchSubmit}
          >
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
