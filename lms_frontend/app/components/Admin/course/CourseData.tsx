import React, { FC } from "react";
import { style } from "../../../styles/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import toast from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenifitChange = (index: number, value: string) => {
    const updatedBenefits = benefits.map((benefit: any, i: number) => {
      if (i === index) {
        return { ...benefit, title: value };
      }
      return benefit;
    });
    setBenefits(updatedBenefits);
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    const updatedPrerequisites = prerequisites.map(
      (prerequisite: any, i: number) => {
        if (i === index) {
          return { ...prerequisite, title: value };
        }
        return prerequisite;
      }
    );
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddBenefits = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const nextButton = () => {
    if (
      benefits[benefits.length - 1].title !== "" &&
      prerequisites[prerequisites.length - 1].title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill all the fields before moving to next step");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label htmlFor="course-benefits" className={`${style.label}`}>
          What are the benefits for the students in this course?
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            required
            className={`${style.input} my-2`}
            name="course-benefits"
            placeholder="you will be able to build a full stack web application..."
            value={benefit.title}
            onChange={(e) => handleBenifitChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0", fontSize: "30px", cursor: "pointer" }}
          className="dark:text-white text-black" 
          onClick={handleAddBenefits}
        />
      </div>
      <br />
      <br />
      <div>
        <label htmlFor="course-prerequisites" className={`${style.label}`}>
          What are the prerequisites for the students in this course?
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type="text"
            key={index}
            required
            className={`${style.input} my-2`}
            name="course-prerequisites"
            placeholder="you need a high school diploma..."
            value={prerequisite.title}
            onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0", fontSize: "30px", cursor: "pointer" }}
          className="dark:text-white text-black"
          onClick={handleAddPrerequisites}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className={`${style.btn2}`} onClick={() => prevButton()}>
          Prev
        </div>
        <div className={`${style.btn2}`} onClick={() => nextButton()}>
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
