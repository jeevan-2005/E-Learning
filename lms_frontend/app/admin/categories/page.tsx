"use client";
import React, { FC } from "react";
import AdminProtected from "../../hooks/adminProtected";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../../components/Admin/DashboardHero";
import Heading from "../../utils/Heading";
import EditCategories from "../../components/Admin/customization/EditCategories";

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
            <AdminSidebar selectedNav="Categories" />
          </div>
          <div className="w-[80%]">
            <DashboardHero />
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
