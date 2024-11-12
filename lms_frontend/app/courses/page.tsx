"use client";

import { useGetAllCoursesUserQuery } from "../../redux/features/course/courseApi";
import { useGetHeroDataQuery } from "../../redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { style } from "../styles/styles";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");

  const { data, isLoading } = useGetAllCoursesUserQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});

  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.allCourses);
    }
    if (category !== "All") {
      const reqCategory = categoriesData?.layout?.categories.find(
        (cat: any) => cat.title === category
      );

      setCourses(
        data?.allCourses.filter(
          (course: any) => course?.categories === reqCategory?._id
        )
      );
    }

    if (search) {
      setCourses(
        data?.allCourses.filter((course: any) =>
          course?.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen">
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={1}
      />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <Heading
          title={"All Courses - E-Learning"}
          description="E-Learning Platform for student to learn and get help with their courses from teachers."
          keywords={
            "programming community, coding skills, expert insights, collaboration, growth"
          }
        />
        <br />
        <div className="w-full flex items-center flex-wrap">
          <div
            className={`h-[35px] ${
              category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
            } m-3 px-4 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
            onClick={() => setCategory("All")}
          >
            All
          </div>
          {categories &&
            categories?.map((item: any, index: number) => (
              <div
                key={index}
                className={`h-[35px] ${
                  category === item.title ? "!bg-[crimson]" : "!bg-[#5050cb]"
                } m-3 px-4 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory(item.title)}
              >
                {item.title}
              </div>
            ))}
        </div>
        {courses && courses.length === 0 && (
          <p
            className={`${style.label}  min-h-[50vh] flex items-center justify-center`}
          >
            {search
              ? "No courses found!"
              : "No courses found in this category. Please try in another one!"}
          </p>
        )}
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[25px] mb-12 border-0">
          {courses &&
            courses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function SuspendedPage(props: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <Page {...props} />
    </Suspense>
  );
}
