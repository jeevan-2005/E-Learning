import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  content: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = ({
  content,
  activeVideo,
  setActiveVideo,
  isDemo,
}) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  const videoSections: string[] = Array.from(
    new Set<string>(content.map((item: any) => item.videoSection))
  );

  let totalCount: number = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-[15px] w-full ${
        isDemo && "ml-[10px] sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section: string, index: number) => {
        const isSectionVisible = visibleSections.has(section);
        const sectionVideos: [] = content.filter(
          (item: any) => item.videoSection === section
        );
        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (acc: number, item: any) => acc + item.videoLength,
          0
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div className={`border-b dark:border-[#ffffff39] border-[#0000001e]  py-2`} key={section}>
            <div className="w-full flex">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-black dark:text-white text-[22px]">
                  {section}
                </h2>
                <button
                  className="text-dark dark:text-white cursor-pointer mr-4"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp
                      size={20}
                      className="text-black dark:text-white"
                    />
                  ) : (
                    <BsChevronDown
                      size={20}
                      className="text-black dark:text-white"
                    />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white p-0 m-0">
              {sectionVideoCount} Lessons -{" "}
              {sectionVideoLength < 60
                ? `${sectionVideoLength} minutes`
                : `${sectionContentHours.toFixed(2)} hours`}
            </h5>
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const contentLength: number = item.videoLength / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === activeVideo
                          ? "dark:bg-slate-800 bg-slate-200  p-2 rounded"
                          : "cursor-pointer transition-all p-2"
                      }`}
                      onClick={() =>
                        isDemo ? null : setActiveVideo(videoIndex)
                      }
                      key={index}
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo
                            size={20}
                            color="#1cdada"
                            className="mr-2"
                          />
                        </div>
                        <h1 className="text-black dark:text-white text-[18px] break-words inline-block">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="text-black dark:text-white pl-8">
                        {item.videoLength > 60
                          ? contentLength.toFixed(2)
                          : item.videoLength}{" "}
                        {item.videoLength > 60 ? "hours" : "minutes"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
