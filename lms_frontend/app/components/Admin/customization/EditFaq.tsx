import { style } from "../../../styles/styles";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq: FC<Props> = (props) => {
  const {
    data,
    isLoading: loadingData,
    refetch,
  } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("FAQ updated successfully");
      refetch();
    }

    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const areQuestionsUnchanged = (questions: any[], faq: any[]) => {
    return JSON.stringify(questions) === JSON.stringify(faq);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    const arr = questions.map((q) => q.question === "" || q.answer === "");
    if (arr.includes(true)) {
      return true;
    }
    return false;
  };

  const handleEditFaq = async () => {
    await editLayout({
      type: "FAQ",
      faq: questions,
    });
  };

  if (isLoading || loadingData) {
    return <Loader />;
  }

  return (
    <div className="w-[90%] 800px:w-[80%] mx-auto mt-[120px]">
      <div className="mt-12">
        <dl className="space-y-3">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-200 pt-3`}
            >
              <dt className="text-lg">
                <button
                  className="flex items-center justify-between w-full text-left dark:text-white text-black focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <input
                    value={q.question}
                    className={`${style.input} border-none`}
                    onChange={(e: any) =>
                      handleQuestionChange(q._id, e.target.value)
                    }
                    placeholder="Add your questions..."
                  />
                  <span className="flex-shrink-0 ml-6">
                    {q.active ? (
                      <HiMinus className="w-6 h-6" />
                    ) : (
                      <HiPlus className="w-6 h-6" />
                    )}
                  </span>
                </button>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${style.input} border-none`}
                    value={q.answer}
                    onChange={(e: any) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    placeholder="Add your answer..."
                  />
                  <span className="ml-6 flex-shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[20px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter(
                            (item: any) => item._id !== q._id
                          )
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[30px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      <div
        className={`${
          style.btn
        } !w-[100px] !min-h-[30px] dark:text-white text-black bg-[#cccccc34] !rounded absolute bottom-12 right-12
        ${
          areQuestionsUnchanged(questions, data?.layout?.faq) ||
          isAnyQuestionEmpty(questions)
            ? "!cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        }
      }`}
        onClick={
          areQuestionsUnchanged(questions, data?.layout?.faq) ||
          isAnyQuestionEmpty(questions)
            ? () => null
            : handleEditFaq
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditFaq;
