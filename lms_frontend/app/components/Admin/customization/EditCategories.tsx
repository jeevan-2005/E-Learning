import React, { FC, useEffect, useState } from "react";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { style } from "../../../styles/styles";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const EditCategories: FC<Props> = (props) => {
  const {
    data,
    isLoading: loadingData,
  } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout?.categories);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Categories updated successfully");
    }
    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  const handleCategoryChange = (id: any, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((item) =>
        item._id === id ? { ...item, title: value } : item
      )
    );
  };

  const addNewCategoryHandler = () => {
    if (categories[categories.length - 1]?.title === "") {
      toast.error("Please enter category title");
      return;
    }

    setCategories([
      ...categories,
      {
        title: "",
      },
    ]);
  };

  const areCategoriesUnchanged = (
    categories: any[],
    originalCategories: any
  ) => {
    return JSON.stringify(categories) === JSON.stringify(originalCategories);
  };

  const isAnyCategoryEmpty = (categories: any[]) => {
    return categories.some((category) => category.title === "");
  };

  const handleEditCategories = async () => {
    await editLayout({ type: "Categories", categories });
  };

  if (isLoading || loadingData) return <Loader />;

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${style.title} mb-7`}>All Categories</h1>
      {categories &&
        categories.map((category: any, index: number) => (
          <div key={index} className="p-3">
            <div className="flex items-center justify-center">
              <input
                className={`${style.input} !w-[unset] !border-none !text-[20px]`}
                value={category.title}
                onChange={(e) =>
                  handleCategoryChange(category._id, e.target.value)
                }
                placeholder="Enter category title...."
              />
              <AiOutlineDelete
                className="dark:text-white text-black cursor-pointer text-[20px]"
                onClick={() => {
                  setCategories((prevCategories) =>
                    prevCategories.filter(
                      (item: any) => item._id !== category._id
                    )
                  );
                }}
              />
            </div>
          </div>
        ))}
      <br />
      <br />
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black cursor-pointer text-[30px]"
          onClick={addNewCategoryHandler}
        />
      </div>

      <div
        className={`${
          style.btn
        } !w-[100px] !min-h-[30px] dark:text-white text-black bg-[#cccccc34] !rounded absolute bottom-12 right-12
        ${
          areCategoriesUnchanged(categories, data?.layout?.categories) ||
          isAnyCategoryEmpty(categories)
            ? "!cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        }
      }`}
        onClick={
          areCategoriesUnchanged(categories, data?.layout?.categories) ||
          isAnyCategoryEmpty(categories)
            ? () => null
            : handleEditCategories
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditCategories;
