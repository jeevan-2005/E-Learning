"use client";
import React, { FC } from "react";
import AdminProtected from "../../hooks/adminProtected";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../../components/Admin/DashboardHero";
import Heading from "../../utils/Heading";
import UserAnalytics from "../../components/Admin/analytics/UserAnalytics";

type Props = {};

const Page: FC<Props> = (props) => {
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
            <AdminSidebar selectedNav="User Analytics" />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <UserAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
