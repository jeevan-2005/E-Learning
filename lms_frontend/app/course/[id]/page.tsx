"use client"
import React, { FC } from 'react'
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

type Props = {}

const Page:FC<Props> = ({params}) => {
  return (
    <div>
        <CourseDetailsPage id={params?.id} />
    </div>
  )
}

export default Page