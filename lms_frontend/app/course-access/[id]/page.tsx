"use client"
import Loader from '../../components/Loader/Loader';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import React, { FC, useEffect } from 'react'
import CourseContentPurchasedUser from "../../components/Course/CourseContentPurchasedUser";
import { useGetSingleCourseDetailsQuery } from '../../../redux/features/course/courseApi';

type Props = {
  params: any;
}

const Page:FC<Props> = ({params}) => {
  const id = params.id;
  const { data:course, isLoading:courseLoading } = useGetSingleCourseDetailsQuery(id, {});

  const {data, error, isLoading} = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if(data){
      const isPurchased = data?.user?.courses.find((course: any) => course._id === id);
      if(data?.user?.role === "admin" || course?.course?.price === 0) return;
      if(!isPurchased){
        redirect("/");
      }
    }
    if(error){
      redirect("/");
    }
  },[data, error])

  if(isLoading || courseLoading) return <Loader />

  return (
    <div>
      <CourseContentPurchasedUser id={id} user={data?.user} />
    </div>
  )
}

export default Page