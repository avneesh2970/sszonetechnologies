import React, { useState } from "react";
import Heading from "../pages/Heading";

const Faq = () => {
  const faqsData = [
    {
      question: "Lightning-Fast Performance",
      answer: "Built with speed — minimal load times and optimized rendering.",
    },
    {
      question: "Fully Customizable Components",
      answer:
        "Easily adjust styles, structure, and behavior to match your project needs.",
    },
    {
      question: "Responsive by Default",
      answer:
        "Every component are responsive by default — no extra CSS required.",
    },
    {
      question: "Tailwind CSS Powered",
      answer:
        "Built using Tailwind utility classes — no extra CSS or frameworks required.",
    },
    {
      question: "Dark Mode Support",
      answer:
        "All components come ready with light and dark theme support out of the box.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  return (
    <>
      <div className="max-w-screen-2xl mx-auto ">
        <div className="flex flex-col items-center text-center text-slate-800 p-3">
          <Heading
            title="faq"
            subTitle="Frequently Asked Question"
            content="Proactively answering FAQs boosts user confidence and cuts down on
            support tickets."
          />
          <div className="max-w-4xl w-full mt-6 flex flex-col gap-4 items-start text-left">
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className="flex flex-col items-start w-full bg-slate-50 border border-slate-200 rounded"
              >
                <div
                  className="flex items-center justify-between w-full cursor-pointer  px-4 py-3"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <h2 className="text-lg font-semibold">{faq.question}</h2>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-500 ease-in-out ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                      stroke="#1D293D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out px-4 ${
                    openIndex === index
                      ? "max-h-40 opacity-100 py-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-slate-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
