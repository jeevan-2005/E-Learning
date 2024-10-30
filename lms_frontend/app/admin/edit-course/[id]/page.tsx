"use client";
import DashboardHero from "../../../components/Admin/DashboardHero";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../../../hooks/adminProtected";
import Heading from "../../../utils/Heading";
import React, { FC } from "react";
import EditCourse from "../../../components/Admin/course/EditCourse";

type Props = {};

const Page: FC<Props> = ({ params }: any) => {
  const id = params?.id;
  return (
    <div>
      <AdminProtected>
        <Heading
          title="E-Learning - Admin Panel"
          description="E-Learning Platform for student to learn and get help with their courses from teachers."
          keywords="E-Learning, Programming, MERN, Machine-Learning, React, Redux"
        />
        <div className="w-full flex min-h-screen">
          <div className="w-[20%]">
            <AdminSidebar selectedNav="Live Courses" />
          </div>
          <div className="w-[80%]">
            <DashboardHero />
            <EditCourse id={id} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
