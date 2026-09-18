import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How do I book a car?',
    answer: 'Select a car and click the book button to continue.',
  },
  {
    question: 'Can I inspect the car before buying?',
    answer: 'Yes, you can schedule a visit to inspect the car.',
  },
  {
    question: 'Do you provide financing options?',
    answer: 'Yes, we work with banks to provide financing.',
  },
  {
    question: 'Is there a warranty on pre-owned cars?',
    answer:
      'Select vehicles come with a limited warranty. Check the listing page for details specific to each car.',
  },
  {
    question: 'What documents do I need to complete a purchase?',
    answer:
      'You will need a valid government ID, address proof, and PAN card. Our team will guide you through the rest of the paperwork.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        {/* Left column — sticky heading + support card */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Everything you need to know about buying and selling pre-owned cars
            with Shri Shivshakti Car Bazar. Can&apos;t find what you&apos;re
            looking for?
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <HelpCircle size={18} className="text-indigo-600" />
              Still have questions?
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Our team is happy to help with anything not covered here.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="mailto:support@carbazar.com"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                <Mail size={16} />
                support@carbazar.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                <Phone size={16} />
                +91 12345 67890
              </a>
            </div>
          </div>
        </div>

        {/* Right column — accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <p
                    className={`text-base font-semibold transition-colors lg:text-lg ${
                      isOpen ? 'text-blue-600' : 'text-gray-800'
                    }`}
                  >
                    {faq.question}
                  </p>

                  <ChevronDown
                    size={22}
                    className={`ml-4 shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 text-blue-600'
                        : 'rotate-0 text-gray-400'
                    }`}
                  />
                </button>

                {/* Answer Animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden px-6"
                    >
                      <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 lg:text-base">
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
    </div>
  );
};

export default FAQ;
