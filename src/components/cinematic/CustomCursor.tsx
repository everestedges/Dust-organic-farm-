import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let rafId = 0;
    let latestEvent: MouseEvent | null = null;

    const onMouseMove = (e: MouseEvent) => {
      latestEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (latestEvent) {
            setPosition({ x: latestEvent.clientX, y: latestEvent.clientY });
            setIsVisible(true);

            const target = latestEvent.target as HTMLElement | null;
            if (target) {
              const clickable = target.closest("[data-cursor]");
              if (clickable) {
                const text = clickable.getAttribute("data-cursor") || "VIEW";
                setCursorText(text);
                setIsHovered(true);
              } else if (target.closest("button, a, input, select")) {
                setCursorText("");
                setIsHovered(true);
              } else {
                setCursorText("");
                setIsHovered(false);
              }
            }
          }
          rafId = 0;
        });
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[100] transition-opacity duration-300 hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out ${
          isHovered
            ? cursorText
              ? "h-14 w-14 bg-emerald-600 text-white font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-emerald-600/30"
              : "h-8 w-8 bg-emerald-900/10 backdrop-blur-sm border border-emerald-600/40"
            : "h-3 w-3 bg-emerald-700"
        }`}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>
    </div>
  );
};
