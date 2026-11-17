import React from "react";
import { companyInfo } from "@/lib/data";

export const WhatsAppWidget: React.FC = () => {
  return (
    <a
      href={companyInfo.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-30 flex items-center bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:pr-5 transition-all duration-300 group print:hidden"
      aria-label="Chat on WhatsApp"
      data-cursor="CHAT"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          className="w-6 h-6 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.16 4.237 4.298-1.128zm10.75-6.52c-.328-.164-1.944-.96-2.247-1.07-.302-.11-.522-.164-.741.164-.219.328-.849 1.07-1.041 1.289-.192.219-.384.246-.712.082s-1.385-.51-2.639-1.628c-.976-.87-1.636-1.944-1.828-2.272-.192-.328-.02-.505.144-.668.148-.147.328-.384.493-.576.164-.192.219-.384.328-.548.11-.219.055-.411-.027-.576-.082-.164-.741-1.785-1.015-2.441-.267-.639-.539-.553-.741-.564-.192-.01-.411-.012-.63-.012s-.576.082-.877.411c-.301.328-1.151 1.124-1.151 2.742 0 1.618 1.178 3.181 1.343 3.4.164.219 2.318 3.54 5.617 4.964.785.339 1.398.542 1.875.694.788.251 1.505.215 2.072.13.633-.095 1.944-.795 2.218-1.562.274-.767.274-1.425.192-1.562-.082-.138-.302-.22-.63-.384z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </div>
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 ease-in-out">
        Need Help? Chat with Us
      </span>
    </a>
  );
};
