"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import {
  useLogoutMutation,
} from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetAllCoursesUserQuery } from "@/redux/features/course/courseApi";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [courses, setCourses] = useState([]);
  const { data, isLoading } = useGetAllCoursesUserQuery({});

  const [logout] = useLogoutMutation({});

  useEffect(() => {
    if (data) {
      const filterCourses = user.courses.map((userCourse: any) =>
        data?.allCourses.find((course: any) => course?._id === userCourse?._id)
      );
      setCourses(filterCourses);
    }
  }, [data]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  const logoutHandler = async () => {
    try {
      await logout(undefined);
      await signOut();
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#f3f3f3] rounded-[5px] shadow-md  mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo user={user} avatar={avatar} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
      {active === 3 && (
        <div className="w-full pl-7 800px:px-10 800px:pl-20 mt-[80px] px-2">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-2 lg:gap-[25px] mb-12 border-0">
            {courses &&
              courses.map((course: any) => (
                <CourseCard key={course._id} course={course} />
              ))}
          </div>
          {courses && courses.length === 0 && (
            <h1 className="text-center font-Poppins text-[25px] sm:text-3xl lg:text-4xl leading-[35px] dark:text-white text-black 800px:!leading-[60px] font-[700] tracking-tight">
              You dont have any enrolled courses!
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
