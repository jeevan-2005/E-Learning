"use client";
import React, { FC } from "react";
import Heading from "../../utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../../components/Admin/DashboardHero";
import CreateCourse from "../../components/Admin/course/CreateCourse";

type Props = {};

const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="E-Learning - Admin"
        description="E-Learning Platform for student to learn and get help with their courses from teachers."
        keywords="E-Learning, Programming, MERN, Machine-Learning, React, Redux"
      />
      <div className="w-full flex min-h-screen">
        <div className="w-[20%]">
          <AdminSidebar selectedNav="Create Course" />
        </div>
        <div className="w-[80%]">
          <DashboardHero />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default Page;
