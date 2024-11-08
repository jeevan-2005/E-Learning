import { useGetAllCoursesUserQuery } from "../../../redux/features/course/courseApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses: FC<Props> = (props) => {
  const { data, isLoading } = useGetAllCoursesUserQuery({});
  const [courses, setCourses] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setCourses(data?.allCourses);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  return (
    <div className="w-[90%] m-auto 800px:w-[80%] mt-[80px]">
      <h1 className="text-center font-Poppins text-[25px] sm:text-3xl lg:text-4xl leading-[35px] dark:text-white text-black 800px:!leading-[60px] font-[700] tracking-tight">
        Expand Your Career <span className="text-gradient">Opportunity</span>
        <br />
        Opportunity With Our Courses
      </h1>
      <br />
      <br />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[25px] mb-12 border-0">
        {courses &&
          courses.map((course: any) => (
            <CourseCard key={course._id} course={course} />
          ))}
      </div>
    </div>
  );
};

export default Courses;
