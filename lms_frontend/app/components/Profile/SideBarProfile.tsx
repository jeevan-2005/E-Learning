import Image from "next/image";
import React, { FC } from "react";
import avatarDefault from "../../../public/assests/avatar.webp";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-[#f3f3f3]" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={
            user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
          }
          alt="avatar"
          height={30}
          width={30}
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] rounded-full cursor-pointer"
        />
        <h5 className="pl-4 800px:block hidden font-Poppins text-black dark:text-white ">
          My Profile
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-[#f3f3f3]" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="text-black dark:text-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins text-black dark:text-white ">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-[#f3f3f3]" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="text-black dark:text-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins text-black dark:text-white ">
          Enrolled Courses
        </h5>
      </div>
      {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 4 ? "dark:bg-slate-800 bg-[#f3f3f3]" : "bg-transparent"
          }`}
          href={"/admin"}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="text-black dark:text-white"
          />
          <h5 className="pl-4 800px:block hidden font-Poppins text-black dark:text-white ">
            Admin Dashboard
          </h5>
        </Link>
      )}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 5 ? "dark:bg-slate-800 bg-[#f3f3f3]" : "bg-transparent"
        }`}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} className="text-black dark:text-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins text-black dark:text-white ">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
