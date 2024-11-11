"use client"
import Loader from '../../components/Loader/Loader';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import React, { FC, useEffect } from 'react'
import CourseContentPurchasedUser from "../../components/Course/CourseContentPurchasedUser";

type Props = {
  params: any;
}

const Page:FC<Props> = ({params}) => {
  const id = params.id;

  const {data, error, isLoading} = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if(data){
      console.log(data);
      const isPurchased = data?.user?.courses.find((course: any) => course._id === id);
      if(data?.user?.role === "admin") return;
      if(!isPurchased){
        redirect("/");
      }
    }
    if(error){
      redirect("/");
    }
  },[data, error])

  if(isLoading) return <Loader />

  return (
    <div>
      <CourseContentPurchasedUser id={id} user={data?.user} />
    </div>
  )
}

export default Page