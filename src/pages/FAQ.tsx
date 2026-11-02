import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { companyInfo } from "@/lib/data";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "DUST™ Ragi Laddoo Mix",
    question: "What are the health benefits of this laddoo mix?",
    answer:
      "DUST™ Ragi & Dry Fruit Laddoo Mix combines calcium-rich ragi with almonds, cashews, pumpkin seeds, watermelon seeds and sunflower seeds. It provides dietary fibre, plant-based nutrients, healthy fats and energy, making it a wholesome traditional snacking option.",
  },
  {
    category: "DUST™ Ragi Laddoo Mix",
    question: "How many laddoos can we make out of each pack?",
    answer:
      "One 250 g pack can make approximately 10–20 medium-sized laddoos, depending on the size you prefer.",
  },
  {
    category: "DUST™ Ragi Laddoo Mix",
    question: "Can we make laddoos with milk?",
    answer:
      "NO. However, adding ghee is a suitable option for binding the mixture. Follow the preparation instructions provided on the pack.",
  },
  {
    category: "DUST™ Ragi Laddoo Mix",
    question: "Storage & Shelf Life: How should DUST™ Ragi & Dry Fruit Laddoo Mix be stored?",
    answer:
      "DUST™️ Ragi & Dry Fruit Laddoo Mix should be stored in a cool, dry place, away from direct sunlight, heat and moisture.\n\n• Shelf Life: 6 months from the date of manufacturing, subject to validated shelf-life testing.\n• After Opening: Transfer the contents to a clean, dry, airtight container and consume within 20–25 days.\n• Refrigeration: Refrigeration may help slow down quality deterioration. Keep the product in an airtight container and protect it from moisture and condensation.\n\nAlways use a clean, dry spoon and reseal the pack properly after every use.",
  },
  {
    category: "DUST™ Ragi Laddoo Mix",
    question: "How many days can we store the laddoos once made?",
    answer:
      "For the best taste and freshness, prepare laddoos in small batches. Store them in a clean, airtight container. Laddoos once made can be stored up to 15–20 days in an airtight container.",
  },
  {
    category: "Orders & Shipping",
    question: "What are the shipping charges and delivery timelines?",
    answer:
      "We offer FREE Express Shipping across India on all prepaid orders of ₹799 and above. For prepaid orders below ₹799, standard shipping is ₹50. For Cash on Delivery (COD) orders, a flat delivery fee of ₹120 applies. Orders are dispatched within 24 hours and delivered in 3–5 business days.",
  },
  {
    category: "Orders & Shipping",
    question: "Can I place Cash on Delivery (COD) orders?",
    answer:
      "Yes, COD is available across serviceable PIN codes in India. Please note that COD orders incur a delivery and handling fee of ₹120. Free shipping applies exclusively to prepaid orders of ₹799 and above.",
  },
  {
    category: "Company & Support",
    question: "Who is the parent company behind DUST?",
    answer: `DUST is parented by ${companyInfo.name} (CIN: ${companyInfo.cin}, GSTIN: ${companyInfo.gstin}), headquartered in Pune, Maharashtra.`,
  },
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "DUST™ Ragi Laddoo Mix", "Orders & Shipping", "Company & Support"];

  const filteredFaqs =
    activeCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="max-w-3xl mb-10 space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> FREQUENTLY ASKED QUESTIONS
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0E382E]">
          Got Questions?
        </h1>
        <p className="text-base text-[#1F684B]">
          Find answers about DUST™ Ragi & Dry Fruit Laddoo Mix, preparation methods, storage tips, and delivery across India.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIdx(0);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-[#0E382E] text-white shadow-sm"
                : "bg-white text-[#0E382E] border border-[#74B487]/40 hover:border-[#E67E22]"
            }`}
          >
            {cat === "DUST™ Ragi Laddoo Mix" ? (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" /> {cat}
              </span>
            ) : (
              cat
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl space-y-4">
        {filteredFaqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#74B487]/40 overflow-hidden shadow-xs transition-all hover:border-[#E67E22]/50"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-[#E8F1E9]/30 transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#E67E22] tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <span className="text-base font-extrabold text-[#0E382E]">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#1F684B] transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180 text-[#E67E22]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#1F684B] leading-relaxed border-t border-[#74B487]/20 font-medium whitespace-pre-line">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
