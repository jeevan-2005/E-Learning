import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { style } from "../../../styles/styles";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";

type Props = {};

const EditHero: FC<Props> = (props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Layout updated successfully");
    }

    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (data) {
      setImage(data?.layout?.banner?.image?.url);
      setTitle(data?.layout?.banner?.title);
      setSubTitle(data?.layout?.banner?.subTitle);
    }
  }, [data]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (e: any) => {
    e.preventDefault();
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full flex items-center">
        <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[500px] 1500px:w-[500px] 1100px:w-[400px] 1100px:h-[400px] w-[40vh] h-[40vh] hero_animation rounded-[50%] 1100px:left-[18rem] 1500px:left-[21rem]"></div>
        <div className="1100px:w-[40%] flex items-center justify-end 1000px:min-h-screen pt-[70px] 1000px:pt-[0] z-[10]">
          <div className="relative flex items-center justify-end">
            <img
              src={image}
              alt=""
              className="object-contain 1100px:max-w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
            />
            <input
              type="file"
              accept="image/*"
              id="banner"
              onChange={handleUpdate}
              className="hidden"
            />
            <label
              htmlFor="banner"
              className="absolute bottom-[-20px] right-0 z-[20] dark:bg-[#ffffff0f] bg-[#0000000f] rounded-full p-2"
            >
              <AiOutlineCamera
                size={29}
                className="dark:text-white text-black text-[18px] cursor-pointer z-[30]"
              />
            </label>
          </div>
        </div>
        <div className="1000px:w-[40%] ml-20 flex flex-col justify- items-center 1000px:mt-0 text-center 1000px:text-left mt-[150px]">
          <textarea
            className="dark:text-white text-[#000000c7] resize-none w-full bg-transparent outline-none p-2 text-[50px] font-[600] font-Josefin px-3 h-[316px]"
            placeholder="Improve Your Online Learning Experience Better Instantly"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            className="dark:text-[#edfff4] text-[#000000ac] resize-none w-full bg-transparent outline-none 110px:!w-[74%] text-[20px] font-[600] font-Josefin px-3 h-[100px]"
            placeholder="We have 40k+ Online Courses and 500K+ Online registered students. Find your desired courses for them."
          />
          <div
            className={`${
              style.btn
            } !w-[100px] !min-h-[30px] dark:text-white text-black bg-[#cccccc34] ${
              data?.layout?.banner?.image?.url !== image ||
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle
                ? "!cursor-pointer !bg-[#42d383]"
                : "!cursor-not-allowed"
            } !rounded  absolute bottom-12 right-12`}
            onClick={
              data?.layout?.banner?.image?.url !== image ||
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle
                ? handleEdit
                : () => null
            }
          >
            Save
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHero;
