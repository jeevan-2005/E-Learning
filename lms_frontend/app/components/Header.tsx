"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt1, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assests/avatar.webp";
import { useSession } from "next-auth/react";
import { useSocialAuthMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const { data } = useSession();

  useEffect(() => {
    const socialAuthHandler = async () => {
      await socialAuth({
        name: data?.user?.name,
        email: data?.user?.email,
        avatar: data?.user?.image,
      });
    };
    if (!user && data) {
      socialAuthHandler();
    }

    if (isSuccess) {
      toast.success("Login successful");
    }
  }, [data, isSuccess]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900/50 dark:to-black/50 fixed top-0 left-0 w-full height-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl backdrop-blur-lg transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800:w-[92%] m-auto py-1 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                E-Learning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* this is only for mobile screen */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt1
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <div className="800px:block hidden">
                {user ? (
                  <Link href={"/profile"}>
                    <Image
                      className="w-[45px] rounded-full"
                      width={45}
                      height={45}
                      src={user.avatar ? user.avatar.url : avatar}
                      alt="avatar"
                      style={{border: activeItem === 5 ? "2px solid #37a39a": "none"}}
                    />
                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className="cursor-pointer dark:text-white text-black"
                    onClick={() => setOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            id="screen"
            onClick={handleClose}
          >
            <div className="w-[70%] fixed h-screen top-0 right-0 z-[99999999999] bg-white dark:bg-slate-900 dark:bg-opacity-90">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-16px px-2 pl-5 text-black dark:text-white">
                Copyright © 2024 E-Learning.
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              activeItem={activeItem}
              component={Login}
              setRoute={setRoute}
            />
          )}
        </>
      )}
      {route === "Sign-up" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              activeItem={activeItem}
              component={SignUp}
              setRoute={setRoute}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              activeItem={activeItem}
              component={Verification}
              setRoute={setRoute}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
