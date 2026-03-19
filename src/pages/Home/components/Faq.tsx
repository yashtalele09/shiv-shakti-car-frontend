import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I book a car?",
    answer: "Select a car and click the book button to continue.",
  },
  {
    question: "Can I inspect the car before buying?",
    answer: "Yes, you can schedule a visit to inspect the car.",
  },
  {
    question: "Do you provide financing options?",
    answer: "Yes, we work with banks to provide financing.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mt-5 mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className=" rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}>
              <p className="text-blue-500 font-semibold text-sm md:text-base">
                Q.{index + 1} {faq.question}
              </p>

              <ChevronDown
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-blue-500" : "rotate-0"
                }`}
              />
            </button>

            {/* Animated Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-40 mt-3" : "max-h-0"
              }`}>
              <p className="text-gray-600 text-sm leading-relaxed">
                A. {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
