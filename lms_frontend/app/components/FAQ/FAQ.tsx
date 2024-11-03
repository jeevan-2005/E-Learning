import React, { useEffect, useState } from "react";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import { style } from "../../styles/styles";
import Loader from "../Loader/Loader";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ = (props: Props) => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-[90%] 800px:w-[80%] mx-auto mb-10">
      <h1 className={`${style.title} 800px:!text-[40px]`}>
        Frequently Asked Questions
      </h1>
      <div className="mt-8">
        <dl className="space-y-0">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-200 py-4`}
            >
              <dt className="text-lg">
                <button
                  className="flex items-center justify-between w-full text-left dark:text-white text-black focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <span className="font-medium text-black dark:text-white">
                    {q.question}
                  </span>
                  <span className="flex-shrink-0 ml-6">
                    {activeQuestion === q._id ? (
                      <HiMinus className="w-6 h-6" />
                    ) : (
                      <HiPlus className="w-6 h-6" />
                    )}
                  </span>
                </button>
              </dt>
              {activeQuestion === q._id && (
                <dd className="mt-2 pr-12">
                  <p className="text-black dark:text-white">{q.answer}</p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQ;
