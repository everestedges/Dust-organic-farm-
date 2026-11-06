import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Tag, ShoppingBag, CheckCircle2, Building2, BadgePercent, Truck, Store, Send } from "lucide-react";
import { products, companyInfo } from "@/lib/data";
import laddooMix from "@/assets/laddooMix.webp";
import ragiPouch from "@/assets/ragi-pouch.webp";
import paanPouchStick from "@/assets/paan-pouch-stick.webp";
import paanPouchBack from "@/assets/paan-pouch-back.webp";
import comboAdBanner from "@/assets/dust-wellness-combo-advertisement.webp";

export const Combos: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#74B487]/40 bg-[#0E382E] text-white p-8 sm:p-12 mb-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> BUNDLE & SAVE MORE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
            Combos & Variety Boxes
          </h1>
          <p className="text-sm text-[#E8F1E9] font-normal leading-relaxed">
            Get the complete DUST taste experience. Multipacks, Digestive duos, and seasonal refreshment bundles at exclusive direct-to-consumer prices.
          </p>
        </div>
      </div>

      {/* Featured Promotional Advertisement Banner */}
      <div className="mb-16">
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#74B487]/50 shadow-2xl bg-[#0E382E] group">
          <img
            src={comboAdBanner}
            alt="DUST Wellness Combo Advertisement — Digestive Care & Nutritious Snacking"
            className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>
      </div>

      {/* Featured Combo Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {/* Combo 1: Laddoo Premix Twin Pack 500g */}
        <div className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-6 hover:shadow-xl hover:border-[#E67E22]/60 transition-all duration-300 group">
          <div className="space-y-5">
            {/* Combo Visual Showcase */}
            <div className="relative w-full h-60 sm:h-72 rounded-2xl bg-gradient-to-br from-[#E8F1E9]/70 via-[#F6F5F0] to-[#E8F1E9]/40 border border-[#74B487]/30 overflow-hidden flex items-center justify-center p-4">
              {/* Floating Badges */}
              <div className="absolute top-3 left-3 z-10">
                <span className="badge-orange text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                  SUPER SAVER TWIN PACK
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className="text-xs font-black text-[#E67E22] bg-white border border-[#E67E22]/30 px-3 py-1 rounded-full shadow-xs">
                  SAVE ₹60
                </span>
              </div>

              {/* 2-Pack Laddoo Visual Arrangement */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 w-full h-full pt-4 relative group-hover:scale-105 transition-all duration-300">
                <img
                  src={ragiPouch}
                  alt="Shahi Ragi & Dry Fruit Laddoo Mix 250g Pack 1"
                  className="h-28 sm:h-38 md:h-44 w-auto object-contain drop-shadow-xl -rotate-6 -translate-x-3 sm:-translate-x-5 transition-all duration-300 group-hover:-translate-x-4 rounded-xl border border-[#74B487]/30 shadow-md"
                />
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0E382E] text-[#E67E22] font-black text-xs sm:text-sm flex items-center justify-center shadow-md shrink-0 z-20">
                  +
                </span>
                <img
                  src={ragiPouch}
                  alt="Shahi Ragi & Dry Fruit Laddoo Mix 250g Pack 2"
                  className="h-28 sm:h-38 md:h-44 w-auto object-contain drop-shadow-xl rotate-6 translate-x-3 sm:translate-x-5 transition-all duration-300 group-hover:translate-x-4 rounded-xl border border-[#74B487]/30 shadow-md"
                />
              </div>

              {/* Bottom Pack Tag */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#0E382E] bg-white/90 backdrop-blur-xs px-3 py-0.5 rounded-full border border-[#74B487]/40 shadow-2xs">
                  500g Value Twin Pack (2× 250g)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0E382E] leading-tight">
                Shahi Ragi Laddoo Mix Twin Pack (500g)
              </h2>

              <p className="text-xs text-[#1F684B] leading-relaxed">
                2× Shahi Ragi & Dry Fruit Laddoo Mix (250g each). Pure millet & nut laddoo premix with zero added sugar. Yields 20–24 nutritious home-made laddoos.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-[#0E382E] font-semibold pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>2× 250g Pure Millet & Nut Laddoo Mix (500g Total)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Yields 20–24 Fresh Wholesome Laddoos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>100% Wholesome Ingredients (Zero Added Sugar)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Free Express Shipping Pan-India</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#74B487]/30 flex items-center justify-between">
            <div>
              <span className="text-xs line-through text-stone-400 font-bold block">₹518</span>
              <span className="text-3xl font-extrabold text-[#0E382E]">₹458</span>
            </div>

            <Link
              to="/product/shahi-ragi-dry-fruit-laddoo-mix"
              className="btn-dust-orange px-6 py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              Order Combo <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {/* Combo 1 */}
        <div className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-6 hover:shadow-xl hover:border-[#E67E22]/60 transition-all duration-300 group">
          <div className="space-y-5">
            {/* Combo Visual Showcase */}
            <div className="relative w-full h-60 sm:h-72 rounded-2xl bg-gradient-to-br from-[#E8F1E9]/70 via-[#F6F5F0] to-[#E8F1E9]/40 border border-[#74B487]/30 overflow-hidden flex items-center justify-center p-4">
              {/* Floating Badges */}
              <div className="absolute top-3 left-3 z-10">
                <span className="badge-orange text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                  BEST SELLER COMBO
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className="text-xs font-black text-[#E67E22] bg-white border border-[#E67E22]/30 px-3 py-1 rounded-full shadow-xs">
                  SAVE ₹160
                </span>
              </div>

              {/* Duo Product Mockup Arrangement */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-4 w-full h-full pt-4 max-w-full">
                <img
                  src={laddooMix}
                  alt="Shahi Ragi & Dry Fruit Laddoo Mix"
                  className="h-28 sm:h-40 md:h-48 w-auto max-w-[55%] sm:max-w-none object-contain drop-shadow-xl -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 shrink-0"
                />
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0E382E] text-[#E67E22] font-black text-xs sm:text-sm flex items-center justify-center shadow-md shrink-0 z-10">
                  +
                </span>
                {/* Authentic Paan Pouch Duo (matching official client packaging) */}
                <div className="relative flex items-center justify-center h-32 sm:h-44 md:h-52 shrink-0 group-hover:scale-105 transition-all duration-300">
                  <img
                    src={paanPouchBack}
                    alt="DUST Paan Digestive Shot Back Packaging"
                    className="h-26 sm:h-36 md:h-42 w-auto object-contain drop-shadow-md rotate-6 translate-x-2 sm:translate-x-3 opacity-75"
                  />
                  <img
                    src={paanPouchStick}
                    alt="DUST Paan Digestive Shot Official Sachet"
                    className="h-32 sm:h-44 md:h-52 w-auto object-contain drop-shadow-xl -rotate-3 z-10"
                  />
                </div>
              </div>

              {/* Bottom Pack Tag */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#0E382E] bg-white/90 backdrop-blur-xs px-3 py-0.5 rounded-full border border-[#74B487]/40 shadow-2xs">
                  500g Laddoo Mix (2 Packs) + 20 Paan Sachets
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0E382E] leading-tight">
                The Royal Heritage & Superfood Pack
              </h2>

              <p className="text-xs text-[#1F684B] leading-relaxed">
                2× Shahi Ragi & Dry Fruit Laddoo Mix (250g each = 500g) + 20 Paan Digestive Shot Sachets (Makes 40 Fresh Shots). The ideal combination of Wholesome Laddoo premix nutrition and royal post-meal digestive freshness.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-[#0E382E] font-semibold pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>2 Packets Laddoo Mix (250g + 250g = 500g Total)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>20 Royal Paan Digestive Sachets (Makes 40 Fresh Shots)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Free Express Shipping Pan-India</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#74B487]/30 flex items-center justify-between">
            <div>
              <span className="text-xs line-through text-stone-400 font-bold block">₹1218</span>
              <span className="text-3xl font-extrabold text-[#0E382E]">₹1058</span>
            </div>

            <Link
              to="/product/shahi-ragi-dry-fruit-laddoo-mix"
              className="btn-dust-orange px-6 py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              Order Combo <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Combo 2 */}
        <div className="bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-6 hover:shadow-xl hover:border-[#E67E22]/60 transition-all duration-300 group">
          <div className="space-y-5">
            {/* Combo Visual Showcase */}
            <div className="relative w-full h-60 sm:h-72 rounded-2xl bg-gradient-to-br from-[#E8F1E9]/70 via-[#F6F5F0] to-[#E8F1E9]/40 border border-[#74B487]/30 overflow-hidden flex items-center justify-center p-4">
              {/* Floating Badges */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#0E382E] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
                  MONTHLY RITUAL PACK
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className="text-xs font-black text-[#E67E22] bg-white border border-[#E67E22]/30 px-3 py-1 rounded-full shadow-xs">
                  SAVE ₹101
                </span>
              </div>

              {/* 3-Pack Visual Arrangement */}
              <div className="flex items-center justify-center w-full h-full pt-4 relative group-hover:scale-105 transition-all duration-300">
                {/* Left Angled Official Pouch */}
                <img
                  src={paanPouchStick}
                  alt="DUST Paan Digestive Shot"
                  className="h-28 sm:h-38 md:h-44 w-auto object-contain drop-shadow-lg -rotate-12 -translate-x-7 sm:-translate-x-12 translate-y-1 opacity-90 transition-all duration-300 group-hover:-translate-x-9"
                />
                {/* Center Upright Hero Pouch */}
                <img
                  src={paanPouchStick}
                  alt="DUST Paan Digestive Shot Official Sachet"
                  className="h-34 sm:h-46 md:h-52 w-auto object-contain drop-shadow-2xl z-10 transition-all duration-300"
                />
                {/* Right Angled Back Details Pouch */}
                <img
                  src={paanPouchBack}
                  alt="DUST Paan Digestive Shot Back Details"
                  className="h-28 sm:h-38 md:h-44 w-auto object-contain drop-shadow-lg rotate-12 translate-x-7 sm:translate-x-12 translate-y-1 opacity-90 transition-all duration-300 group-hover:translate-x-9"
                />
              </div>

              {/* Bottom Pack Tag */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#0E382E] bg-white/90 backdrop-blur-xs px-3 py-0.5 rounded-full border border-[#74B487]/40 shadow-2xs">
                  30 Shots Monthly Combo • 3 Boxes
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0E382E] leading-tight">
                30 Shots Monthly Combo
              </h2>

              <p className="text-xs text-[#1F684B] leading-relaxed">
                Your complete 30-day post-dinner digestive ritual. 3 boxes (30 digestive shots) of authentic Banarasi betel leaf, rose gulkand, and prebiotic inulin fiber.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-[#0E382E] font-semibold pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>30 Royal Paan Digestive Shots (30-Day Ritual)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Enriched with Prebiotic Inulin Fiber</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Zero Artificial Preservatives & 100% Vegetarian</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>Free Express Shipping Pan-India</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#74B487]/30 flex items-center justify-between">
            <div>
              <span className="text-xs line-through text-stone-400 font-bold block">₹900</span>
              <span className="text-3xl font-extrabold text-[#0E382E]">₹799</span>
            </div>

            <Link
              to="/product/paan-digestive-shot"
              className="btn-dust-orange px-6 py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              Order Combo <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Distributor & Dealership Lead Enquiry Section */}
      <div className="bg-white rounded-3xl border border-[#74B487]/40 p-8 sm:p-12 shadow-xl space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> B2B & WHOLESALE PARTNERSHIP
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E] leading-tight">
              Become an Authorized DUST Distributor or Dealer
            </h2>

            <p className="text-xs text-[#1F684B] leading-relaxed font-medium">
              Partner with <strong>{companyInfo.name}</strong> to bring India's fastest-growing wholesome consumer brand and heritage wellness products to your regional retail network.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 bg-[#E8F1E9]/60 rounded-2xl border border-[#74B487]/30">
                <BadgePercent className="w-6 h-6 text-[#E67E22] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#0E382E] uppercase">High Profit Margins</h4>
                  <p className="text-[11px] text-[#1F684B] mt-0.5">Attractive distributor margins, bulk discounts, and price protection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#E8F1E9]/60 rounded-2xl border border-[#74B487]/30">
                <Truck className="w-6 h-6 text-[#E67E22] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#0E382E] uppercase">Direct Dispatch from Pune Hub</h4>
                  <p className="text-[11px] text-[#1F684B] mt-0.5">Fast pan-India dispatch directly from our Ravet, Pune plant.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#E8F1E9]/60 rounded-2xl border border-[#74B487]/30">
                <Store className="w-6 h-6 text-[#E67E22] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#0E382E] uppercase">POS & Marketing Support</h4>
                  <p className="text-[11px] text-[#1F684B] mt-0.5">Counter display boxes, product brochures, and digital collateral.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#1F684B] font-semibold space-y-1">
              <p>Direct Business Email: <a href={`mailto:${companyInfo.businessEmail}`} className="text-[#E67E22] underline">{companyInfo.businessEmail}</a></p>
              <p>Distributor Helpline: <a href={`tel:${companyInfo.phone}`} className="text-[#0E382E] underline">{companyInfo.phoneFormatted}</a></p>
            </div>
          </div>

          {/* Right Column: Lead Enquiry Form */}
          <div className="lg:col-span-7 bg-[#F6F5F0] p-6 sm:p-8 rounded-3xl border border-[#74B487]/40">
            <DistributorForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const DistributorForm: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    cityState: "",
    channel: "Regional Distributor",
    investment: "₹20,000 – ₹50,000",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.cityState.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const API_BASE =
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? "/api"
        : "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_BASE}/distributor-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          cityState: formData.cityState.trim(),
          channel: formData.channel,
          investment: formData.investment,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error connecting to database: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-[#74B487] text-center space-y-4 shadow-sm">
        <CheckCircle2 className="w-14 h-14 text-[#E67E22] mx-auto" />
        <h3 className="text-2xl font-extrabold text-[#0E382E]">
          Distributor Lead Submitted!
        </h3>
        <p className="text-xs text-[#1F684B] leading-relaxed">
          Thank you <strong>{formData.name}</strong> ({formData.company}). Our National Distribution Manager will review your inquiry for <strong>{formData.cityState}</strong> and contact you within 24 hours at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong>.
        </p>
        <div className="pt-2 text-[11px] text-[#74B487] font-bold">
          Confirmation copy sent to {companyInfo.businessEmail}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-b border-[#74B487]/30 pb-3 mb-2">
        <h3 className="text-xl font-extrabold text-[#0E382E]">
          Distributor & Dealership Application
        </h3>
        <p className="text-xs text-[#1F684B]">Fill out your details to receive our wholesale price list & catalog.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            Owner / Contact Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            Company / Enterprise Name *
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Om Traders & Agency"
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            Mobile / WhatsApp Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="10-digit mobile number"
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            City & State (Target Area) *
          </label>
          <input
            type="text"
            required
            value={formData.cityState}
            onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
            placeholder="e.g. Pune, Maharashtra"
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
            Distribution Channel
          </label>
          <select
            value={formData.channel}
            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22] font-semibold"
          >
            <option value="Regional Distributor">Regional Distributor</option>
            <option value="Super Stockist">Super Stockist</option>
            <option value="Retail Dealer / Agency">Retail Dealer / Agency</option>
            <option value="Modern Trade / Chain Store">Modern Trade / Chain Store</option>
            <option value="Corporate Bulk Buyer">Corporate Bulk Buyer</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
          Estimated Monthly Purchase Capacity
        </label>
        <select
          value={formData.investment}
          onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
          className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22] font-semibold"
        >
          <option value="₹20,000 – ₹50,000">₹20,000 – ₹50,000</option>
          <option value="₹50,000 – ₹2 Lakhs">₹50,000 – ₹2 Lakhs</option>
          <option value="₹2 Lakhs – ₹5 Lakhs">₹2 Lakhs – ₹5 Lakhs</option>
          <option value="Above ₹5 Lakhs">Above ₹5 Lakhs</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-[#0E382E] uppercase mb-1">
          Current FMCG Experience / Business Profile
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your current distribution network and retail coverage..."
          className="w-full bg-white border border-[#74B487]/40 rounded-xl p-3 text-xs outline-none focus:border-[#E67E22]"
        />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-dust-orange py-4 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving Inquiry to Database...
          </>
        ) : (
          <>
            Submit Distributor Lead <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
