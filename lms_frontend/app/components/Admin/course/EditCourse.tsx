"use client";
import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/features/course/courseApi";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const { isLoading, data } = useGetAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [editCourse, { isLoading: isEditCourseLoading, isSuccess, error }] =
    useEditCourseMutation();

  const editCourseData =
    data && data.courses.find((course: any) => course._id === id);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    categories: "",
    thumbnail: "",
  });
  const [courseContentData, setCourseContentData] = useState([
    {
      title: "",
      videoUrl: "",
      description: "",
      videoSection: "",
      videoLength: 0,
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [benefits, setBenifits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        categories: editCourseData.categories,
        estimatedPrice: editCourseData?.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData?.level,
        demoUrl: editCourseData?.demoUrl,
        thumbnail: editCourseData?.thumbnail?.url,
      });
      setCourseContentData(editCourseData.courseData);
      setBenifits(editCourseData.benefits);
      setPrerequisites(editCourseData.prerequisites);
    }

    if (isSuccess) {
      toast.success("Course updated successfully");
      redirect("/admin/courses");
    }

    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [editCourseData, isSuccess, error]);

  const handleSubmit = async () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map((data) => ({
      title: data.title,
      videoUrl: data.videoUrl,
      description: data.description,
      videoLength: data.videoLength,
      videoSection: data.videoSection,
      links: data.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: data.suggestion,
    }));

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      categories: courseInfo.categories,
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    const data = courseData;
    if (!isEditCourseLoading) {
      await editCourse({ id, data });
    }
  };

  if (isEditCourseLoading || isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex h-auto">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenifits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 3 && (
          <CoursePreview
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            active={active}
            setActive={setActive}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] fixed top-18 right-0 h-screen z-[-1]">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
