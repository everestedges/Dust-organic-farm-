import React, { useEffect, useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useUpcomingBannersStore, UpcomingBanner } from "@/lib/upcoming-banners-store";

export const UpcomingProductBanner: React.FC = () => {
  const { banners, fetchBanners, isLoading } = useUpcomingBannersStore();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Auto-rotate if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner: UpcomingBanner = (banners[activeIndex] ?? banners[0]) as UpcomingBanner;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-16 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#74B487]/40 pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" /> IN THE PIPELINE • COMING SOON
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E382E] mt-1">
            Upcoming Product Launches
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#1F684B] max-w-md mt-2 md:mt-0 font-normal">
          A sneak peek into our next-generation 100% natural heritage innovations crafted for everyday modern living.
        </p>
      </div>

      {/* Main Banner Showcase */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-[#74B487]/50 bg-gradient-to-br from-[#0E382E] via-[#124237] to-[#0E382E] text-white shadow-2xl">
        {/* Ambient Warm Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E67E22]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#74B487]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-white/95 border-2 border-white/20 shadow-xl group-hover:scale-[1.01] transition-transform duration-500">
              <img
                src={currentBanner.image_url}
                alt={currentBanner.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge overlay on image */}
              <div className="absolute top-3 left-3 bg-[#0E382E]/90 backdrop-blur-md text-[#E67E22] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#E67E22]/40 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-ping" />
                {currentBanner.tagline || "COMING SOON"}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Details & Teaser */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[11px] font-bold text-[#E8F1E9]">
              <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{currentBanner.launch_date || "Launching Soon"}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F6F5F0] leading-tight tracking-tight">
              {currentBanner.title}
            </h3>

            {currentBanner.subtitle && (
              <p className="text-sm sm:text-base font-semibold text-[#E67E22]">
                {currentBanner.subtitle}
              </p>
            )}

            {currentBanner.description && (
              <p className="text-xs sm:text-sm text-[#E8F1E9]/80 leading-relaxed font-normal">
                {currentBanner.description}
              </p>
            )}


          </div>
        </div>

        {/* Carousel Controls (if multiple banners) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % banners.length)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? "w-6 bg-[#E67E22]" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
