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
import { signOut, useSession } from "next-auth/react";
import {
  useLogoutMutation,
  useSocialAuthMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Loader from "./Loader/Loader";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import { useSelector } from "react-redux";

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
  const { isLoading, refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [socialAuth, { isSuccess, error, isLoading: socialLoading }] =
    useSocialAuthMutation();
  const { data } = useSession();
  const [ logout ] = useLogoutMutation({});

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const opn = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCl = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!user && data) {
      const handleSocialAuth = async () => {
        await socialAuth({
          name: data?.user?.name,
          email: data?.user?.email,
          avatar: data?.user?.image,
        });
      };
      handleSocialAuth();
    }
  }, [data, user]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Login successful");
    }
    if (error && "data" in error) {
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

  const logoutHandler = async () => {
    try {
      await logout(undefined);

      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (isLoading || socialLoading) return <Loader />;

  return (
    <div className="w-full relative">
      {active && <div className="h-[80px]"></div>}
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
                {user ? (
                  <>
                    <Tooltip title="Account settings">
                      <IconButton
                        id="basic-button"
                        aria-controls={opn ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={opn ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          className="w-[45px] rounded-full"
                          width={45}
                          height={45}
                          src={user.avatar ? user?.avatar.url : avatar}
                          alt="avatar"
                          style={{
                            border:
                              activeItem === 5 ? "2px solid #37a39a" : "none",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={opn}
                      onClose={handleCl}
                      onClick={handleCl}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Link href="/profile">
                        {" "}
                        <MenuItem>
                          <Avatar />
                          Profile
                        </MenuItem>
                      </Link>
                      {user?.role === "admin" && (
                        <Link href="/admin">
                          {" "}
                          <MenuItem>
                            <Settings className="mr-2 my-1 text-[gray]" />
                            Admin DashBoard
                          </MenuItem>
                        </Link>
                      )}
                      <Divider />
                      <MenuItem onClick={logoutHandler}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
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
