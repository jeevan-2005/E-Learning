import {
  useGetPurchasedCourseDetialsQuery,
  useGetSingleCourseDetailsQuery,
} from "../../../redux/features/course/courseApi";
import React, { FC, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
  id: string;
  user: any;
};

const CourseContentPurchasedUser: FC<Props> = ({ id, user }) => {
  const { data, error, isLoading, refetch } = useGetPurchasedCourseDetialsQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: courseData, refetch: courseRefetch } =
    useGetSingleCourseDetailsQuery(id, {
      refetchOnMountOrArgChange: true,
    });

  const content = data?.courseContent;
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  if (isLoading) return <Loader />;

  return (
    <>
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={1}
      />
      <div className="w-full grid 800px:grid-cols-10 min-h-screen">
        <Heading
          title={content[activeVideo]?.title}
          description={content[activeVideo]?.description}
          keywords={content[activeVideo]?.videoSection}
        />
        <div className="col-span-7">
          <CourseContentMedia
            user={user}
            content={content}
            id={id}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            refetch={refetch}
            course={courseData?.course}
            courseRefetch={courseRefetch}
          />
        </div>
        <div className="hidden 800px:block 800px:col-span-3 800px:mr-6">
          <CourseContentList
            setActiveVideo={setActiveVideo}
            activeVideo={activeVideo}
            content={content}
          />
        </div>
      </div>
    </>
  );
};

export default CourseContentPurchasedUser;
