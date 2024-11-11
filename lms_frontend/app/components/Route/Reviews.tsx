import React, { FC } from "react";
import avatarImage from "../../../public/assests/profileImg.jpg";
import reviewImage from "../../../public/assests/training-course-banner.webp";
import Image from "next/image";
import { style } from "../../styles/styles";
import ReviewCard from "../review/ReviewCard";

type Props = {};

const reviews = [
  {
    name: "Alice Johnson",
    avatar: avatarImage,
    profession: "Computer Science Engineering Student",
    comment:
      "This platform has been a game-changer for my studies! The resources and tools available are top-notch.",
    rating: 5,
  },
  {
    name: "Mark Thompson",
    avatar: avatarImage,
    profession: "Full Stack Developer",
    comment:
      "I love the design and usability of this app. As a developer, I appreciate the attention to detail.",
    rating: 4.5,
  },
  {
    name: "Samantha Lee",
    avatar: avatarImage,
    profession: "Student",
    comment:
      "Great platform for learning new skills. I especially enjoy the interactive lessons and community support.",
    rating: 4,
  },
  {
    name: "David Brown",
    avatar: avatarImage,
    profession: "Software Engineer",
    comment:
      "A well-built app with impressive features. Highly recommended for anyone looking to advance their tech skills.",
    rating: 5,
  },
  {
    name: "Nina Patel",
    avatar: avatarImage,
    profession: "UX/UI Designer",
    comment:
      "The UI is intuitive and visually appealing. The developers clearly put a lot of thought into the user experience.",
    rating: 4.5,
  },
  {
    name: "Tom Harris",
    avatar: avatarImage,
    profession: "Machine Learning Enthusiast",
    comment:
      "Fantastic resource for learning and practicing ML concepts. The practical examples are really helpful.",
    rating: 4,
  },
];

const Reviews: FC<Props> = (props) => {
  return (
    <div className="w-[90%] 800px:w-[80%] m-auto mt-[100px]">
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[30%]">
          <Image src={reviewImage} alt="avatar" height={400} width={300} />
        </div>
        <div className="800px:w-[70%] w-full">
          <h3 className={`${style.title} 800px:!text-[40px]`}>
            Our Students Are <span className="text-gradient">Our Strength</span>{" "}
            <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={`${style.label} text-center`}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel
            laborum esse perferendis magni, sint maxime quod cumque fuga
            pariatur? Adipisci, ab consequuntur vel tenetur fugit veniam
            corrupti numquam minus ratione in fuga labore praesentium, repellat
            reiciendis iste similique provident.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] my-12 border-0 ">
        {reviews &&
          reviews.map((review: any, index: number) => (
            <ReviewCard key={index} review={review} />
          ))}
      </div>
    </div>
  );
};

export default Reviews;
