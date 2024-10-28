import React, { FC } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  return (
    <div className="pt-[41%] relative">
      <iframe
        style={{
            border: 0,
            width: "90%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
        }}
        src={videoUrl}
        title="YouTube video player"
        allow="encrypted-media"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default CoursePlayer;
