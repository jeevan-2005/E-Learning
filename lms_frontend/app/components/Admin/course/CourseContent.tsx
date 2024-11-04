import toast from "react-hot-toast";
import { style } from "../../../styles/styles";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleCollapsedToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const removeLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const addLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  };

  const addNewContent = (item: any) => {
    if (
      item.title === "" ||
      item.videoUrl === "" ||
      item.description === "" ||
      item.videoLength === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("Please fill all the fields before moving to next step");
      return;
    }

    let newVideoSection = "";
    if (courseContentData.lenght > 0) {
      const lastVideoSection =
        courseContentData[courseContentData.length - 1].videoSection;
      if (lastVideoSection) {
        newVideoSection = lastVideoSection;
      }
    }

    const newContent = {
      title: "",
      videoUrl: "",
      description: "",
      videoLength: 0,
      videoSection: newVideoSection,
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  const addNewSection = () => {
    if (courseContentData[courseContentData.length - 1].videoSection === "") {
      toast.error("Please fill the section name before adding new section");
      return;
    }
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].videoLength === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields before moving to next step");
      return;
    }
    setActiveSection(activeSection + 1);
    const newCourseSection = {
      title: "",
      videoUrl: "",
      description: "",
      videoLength: 0,
      videoSection: `Untitled Section ${activeSection + 1}`,
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    };

    setCourseContentData([...courseContentData, newCourseSection]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const nextButton = () => {
    if (courseContentData[courseContentData.length - 1].videoSection === "") {
      toast.error("Please fill the section name before moving to next step");
      return;
    }
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoLength === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields before moving to next step");
      return;
    }
    handleCourseSubmit();
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {
          const showSectionInput =
            index == 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <>
              <div
                className={`w-full dark:bg-[#cdc8c81a] bg-[#cdc8c833]  p-4 rounded-xl ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
                {showSectionInput && (
                  <>
                    <div className="w-full flex items-center">
                      <input
                        type="text"
                        placeholder="Untitled Section"
                        className={`text-[20px] ${
                          item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                        } font-Poppins cursor-pointer text-black dark:text-white bg-transparent outline-none`}
                        value={item.videoSection}
                        onChange={(e) => {
                          const updatedCourseContentData = [
                            ...courseContentData,
                          ];
                          updatedCourseContentData[index].videoSection =
                            e.target.value;
                          setCourseContentData(updatedCourseContentData);
                        }}
                      />
                      <BsPencil className="text-black dark:text-white cursor-pointer ml-3" />
                    </div>
                    <br />
                  </>
                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="font-Poppins text-black dark:text-white">
                          {index + 1}. {item.title}
                        </p>
                      ) : (
                        <>
                          <p className="font-Poppins text-black dark:text-white">
                            Add title using below form
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}
                  {/* arrow and delete button */}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`dark:text-white text-black text-[20px] mr-2 ${
                        courseContentData.length > 1
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (courseContentData.length > 1) {
                          const updatedCourseContentData = [
                            ...courseContentData,
                          ];
                          updatedCourseContentData.splice(index, 1);
                          setCourseContentData(updatedCourseContentData);
                        }
                      }}
                    />
                    <MdOutlineKeyboardArrowDown
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                      }}
                      className="text-black dark:text-white text-[20px] cursor-pointer"
                      onClick={() => handleCollapsedToggle(index)}
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-4">
                      <label htmlFor="title" className={`${style.label}`}>
                        Video Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Project plan..."
                        className={`${style.input} !mt-[5px]`}
                        value={item.title}
                        required
                        onChange={(e) => {
                          const updatedCourseContentData =
                            courseContentData.map((item: any, i: number) =>
                              i === index
                                ? { ...item, title: e.target.value }
                                : item
                            );
                          setCourseContentData(updatedCourseContentData);
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <label htmlFor="video-url" className={`${style.label}`}>
                        Video Url
                      </label>
                      <input
                        type="text"
                        id="video-url"
                        placeholder="video url here..."
                        className={`${style.input} !mt-[5px]`}
                        required
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedCourseContentData =
                            courseContentData.map((item: any, i: number) =>
                              i === index
                                ? { ...item, videoUrl: e.target.value }
                                : item
                            );
                          setCourseContentData(updatedCourseContentData);
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <label htmlFor="video-length" className={`${style.label}`}>
                        Video Length (in minutes)
                      </label>
                      <input
                        type="number"
                        id="video-length"
                        placeholder="video length here..."
                        className={`${style.input} !mt-[5px]`}
                        required
                        value={item.videoLength}
                        onChange={(e) => {
                          const updatedCourseContentData =
                            courseContentData.map((item: any, i: number) =>
                              i === index
                                ? { ...item, videoLength: e.target.value }
                                : item
                            );
                          setCourseContentData(updatedCourseContentData);
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <label htmlFor="video-desc" className={`${style.label}`}>
                        Video Description
                      </label>
                      <textarea
                        rows={8}
                        cols={30}
                        id="video-desc"
                        required
                        placeholder="give video description here..."
                        className={`${style.input} !mt-[5px] py-2 !h-min`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedCourseContentData =
                            courseContentData.map((item: any, i: number) =>
                              i === index
                                ? { ...item, description: e.target.value }
                                : item
                            );
                          setCourseContentData(updatedCourseContentData);
                        }}
                      />
                      <br />
                    </div>
                    {item?.links.map((link: any, linkIndex: number) => (
                      <div key={linkIndex} className="mb-3 display-block">
                        <div className="w-full flex items-center justify-between">
                          <label className={`${style.label}`}>
                            Link - {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`dark:text-white text-black text-[20px] ml-3 ${
                              linkIndex > 0
                                ? "cursor-pointer"
                                : "cursor-no-drop"
                            }`}
                            onClick={() =>
                              linkIndex === 0
                                ? null
                                : removeLink(index, linkIndex)
                            }
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Source Code.... (link title)"
                          className={`${style.input}`}
                          value={link.title}
                          required
                          onChange={(e) => {
                            const updatedCourseContentData =
                              courseContentData.map((item: any, i: number) =>
                                i === index
                                  ? {
                                      ...item,
                                      links: item.links.map(
                                        (link: any, j: number) =>
                                          j === linkIndex
                                            ? { ...link, title: e.target.value }
                                            : link
                                      ),
                                    }
                                  : item
                              );
                            setCourseContentData(updatedCourseContentData);
                          }}
                        />
                        <input
                          type="url"
                          placeholder="Source Code Url.... (link url)"
                          className={`${style.input} !mt-5`}
                          value={link.url}
                          required
                          onChange={(e) => {
                            const updatedCourseContentData =
                              courseContentData.map((item: any, i: number) =>
                                i === index
                                  ? {
                                      ...item,
                                      links: item.links.map(
                                        (link: any, j: number) =>
                                          j === linkIndex
                                            ? { ...link, url: e.target.value }
                                            : link
                                      ),
                                    }
                                  : item
                              );
                            setCourseContentData(updatedCourseContentData);
                          }}
                        />
                      </div>
                    ))}
                    <div className="inline-block mb-4">
                      <p
                        className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                        onClick={() => addLink(index)}
                      >
                        <BsLink45Deg className="mr-1" /> Add Link
                      </p>
                    </div>
                  </>
                )}
                <br />
                {/* new content */}
                {index === courseContentData.length - 1 && (
                  <div>
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={() => addNewContent(item)}
                    >
                      <AiOutlinePlusCircle className="mr-2" /> Add New Content
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        })}
        <br />
        <div className="flex w-full items-center justify-center">
          <p
            className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
            onClick={() => addNewSection()}
          >
            <AiOutlinePlusCircle className="mr-2" /> Add New Section
          </p>
        </div>
        <br />
        <div className="w-full flex items-center justify-between">
          <div className={`${style.btn2}`} onClick={() => prevButton()}>
            Prev
          </div>
          <div className={`${style.btn2}`} onClick={() => nextButton()}>
            Next
          </div>
        </div>
      </form>
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
