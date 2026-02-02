// DesktopHero - Wallpaper-style hero banner with CTA

import React from "react";
import { useI18n } from "@/i18n";
import { useWindowManager } from "@/context/WindowManager";

export const DesktopHero: React.FC = () => {
  const { t } = useI18n();
  const { openWindow } = useWindowManager();

  // Handle CTA button click - opens Contact window
  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWindow("contact", t.windows.contact, { x: 200, y: 140 });
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      style={{ paddingTop: "36px", paddingBottom: "56px" }}
    >
      <div className="text-center px-4 max-w-2xl">
        {/* Name */}
        <h1
          className="font-retro text-white mb-2 tracking-wider uppercase"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            textShadow: "3px 3px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(0,0,0,0.5)",
            lineHeight: 1.1,
          }}
        >
          {t.profile.name}
        </h1>

        {/* Title / Role */}
        <h2
          className="font-retro text-mac-gray mb-4 tracking-wide"
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            textShadow: "2px 2px 0px rgba(0,0,0,0.6)",
          }}
        >
          {t.profile.title}
        </h2>

        {/* Headline / Value Proposition */}
        <p
          className="font-retro text-white/90 max-w-xl mx-auto leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            textShadow: "1px 1px 0px rgba(0,0,0,0.5)",
          }}
        >
          {t.profile.headline}
        </p>

        {/* Decorative Tech Stack */}
        <div
          className="mt-4 inline-flex gap-2 px-4 py-2 bg-black/30 border border-white/20 rounded"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <span className="font-retro text-white/80 text-lg">
            {t.profile.tagline}
          </span>
        </div>

        {/* CTA Section */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/80 border border-green-400 rounded-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="font-retro text-white text-base">
              {t.hero.ctaStatus}
            </span>
          </div>

          {/* Hire Me Button - Retro style */}
          <button
            onClick={handleHireClick}
            className="px-5 py-2 font-retro text-lg font-bold bg-mac-gray border-2 border-black text-black hover:bg-white active:bg-mac-blue active:text-white transition-colors retro-border-outset active:retro-border-inset"
          >
            {t.hero.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
};
