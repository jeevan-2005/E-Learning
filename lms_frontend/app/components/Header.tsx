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
import Image from "next/image";
import avatar from "../../public/assests/avatar.webp";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

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
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [socialAuth, { isSuccess, error, isLoading: socialLoading }] = useSocialAuthMutation();
  const { data } = useSession();
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!userData && data) {
      const handleSocialAuth = async () => {
        await socialAuth({
          name: data?.user?.name,
          email: data?.user?.email,
          avatar: data?.user?.image,
        });
      };
      handleSocialAuth();
    }
    if (data === null && !userData) {
      setLogout(true);
    }
  }, [data, userData]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Login successful");
    }
    if(error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
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
  console.log(data, userData);
  if (isLoading || socialLoading) return <Loader />;

  return (
    <div className="w-full relative">
      {active && (
        <div className="h-[80px]"></div>
      )}
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
              <div className="ml-3 800px:ml-0">
                {userData ? (
                  <Link href={"/profile"}>
                    <Image
                      className="w-[45px] rounded-full"
                      width={45}
                      height={45}
                      src={
                        userData?.user.avatar
                          ? userData?.user.avatar.url
                          : avatar
                      }
                      alt="avatar"
                      style={{
                        border: activeItem === 5 ? "2px solid #37a39a" : "none",
                      }}
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
              refetch={refetch}
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
