import React, { FC, useEffect, useState } from "react";
import { style } from "../../../styles/styles";
import { useGetHeroDataQuery } from "../../../../redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data, isLoading } = useGetHeroDataQuery("Categories");
  const [categorys, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout?.categories);
    }
  }, [data]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${style.label}`}>
            Course Name
          </label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`${style.input}`}
          />
        </div>
        <br />
        <div>
          <label htmlFor="description" className={`${style.label}`}>
            Course Description
          </label>
          <textarea
            name=""
            id="description"
            cols={30}
            rows={8}
            placeholder="write course description here..."
            className={`${style.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="flex items-center justify-between w-full">
          <div className="w-[45%]">
            <label htmlFor="price" className={`${style.label}`}>
              Course Price
            </label>
            <input
              type="number"
              name=""
              required
              id="price"
              placeholder="Enter course price"
              className={`${style.input}`}
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="est-price" className={`${style.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name=""
              required
              id="est-price"
              placeholder="Enter estimated price"
              className={`${style.input}`}
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div className="flex items-center justify-between w-full">
          <div>
            <label htmlFor="tags" className={`${style.label}`}>
              Course Tags
            </label>
            <input
              type="text"
              name=""
              id="tags"
              required
              placeholder="MERN, next 13, react,Socket io, css, LMS"
              className={`${style.input}`}
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="category" className={`${style.label} w-[50%]`}>
              Course Category
            </label>
            <select
              name=""
              id="category"
              className={`${style.input}`}
              value={courseInfo.categories}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option
                value=""
                className="dark:bg-[#333] dark:text-white text-black bg-[#fff]"
              >
                Select Category
              </option>
              {categorys.map((category: any) => (
                <option
                  className="dark:bg-[#333] dark:text-white text-black bg-[#fff]"
                  value={category._id}
                  key={category._id}
                >
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className="flex items-center justify-between w-full">
          <div className="w-[45%]">
            <label htmlFor="level" className={`${style.label}`}>
              Course Level
            </label>
            <input
              type="text"
              name=""
              required
              id="level"
              placeholder="Beginner/Intermediate/Expert"
              className={`${style.input}`}
              value={courseInfo.level}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="demo-url" className={`${style.label} w-[50%]`}>
              Demo Url
            </label>
            <input
              type="text"
              name=""
              required
              id="demo-url"
              placeholder="eer74fds"
              className={`${style.input}`}
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="thumbnail"
                className="w-full max-h-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and Drop thumbnail here or click to upload
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input type="submit" value="Next" className={`${style.btn2}`} />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;
