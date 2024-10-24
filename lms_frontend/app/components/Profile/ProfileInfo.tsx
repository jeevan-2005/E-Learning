import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import avatarDefault from "../../../public/assests/avatar.webp";
import { AiOutlineCamera } from "react-icons/ai";
import { style } from "../../styles/styles";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../../../redux/features/user/userApi";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import { FaSpinner } from "react-icons/fa6";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user?.name);
  const [updateAvatar, { isSuccess, error, isLoading }] =
    useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        await updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
    }

    if(success){
        toast.success("Profile updated successfully!");
    }

  }, [isSuccess, error, success, updateError]);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({ name });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          {isLoading ? (
            <div className="w-[120px] h-[120px] border-[3px] border-[#37a39a] rounded-full flex justify-center items-center">
              <FaSpinner
                size={20}
                className="animate-spin text-black dark:text-white"
              />
            </div>
          ) : (
            <Image
              src={
                avatar || user?.avatar
                  ? avatar || user?.avatar.url
                  : avatarDefault
              }
              height={120}
              width={120}
              alt="avatar"
              className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
            />
          )}
          <input
            type="file"
            name=""
            className="hidden"
            id="avatar"
            onChange={imageHandler}
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full flex justify-center items-center cursor-pointer absolute bottom-1 right-1">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleFormSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label
                htmlFor="name"
                className="block text-black dark:text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                className={`${style.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-6">
              <label
                htmlFor="email"
                className="block text-black dark:text-white"
              >
                Email Address
              </label>
              <input
                type="text"
                className={`${style.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={user?.email}
                id="email"
                readOnly
              />
            </div>
            <input
              type="submit"
              value="Update"
              required
              className={`${style.btn} !w-[50%] m-auto mt-10 !py-2 !min-h-0`}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
