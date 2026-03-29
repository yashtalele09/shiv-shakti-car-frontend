import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                  : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm"
              }`}>
              {/* Question */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-5 py-4">
                <p
                  className={`font-semibold text-left text-sm md:text-base ${
                    isOpen ? "text-blue-600" : "text-gray-800"
                  }`}>
                  {faq.question}
                </p>

                <ChevronDown
                  className={`transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 text-blue-600"
                      : "rotate-0 text-gray-400"
                  }`}
                />
              </button>

              {/* Answer Animation */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 overflow-hidden">
                    <p className="text-gray-600 text-sm pb-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
