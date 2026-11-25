import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
    }, 5500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner: UpcomingBanner = (banners[activeIndex] ?? banners[0]) as UpcomingBanner;

  const isVideoMedia = (url?: string) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)($|\?)/i.test(url) || url.startsWith("data:video");
  };

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-8 md:px-12 lg:px-16 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 border-b border-[#74B487]/40 pb-4 sm:pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" /> IN THE PIPELINE • COMING SOON
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0E382E] mt-1">
            Upcoming Product Launches
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#1F684B] max-w-md mt-2 md:mt-0 font-normal">
          A sneak peek into our next-generation 100% natural heritage innovations crafted for everyday modern living.
        </p>
      </div>

      {/* Full-Size Panoramic Banner Container */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-[#74B487]/40 shadow-2xl bg-[#1a0518] transition-all duration-300">
        <Link
          to={currentBanner.cta_link || "/contact"}
          className="block relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden cursor-pointer"
          title={currentBanner.title}
        >
          {isVideoMedia(currentBanner.image_url) ? (
            <video
              src={currentBanner.image_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          ) : (
            <img
              src={currentBanner.image_url}
              alt={currentBanner.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/banners/dragon-berry-blast-upcoming.jpg";
              }}
              className="w-full h-full object-cover sm:object-fill transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          )}

          {/* Interactive Hover Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Carousel Controls (when multiple banners exist) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              aria-label="Previous banner"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % banners.length)}
              aria-label="Next banner"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? "w-6 bg-[#E67E22]" : "w-2 bg-white/40 hover:bg-white/80"
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
