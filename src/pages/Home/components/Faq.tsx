import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    <div className="max-w-2xl mx-auto">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b py-4">
          <button
            className="flex justify-between w-full text-left font-semibold"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <p className="text-blue-400 text-sm">
              Q.{index + 1} {faq.question}
            </p>
            <span>{openIndex === index ? <ChevronUp /> : <ChevronDown />}</span>
          </button>

          {openIndex === index && (
            <p className="mt-2 text-gray-600 text-sm">A. {faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
