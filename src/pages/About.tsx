import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Globe,
  Leaf,
  Compass,
  Target,
  Award,
  Users,
  BookOpen,
  Briefcase,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Recycle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sprout,
  Check,
  FileText,
  Download,
  ExternalLink,
  Quote,
} from "lucide-react";
import { companyInfo } from "@/lib/data";
import farmerWastedHarvest from "@/assets/farmer-wasted-harvest.webp";
import farmersHarvestLost from "@/assets/farmers-harvest-lost.webp";
import farmSurplusWaste from "@/assets/farm-surplus-waste.webp";
import aboutBannerFarmWaste from "@/assets/about-banner-farm-waste.webp";
import aboutBannerLaddoo from "@/assets/about-banner-laddoo.webp";
import startupIndiaCertificateImg from "@/assets/startup-india-certificate.webp";
import chetanShelarImg from "@/assets/chetan-shelar.webp";
import mrunalPhotoImg from "@/assets/mrunal-photo.webp";

const heroBanners = [
  {
    image: aboutBannerFarmWaste,
    alt: "From Farm Waste to Nourishing Goodness - DUST",
    badge: "FROM FARM SURPLUS TO SUPERFOODS",
    title: "Building India’s Next Generation of Consumer Brands.",
    desc: `${companyInfo.brand} is rooted in nature and made for modern India — thoughtfully bringing together nourishing food blends, fruit-powered refreshments, everyday nutrition, and nature-inspired personal care.`,
  },
  {
    image: aboutBannerLaddoo,
    alt: "Warm Family Laddoo Mix - DUST Wholesome Goodness",
    badge: "AUTHENTIC NOSTALGIC TASTE",
    title: "Pure Indian Nutrition Made for Every Household.",
    desc: "From wholesome traditional Ragi & Dry Fruit Laddoos to royal Paan digestive shots, DUST delivers clean-label nourishment without artificial preservatives or refined sugars.",
  },
];

const storySlides = [
  {
    image: farmerWastedHarvest,
    alt: "Farmer amidst wasted harvest in India",
    tag: "Market Vulnerability & Distress Sales",
    title: "The Heartbreak in the Fields",
    caption:
      "When bumper harvests arrive without adequate cold chain or immediate market access, prices crash. Hardworking farmers are forced to watch months of labor turn into roadside waste.",
    stat: "16%+",
    statLabel: "Agricultural produce lost post-harvest in India",
  },
  {
    image: farmersHarvestLost,
    alt: "Harvest lost to lack of preservation",
    tag: "The Supply Chain Gap",
    title: "Severe Losses for Farmer Families",
    caption:
      "India loses millions of tonnes of perishable fruits and agricultural produce every year before reaching consumers, wiping out agricultural earnings and depleting precious natural resources.",
    stat: "₹15,000+ Cr",
    statLabel: "Annual seasonal produce value lost across mandis",
  },
  {
    image: farmSurplusWaste,
    alt: "From farm surplus to preventable food waste",
    tag: "The Upcycling Opportunity",
    title: "The Food Waste Paradox",
    caption:
      "While surplus crops rot in regional mandis, modern families struggle to find 100% natural, unadulterated fruit nutrition. DUST™ turns this tragic loss into shelf-stable everyday wellness.",
    stat: "Zero Waste",
    statLabel: "DUST's circular mission from farm to table",
  },
];

export const About: React.FC = () => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const currentSlide = storySlides[activeStoryIdx] || storySlides[0]!;

  // Auto-rotate hero banner images every 2.5 - 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroBanners.length);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const currentHero = heroBanners[activeHeroIdx] || heroBanners[0]!;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      {/* Brand Purpose Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
          <Sparkles className="w-4 h-4" />
          <span>OUR BRAND PURPOSE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] leading-tight">
          Building India’s Next Generation of Consumer Brands.
        </h1>

        <p className="text-sm sm:text-base text-[#1F684B] font-normal leading-relaxed">
          {companyInfo.brand} is rooted in nature and made for modern India — thoughtfully bringing together nourishing food blends, fruit-powered refreshments, everyday nutrition, and nature-inspired personal care.
        </p>

        <div className="pt-2 flex justify-center items-center gap-4">
          <Link
            to="/shop"
            className="btn-dust-orange px-6 py-3 text-white text-xs font-extrabold uppercase tracking-[0.18em] rounded-full inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all duration-300"
          >
            Explore Catalogue <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a
            href="#our-story"
            className="px-6 py-3 bg-white hover:bg-[#E8F1E9] border border-[#74B487]/50 text-[#0E382E] text-xs font-extrabold uppercase tracking-[0.18em] rounded-full inline-flex items-center gap-2 shadow-xs transition-all duration-300"
          >
            Read Our Story <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hero Visual Banner Showcase Carousel (Full 100% Image Visibility, No Cropping) */}
      <div className="mb-16 space-y-4">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#74B487]/40 bg-white shadow-xl group">
          {/* Exact 3:2 (1536x1024) Aspect Ratio Container - Zero Cropping */}
          <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#0E382E]">
            {heroBanners.map((banner, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeHeroIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-contain object-center"
                />
              </div>
            ))}

            {/* Left Arrow Control */}
            <button
              type="button"
              onClick={() => setActiveHeroIdx((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>

            {/* Right Arrow Control */}
            <button
              type="button"
              onClick={() => setActiveHeroIdx((prev) => (prev + 1) % heroBanners.length)}
              aria-label="Next slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Clean External Indicator Controls (Placed below banner so it never covers artwork) */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveHeroIdx((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="p-1.5 rounded-full hover:bg-[#E8F1E9] text-[#0E382E] transition-colors cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#74B487]/40 shadow-xs">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveHeroIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeHeroIdx === idx ? "w-8 bg-[#E67E22]" : "w-2.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
            <span className="text-xs font-black uppercase tracking-wider text-[#0E382E] ml-2 pl-2 border-l border-stone-200">
              0{activeHeroIdx + 1} / 0{heroBanners.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveHeroIdx((prev) => (prev + 1) % heroBanners.length)}
            className="p-1.5 rounded-full hover:bg-[#E8F1E9] text-[#0E382E] transition-colors cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* OUR STORY: The Problem & The Mission Section */}
      <section
        id="our-story"
        className="mb-20 bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-12 shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
              <Sparkles className="w-4 h-4" />
              <span>THE PROBLEM & OUR PURPOSE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] leading-tight">
              The Untold Crisis in Our Fields.
            </h2>
            <p className="text-base text-[#1F684B] leading-relaxed">
              Why <strong>Everest Edges Pvt. Ltd.</strong> created <strong>DUST™</strong>: turning vulnerable agricultural surplus into pure, shelf-stable nutrition for everyday life.
            </p>
          </div>

          {/* Interactive 2-Column Split: The Problem vs The Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Visual Ground Reality & Crisis */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-[#F6F5F0] rounded-3xl border border-[#74B487]/40 p-6 sm:p-7 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>The Problem We Solve</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1F684B]">
                    Image {activeStoryIdx + 1} of {storySlides.length}
                  </span>
                </div>

                {/* Main Feature Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-[#74B487]/30 bg-[#0E382E] shadow-md group">
                  <img
                    key={activeStoryIdx}
                    src={currentSlide.image}
                    alt={currentSlide.alt}
                    className="w-full h-72 sm:h-80 object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Overlay Badges */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="inline-block px-2.5 py-0.5 bg-[#E67E22] text-white text-[10px] font-black uppercase tracking-widest rounded-md">
                      {currentSlide.tag}
                    </span>
                    <h3 className="text-lg font-extrabold text-white leading-snug drop-shadow-sm">
                      {currentSlide.title}
                    </h3>
                  </div>
                </div>

                {/* Caption Description */}
                <p className="text-xs sm:text-sm text-[#1F684B] leading-relaxed font-normal">
                  {currentSlide.caption}
                </p>

                {/* Thumbnail / Selector Tabs */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#0E382E]/70 block">
                    Select Visual Case Study:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {storySlides.map((slide, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveStoryIdx(idx)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                          activeStoryIdx === idx
                            ? "bg-[#0E382E] text-white border-[#0E382E] shadow-sm ring-2 ring-[#E67E22]/50"
                            : "bg-white text-[#0E382E] border-[#74B487]/40 hover:bg-[#E8F1E9]"
                        }`}
                      >
                        <span className="block text-[9px] font-black uppercase tracking-wider opacity-75">
                          Slide 0{idx + 1}
                        </span>
                        <span className="font-extrabold line-clamp-1 text-[11px]">
                          {idx === 0 ? "Wasted Harvest" : idx === 1 ? "Farmer Loss" : "Food Waste Gap"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hard Stat Banner */}
              <div className="mt-6 pt-4 border-t border-[#74B487]/30 flex items-center justify-between bg-white/70 p-4 rounded-2xl">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#E67E22] block">
                    {currentSlide.stat}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1F684B] block">
                    {currentSlide.statLabel}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Right Column: The DUST™ Innovation & Mission */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-[#0E382E] text-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-[#74B487]/40 text-[#E8F1E9] rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                  <Leaf className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>The Everest Edges Pvt. Ltd. Mission</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Transforming Farm Surplus into Wholesome Goodness.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8F1E9] leading-relaxed font-normal">
                    In India, an abundance of fresh fruits and agricultural produce rots while consumers end up purchasing artificially flavored, heavily chemicalized snacks and drinks.
                  </p>
                  <p className="text-xs sm:text-sm text-[#E8F1E9] leading-relaxed font-normal">
                    <strong>DUST™ was created to change this story forever.</strong> We absorb seasonal surplus directly from agricultural communities at fair prices — preventing distress sales and eliminating post-harvest food waste.
                  </p>
                </div>

                {/* 3 Pillars of Transformation */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#E67E22] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        1. Guaranteed Fair Farmer Income
                      </h4>
                      <p className="text-xs text-[#E8F1E9]/80 leading-relaxed mt-0.5">
                        By creating reliable off-take for surplus yields, we protect farmers from devastating price collapses during bumper harvests.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#74B487] text-[#0E382E] flex items-center justify-center shrink-0 mt-0.5">
                      <Recycle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        2. Gentle Nutrient-Lock Dehydration
                      </h4>
                      <p className="text-xs text-[#E8F1E9]/80 leading-relaxed mt-0.5">
                        Our gentle dehydration techniques preserve 100% natural aroma, vitamins, and minerals without synthetic preservatives or additives.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 text-[#E67E22] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        3. Clean Daily Nutrition for India
                      </h4>
                      <p className="text-xs text-[#E8F1E9]/80 leading-relaxed mt-0.5">
                        Turn fresh farm produce into tear-and-pour fruit sachets, heritage Shahi Ragi laddoo mixes, and royal Paan digestive shots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-[#E67E22] font-black">
                  Zero Waste • Pure Nutrition • Farmer First
                </span>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#E67E22] transition-colors"
                >
                  View Products <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3-Step Circular Economy Infographic */}
          <div className="p-6 sm:p-8 bg-[#E8F1E9] rounded-3xl border border-[#74B487]/40 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
                HOW THE CYCLE WORKS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E382E]">
                From Orchard Surplus to Your Daily Cup
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#74B487]/30 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#0E382E] text-[#E67E22] font-black text-xs flex items-center justify-center">
                  01
                </div>
                <h4 className="text-sm font-extrabold text-[#0E382E]">
                  Surplus Produce Sourced
                </h4>
                <p className="text-xs text-[#1F684B] leading-relaxed">
                  We step in during bumper harvests to buy nutritious fruits and crops that would otherwise spoil due to logistics barriers.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#74B487]/30 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#0E382E] text-[#E67E22] font-black text-xs flex items-center justify-center">
                  02
                </div>
                <h4 className="text-sm font-extrabold text-[#0E382E]">
                  Hygienic Dehydration & Milling
                </h4>
                <p className="text-xs text-[#1F684B] leading-relaxed">
                  Moisture is gently removed, locking in authentic flavours, natural dietary fibre, and micronutrients for long shelf life.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#74B487]/30 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#0E382E] text-[#E67E22] font-black text-xs flex items-center justify-center">
                  03
                </div>
                <h4 className="text-sm font-extrabold text-[#0E382E]">
                  Everyday Consumer Formats
                </h4>
                <p className="text-xs text-[#1F684B] leading-relaxed">
                  Consumers get easy, preservative-free convenience — instant fruit refreshers, digestive shots, and authentic laddoo premixes.
                </p>
              </div>
            </div>

            {/* Visual Disclaimer Footnote */}
            <p className="text-[10px] text-stone-500 italic text-center pt-2 border-t border-[#74B487]/20">
              * Photographs, case-study visuals, and brand graphics are for representational, awareness, and educational purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Identity & Manifesto Section */}
      <section className="mb-20 bg-white rounded-3xl border border-[#74B487]/40 p-8 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          {/* Header Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
              <Sparkles className="w-4 h-4" />
              <span>DUST™ — CHOICE OF MOTHERLAND</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E]">
              Rooted in Heritage. Designed for Today.
            </h2>
            <p className="text-sm font-bold text-[#E67E22] italic tracking-wide">
              A consumer brand by Everest Edges Pvt. Ltd.
            </p>
          </div>

          {/* Narrative Paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#1F684B] text-sm leading-relaxed font-normal">
            <div className="p-6 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 space-y-2">
              <span className="text-xl block">🌾</span>
              <p>
                Rooted in India's rich food heritage and designed for modern lifestyles, <strong>DUST™</strong> is building a new generation of convenient consumer products inspired by flavour, quality and everyday needs.
              </p>
            </div>

            <div className="p-6 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 space-y-2">
              <span className="text-xl block">🥭</span>
              <p>
                Our vision is to create accessible, distinctive products across fruit-based refreshments, traditional Indian refreshments and other carefully selected FMCG categories.
              </p>
            </div>

            <div className="p-6 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 space-y-2">
              <span className="text-xl block">✨</span>
              <p>
                We believe great products begin with thoughtful ingredient selection, consistent quality and a deep understanding of Indian consumers.
              </p>
            </div>
          </div>

          {/* Vision, Mission & Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Vision */}
            <div className="p-6 bg-[#0E382E] text-white rounded-2xl border border-[#74B487]/30 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E67E22] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-wider">
                  Our Vision
                </h3>
                <p className="text-xs text-[#E8F1E9] leading-relaxed font-normal">
                  To build a trusted Indian consumer brand with the potential to reach households across India and global markets.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#E67E22] font-black pt-2 border-t border-white/10">
                Nationally Rooted • Globally Scaled
              </span>
            </div>

            {/* Mission */}
            <div className="p-6 bg-[#0E382E] text-white rounded-2xl border border-[#74B487]/30 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E67E22] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-wider">
                  Our Mission
                </h3>
                <p className="text-xs text-[#E8F1E9] leading-relaxed font-normal">
                  To bring flavour, convenience and thoughtful product innovation into everyday life.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#E67E22] font-black pt-2 border-t border-white/10">
                Flavour • Convenience • Quality
              </span>
            </div>

            {/* Values */}
            <div className="p-6 bg-[#0E382E] text-white rounded-2xl border border-[#74B487]/30 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-[#E67E22] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-wider">
                  Our Values
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Quality", "Innovation", "Trust", "Convenience", "Indian Roots"].map((val, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white/10 hover:bg-[#E67E22] border border-white/15 rounded-lg text-[11px] font-extrabold tracking-wide transition-colors"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#E67E22] font-black pt-2 border-t border-white/10">
                5 Guiding Principles
              </span>
            </div>
          </div>

          {/* Concluding Quote Banner */}
          <div className="p-4 bg-[#E8F1E9] border-2 border-[#E67E22]/50 rounded-2xl text-center shadow-xs">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#0E382E]">
              <span className="text-[#E67E22]">✦</span> Building India's next generation of consumer brands. <span className="text-[#E67E22]">✦</span>
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <div className="mb-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            THE DUST FORMULA
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E]">
            Our Core Proposition
          </h2>
          <p className="text-sm text-[#1F684B]">
            Every sachet we craft rests on four non-negotiable promises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/30 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E9] text-[#E67E22] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0E382E]">Indian Taste</h3>
            <p className="text-xs text-[#1F684B] leading-relaxed">
              Authentic nostalgic flavours from traditional Shahi Ragi Laddoo Mix to royal Paan Digestive Shot, crafted with regional Indian wholesome recipes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/30 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E9] text-[#E67E22] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0E382E]">Convenience</h3>
            <p className="text-xs text-[#1F684B] leading-relaxed">
              Tear-and-pour sachet formats designed for modern on-the-go lifestyles. Just add chilled water for instant refreshers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/30 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E9] text-[#E67E22] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0E382E]">Transparency</h3>
            <p className="text-xs text-[#1F684B] leading-relaxed">
              Zero synthetic dyes, zero artificial preservatives. Real fruit extracts and clean-label ingredient honesty.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/30 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E9] text-[#E67E22] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0E382E]">Accessible Price</h3>
            <p className="text-xs text-[#1F684B] leading-relaxed">
              Premium quality FMCG consumer products priced fairly so every Indian household can enjoy daily wholesome nutrition.
            </p>
          </div>
        </div>
      </div>

      {/* MEET THE FOUNDER — Chetan Shelar */}
      <section className="mb-20 bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#74B487]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Portrait Photo with Trust Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#74B487]/50 bg-[#0E382E] shadow-xl group">
                <img
                  src={chetanShelarImg}
                  alt="Mr. Chetan Shelar - Founder, DUST & Everest Edges Pvt. Ltd."
                  className="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E382E]/90 via-transparent to-transparent pointer-events-none" />

                {/* Floating Bottom Card Over Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#74B487]/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-[#0E382E] tracking-tight">
                        Mr. Chetan Shelar
                      </h4>
                      <p className="text-[11px] font-extrabold text-[#E67E22] uppercase tracking-wider">
                        Founder & Authorized Person
                      </p>
                      <p className="text-[10px] text-stone-500 font-semibold">
                        DUST™ • Everest Edges Pvt. Ltd.
                      </p>
                    </div>
                    <span className="w-9 h-9 rounded-xl bg-[#0E382E] text-[#E67E22] flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Authorized Signatory Pill */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-[11px] font-black uppercase tracking-wider text-[#0E382E]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Founder & Authorized Signatory</span>
              </div>
            </div>

            {/* Right Column: Founder Narrative & Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
                  <Sparkles className="w-4 h-4" />
                  <span>LEADERSHIP & VISION</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] leading-tight tracking-tight">
                  Meet the Founder — Chetan Shelar
                </h2>

                <p className="text-xs sm:text-sm font-extrabold text-[#E67E22] uppercase tracking-wider">
                  Founder, DUST™ | Everest Edges Pvt. Ltd.
                </p>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#0E382E] pt-1">
                  Building a Healthier Future, Inspired by Nature
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#1F684B] leading-relaxed font-normal">
                <p>
                  <strong>Chetan Shelar</strong> is an entrepreneur driven by a vision to bring nature-inspired, thoughtfully crafted products into everyday life. As the founder behind <strong>DUST™</strong>, he believes that everyday essentials should combine simplicity, quality, convenience and a deep respect for nature.
                </p>
                <p>
                  With a focus on traditional Indian ingredients and modern consumer needs, Chetan is building DUST™ as a brand that brings together natural food innovations and personal care products. From fruit-based beverage powders and traditional Indian formulations to herbal hair care and skincare, his goal is to make nature-inspired choices more accessible to modern consumers.
                </p>
              </div>

              {/* Core Philosophy Quote Callout */}
              <div className="p-5 bg-[#0E382E] text-white rounded-2xl border-2 border-[#E67E22]/60 shadow-md relative overflow-hidden space-y-2">
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-[#E67E22] shrink-0 rotate-180 opacity-80" />
                  <p className="text-xs sm:text-sm font-bold text-[#E8F1E9] italic leading-relaxed">
                    "The best ideas often come from our roots, and innovation gives them a place in the future."
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#E67E22] font-black">
                    — Chetan Shelar, Founder
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#1F684B] leading-relaxed font-normal">
                <p>
                  Through <strong>Everest Edges Pvt. Ltd.</strong>, Chetan aims to develop products that celebrate India's rich ingredient heritage while meeting the expectations of today's consumers for quality, convenience and thoughtful product design.
                </p>
                <p className="italic font-medium text-[#0E382E]">
                  His vision is to build DUST™ into a trusted Indian brand, proudly inspired by nature and created for everyday living.
                </p>
              </div>

              {/* Tagline Motto Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-[#74B487]/30">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E67E22]">
                  DUST™ — CHOICE OF MOTHERLAND
                </span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  Everest Edges Pvt. Ltd.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP & NATION-BUILDING VISION — Mrunalini Shelar */}
      <section className="mb-20 bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#74B487]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Vision, Mission & Nation Building */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
                  <Sparkles className="w-4 h-4" />
                  <span>LEADERSHIP VISION • ATMANIRBHAR BHARAT 🇮🇳</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E] leading-tight">
                  Building for India. Innovating for the World.
                </h2>
                <h3 className="text-base sm:text-lg font-bold text-[#1F684B]">
                  Mrunalini Shelar — <em>Everest Edges Pvt. Ltd.</em>
                </h3>
              </div>

              {/* Core Quote Box */}
              <div className="p-6 bg-[#0E382E] text-white rounded-2xl border-2 border-[#E67E22]/60 shadow-md relative overflow-hidden space-y-3">
                <div className="flex items-start gap-3.5">
                  <Quote className="w-7 h-7 text-[#E67E22] shrink-0 rotate-180 opacity-90 mt-0.5" />
                  <p className="text-sm sm:text-base font-bold text-white italic leading-relaxed">
                    "At Everest Edges, we believe true independence is also about building in India, innovating in India, and creating products for India and the world." 🇮🇳
                  </p>
                </div>
              </div>

              {/* Mission Narrative */}
              <div className="space-y-4 text-xs sm:text-sm text-[#1F684B] leading-relaxed font-normal">
                <p>
                  Our vision is to contribute to a <strong>self-reliant India</strong> by bringing innovative Indian food products to consumers everywhere and creating opportunities across the Indian food ecosystem.
                </p>
                <p>
                  By connecting regional agricultural abundance with modern consumer convenience, we strive to build transparent, clean-label essentials that every household can trust and take pride in.
                </p>
              </div>

              {/* Tagline Callout Banner */}
              <div className="p-4 bg-[#E8F1E9] border-2 border-[#74B487]/40 rounded-2xl shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌱</span>
                  <span className="text-xs sm:text-sm font-black text-[#0E382E] tracking-wide">
                    From Indian ideas to Indian products — and from India to the world. 🌱🇮🇳
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-[#74B487]/30">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E67E22]">
                  EVEREST EDGES PVT. LTD.
                </span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  Mrunalini Shelar
                </span>
              </div>
            </div>

            {/* Right Column: Portrait Photo */}
            <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#74B487]/50 bg-[#0E382E] shadow-xl group">
                <img
                  src={mrunalPhotoImg}
                  alt="Mrunalini Shelar - Everest Edges Pvt. Ltd."
                  className="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                {/* Overlaid Title Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-center space-y-1">
                  <span className="inline-block px-3 py-1 bg-[#E67E22] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                    Everest Edges Pvt. Ltd.
                  </span>
                  <h4 className="text-lg font-extrabold text-white">
                    Mrunalini Shelar
                  </h4>
                  <p className="text-[11px] text-[#E8F1E9] font-medium">
                    Building in India • Innovating in India 🇮🇳
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story & Vision Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#74B487]/40 shadow-sm mb-20">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            THE DUST VISION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E] leading-tight">
            Originated in India. Scaled for the World.
          </h2>
          <p className="text-sm text-[#1F684B] leading-relaxed font-normal">
            {companyInfo.brand} is parented by <strong>{companyInfo.name}</strong>. Our vision goes beyond a single product category. Starting with Wholesome Laddoo premix mixes, convenient fruit powders, and heritage digestive shots, we are building a broad portfolio of Indian consumer products.
          </p>
          <p className="text-sm text-[#1F684B] leading-relaxed font-normal">
            We believe traditional Indian culinary and wellness wisdom holds global appeal when paired with modern hygienic packaging discipline.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <div className="p-3 bg-[#E8F1E9] rounded-2xl text-[#E67E22]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#0E382E] uppercase tracking-wider">
                {companyInfo.tagline}
              </p>
              <p className="text-[11px] text-[#74B487] font-semibold">
                CIN: {companyInfo.cin} • DPIIT: {companyInfo.dipp}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#0E382E] text-white p-8 sm:p-10 rounded-3xl space-y-6 border border-[#74B487]/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#74B487]/30 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E67E22] font-extrabold block">
                ROADMAP & CATEGORIES
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Future Portfolio Expansion
              </h3>
            </div>
            <span className="px-3 py-1 bg-[#1F684B] border border-[#74B487]/40 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#E8F1E9]">
              5 Product Lines
            </span>
          </div>

          <div className="space-y-3">
            {[
              { num: "01", title: "Traditional Foods & Nutrition", status: "Active Launch" },
              { num: "02", title: "Beverages & Refreshments", status: "Active Pipeline" },
              { num: "03", title: "Heritage Flavours & Digestives", status: "Active Launch" },
              { num: "04", title: "Herbal Infusions", status: "Coming Soon" },
              { num: "05", title: "Personal Care", status: "Future Extension" },
            ].map((line, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-[#1F684B]/60 hover:bg-[#1F684B] rounded-2xl border border-[#74B487]/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-xl bg-[#E67E22] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {line.num}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                    {line.title}
                  </span>
                </div>
                <span
                  className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full ${
                    line.status === "Active Launch"
                      ? "bg-[#74B487]/20 text-[#74B487] border border-[#74B487]/40"
                      : line.status === "Future Extension"
                      ? "bg-amber-500/20 text-[#E67E22] border border-[#E67E22]/40"
                      : "bg-white/10 text-[#E8F1E9] border border-white/20"
                  }`}
                >
                  {line.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center border-t border-[#74B487]/20">
            <p className="text-[11px] text-[#E8F1E9] italic font-medium">
              "Building India's next generation of consumer brands."
            </p>
          </div>
        </div>
      </div>

      {/* GOVERNMENT OF INDIA RECOGNITION & TRUST: Startup India / DPIIT Certificate */}
      <section className="mb-20 bg-white rounded-3xl border border-[#74B487]/40 p-6 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#74B487]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F1E9] border border-[#74B487]/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#E67E22]">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL GOVERNMENT RECOGNITION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] leading-tight">
              Certified & Recognized by DPIIT
            </h2>
            <p className="text-sm sm:text-base text-[#1F684B] leading-relaxed">
              <strong>Everest Edges Private Limited</strong> is officially recognized as an innovative startup by the <strong>Department for Promotion of Industry and Internal Trade (DPIIT)</strong>, Ministry of Commerce & Industry, Government of India.
            </p>
          </div>

          {/* Certificate Showcase Card: Document Preview + Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F6F5F0] rounded-3xl border border-[#74B487]/40 p-6 sm:p-8 shadow-xs">
            {/* Left: Certificate Preview Document Frame */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              <a
                href="/startup-india-certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#74B487]/50 bg-white shadow-xl hover:shadow-2xl hover:border-[#E67E22] transition-all duration-300"
              >
                <img
                  src={startupIndiaCertificateImg}
                  alt="DPIIT Certificate of Recognition - Everest Edges Private Limited"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xs">
                  <ExternalLink className="w-5 h-5 text-[#E67E22]" />
                  <span>Click to View Full PDF</span>
                </div>
              </a>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <a
                  href="/startup-india-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#0E382E] hover:bg-[#1F684B] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-sm transition-all hover:scale-105"
                >
                  <FileText className="w-4 h-4 text-[#E67E22]" /> View Certificate (PDF)
                </a>
                <a
                  href="/startup-india-certificate.pdf"
                  download="DPIIT_Everest_Edges_Certificate_DIPP284597.pdf"
                  className="px-5 py-2.5 bg-white hover:bg-[#E8F1E9] border border-[#74B487]/50 text-[#0E382E] text-xs font-extrabold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-xs transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4 text-[#E67E22]" /> Download
                </a>
              </div>
            </div>

            {/* Right: Official Trust Badges & Certificate Data */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E382E] text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-xs">
                  <Award className="w-4 h-4 text-[#E67E22]" />
                  <span>Certificate No: {companyInfo.dipp}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0E382E]">
                  Certificate of Recognition
                </h3>
                <p className="text-xs text-[#1F684B] font-semibold leading-relaxed">
                  Ministry of Commerce & Industry • Department for Promotion of Industry and Internal Trade (DPIIT) • Government of India
                </p>
              </div>

              {/* Verification Details Table / Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-[#74B487]/30 space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider font-black text-[#E67E22] block">
                    Recognized Entity
                  </span>
                  <p className="text-xs font-extrabold text-[#0E382E]">
                    EVEREST EDGES PRIVATE LIMITED
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    CIN: {companyInfo.cin}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#74B487]/30 space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider font-black text-[#E67E22] block">
                    Industry & Sector
                  </span>
                  <p className="text-xs font-extrabold text-[#0E382E]">
                    Food & Beverages
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    Sector: Food Processing
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#74B487]/30 space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider font-black text-[#E67E22] block">
                    Issue Date
                  </span>
                  <p className="text-xs font-extrabold text-[#0E382E]">
                    22-09-2026
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    Incorporated: 04-08-2026
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#74B487]/30 space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider font-black text-[#E67E22] block">
                    Validity
                  </span>
                  <p className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid Upto 03-08-2036
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    10-Year Government Startup Recognition
                  </span>
                </div>
              </div>

              {/* Trust statement */}
              <div className="p-4 bg-[#0E382E] text-white rounded-2xl border border-[#74B487]/30 flex items-start gap-3.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#E67E22] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Verified for National Trust & Innovation
                  </h4>
                  <p className="text-[11px] text-[#E8F1E9] leading-relaxed font-normal">
                    This official recognition validates our mission of pioneering food processing, upcycling agricultural harvests, and bringing pure, wholesome nutrition to Indian households.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS DUST FOR — Target Audience Section */}
      <div className="mb-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold">
            OUR CUSTOMERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E]">
            Who Is DUST Made For?
          </h2>
          <p className="text-sm text-[#1F684B]">
            DUST is built for people who care about what goes into their body — without wanting to compromise on taste, time, or budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <HeartHandshake className="w-7 h-7" />,
              title: "Health-Conscious Consumers",
              desc: "Individuals actively prioritizing natural ingredients, clean labels, and wellness in their everyday choices.",
              badge: "Primary Audience",
            },
            {
              icon: <Briefcase className="w-7 h-7" />,
              title: "Families & Working Professionals",
              desc: "Busy people seeking convenient, quick solutions for daily nutrition without sacrificing quality.",
              badge: "Core Market",
            },
            {
              icon: <BookOpen className="w-7 h-7" />,
              title: "Students",
              desc: "Looking for affordable, easy-to-prepare nutritious options that fit a fast-paced student lifestyle.",
              badge: "Growing Segment",
            },
            {
              icon: <ShoppingBag className="w-7 h-7" />,
              title: "Retailers & Distributors",
              desc: "Business partners looking to expand their portfolio with a trusted, fast-growing Indian consumer brand.",
              badge: "B2B Partners",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-[#74B487]/40 shadow-xs space-y-4 hover:border-[#E67E22] hover:shadow-md transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1E9] text-[#E67E22] flex items-center justify-center group-hover:bg-[#E67E22] group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#E67E22] bg-[#E8F1E9] px-2.5 py-0.5 rounded-full inline-block">
                  {item.badge}
                </span>
                <h3 className="text-base font-extrabold text-[#0E382E] leading-tight">{item.title}</h3>
                <p className="text-xs text-[#1F684B] leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-[#0E382E] rounded-2xl border border-[#74B487]/30 text-center shadow-md">
          <p className="text-sm font-extrabold text-white tracking-wide">
            <span className="text-[#E67E22]">✦</span>&nbsp; NOT MADE FOR EVERYONE — MADE FOR THOSE WHO CHOOSE BETTER &nbsp;<span className="text-[#E67E22]">✦</span>
          </p>
        </div>
      </div>
    </div>
  );
};
