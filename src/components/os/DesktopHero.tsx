// DesktopHero - Wallpaper-style hero banner with CTA and retro panel

import React from "react";
import { useI18n } from "@/i18n";
import { useWindowManager } from "@/context/WindowManager";

export const DesktopHero: React.FC = () => {
  const { t } = useI18n();
  const { openWindow } = useWindowManager();

  // Handle CTA button click - opens Contact window
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWindow("contact", t.windows.contact);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      style={{ paddingTop: "48px", paddingBottom: "64px" }}
    >
      {/* Semi-transparent panel for readability - retro style */}
      <div
        className="text-center px-8 py-6 max-w-2xl mx-4 bg-black/40 border-2 border-white/30 rounded-sm"
        style={{
          backdropFilter: "blur(3px)",
          boxShadow: "inset 1px 1px 0px rgba(255,255,255,0.2), 2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {/* Name */}
        <h1
          className="font-retro text-white mb-2 tracking-wider uppercase"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
            textShadow: "2px 2px 0px rgba(0,0,0,0.8)",
            lineHeight: 1.1,
          }}
        >
          {t.profile.name}
        </h1>

        {/* Title / Role */}
        <h2
          className="font-retro text-mac-gray mb-3 tracking-wide"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            textShadow: "1px 1px 0px rgba(0,0,0,0.6)",
          }}
        >
          {t.profile.title}
        </h2>

        {/* Headline / Value Proposition */}
        <p
          className="font-retro text-white/90 max-w-lg mx-auto leading-relaxed mb-4"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            textShadow: "1px 1px 0px rgba(0,0,0,0.4)",
          }}
        >
          {t.profile.headline}
        </p>

        {/* Decorative Tech Stack */}
        <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-sm mb-5">
          <span className="font-retro text-white/80 text-base">
            {t.profile.tagline}
          </span>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-700/80 border border-green-500 rounded-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="font-retro text-white text-sm sm:text-base">
              {t.hero.ctaStatus}
            </span>
          </div>

          {/* Contact Me Button - Retro style */}
          <button
            onClick={handleContactClick}
            className="px-5 py-2 font-retro text-base sm:text-lg font-bold bg-mac-gray border-2 border-black text-black hover:bg-white active:bg-mac-blue active:text-white transition-colors retro-border-outset active:retro-border-inset"
          >
            {t.hero.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
};
