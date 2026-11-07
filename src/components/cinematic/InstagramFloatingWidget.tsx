import React from "react";
import { Instagram } from "lucide-react";

export const InstagramFloatingWidget: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/dust_officials/";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 print:hidden">
      {/* Floating Instagram Button 1: Follow Badge */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow @dust_officials on Instagram"
        className="group flex items-center bg-white/95 backdrop-blur-md text-[#0E382E] pl-2.5 pr-3.5 py-1.5 rounded-full shadow-xl border border-[#74B487]/40 hover:border-[#E67E22] hover:shadow-2xl transition-all duration-300 hover:scale-105"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Instagram className="w-3.5 h-3.5" />
        </div>
        <span className="ml-2 text-[11px] font-black uppercase tracking-wider text-[#0E382E] group-hover:text-[#E67E22] transition-colors">
          @dust_officials
        </span>
      </a>

      {/* Floating Instagram Button 2: Floating Action Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit DUST Instagram Profile"
        className="group relative flex items-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 hover:shadow-pink-500/40 transition-all duration-300 cursor-pointer"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <Instagram className="w-6 h-6 stroke-[2]" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 ease-in-out">
          Follow on Instagram
        </span>
      </a>
    </div>
  );
};

