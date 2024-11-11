"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import About from "../components/About/About";
import Footer from "../components/Footer";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="About us - E-Learning"
        description="E-Learning Platform for student to learn and get help with their courses from teachers."
        keywords="E-Learning, Programming, MERN, Machine-Learning, React, Redux"
      />
      <div className="min-h-screen">
        <Header
          open={open}
          setOpen={setOpen}
          route={route}
          setRoute={setRoute}
          activeItem={2}
        />
        <div className="w-[90%] 800px:w-[85%] m-auto ">
          <About />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Page;
