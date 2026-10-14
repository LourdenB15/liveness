import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = [
  {
    question: "How accurate is the liveness detection?",
    answer:
      "The SDK tracks 468 facial landmarks to verify natural movement and head orientation, blocking static photos and screen replays.",
  },
  {
    question: "What browsers and devices are supported?",
    answer:
      "The SDK runs in Chrome, Safari, Firefox, and Edge on iOS, Android, macOS, and Windows.",
  },
  {
    question: "Is user biometric data stored on your servers?",
    answer:
      "Servers never receive camera images. The client extracts a 128-dimensional numerical vector, and matching runs without storing raw photos.",
  },
  {
    question: "How long does SDK integration take?",
    answer:
      "Basic integration requires calling load() and start() on the video element, then posting the resulting descriptor to your verification endpoint.",
  },
  {
    question: "Is there a limit on API usage?",
    answer:
      "API keys and verification requests have no usage caps or rate tiers.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faq"
      className="content-visibility-auto border-t border-slate-200/80 bg-white px-4 py-12 sm:px-6 md:px-12 md:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 md:mb-12">
          <h2 className="font-display mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Common questions
          </h2>
          <p className="max-w-xl text-xs text-slate-600 sm:text-sm">
            Integrating and deploying Liveness Cloud.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200/80 bg-[#fafbfc] transition-all hover:border-slate-300"
              >
                <button
                  id={`faq-question-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-semibold text-slate-900 transition-colors hover:text-[#2f5bf5] sm:p-5"
                >
                  <span className="font-display pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#2f5bf5]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="border-t border-slate-200/60 px-4 pt-3 pb-5 text-xs leading-relaxed text-slate-600 sm:px-5 sm:pb-5 sm:text-sm"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
