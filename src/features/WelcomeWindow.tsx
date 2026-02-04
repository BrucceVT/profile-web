// Welcome Window - Profile card as a draggable window

import React from "react";
import { MapPin, Mail } from "lucide-react";
import { useI18n } from "@/i18n";
import { useWindowManager } from "@/context/WindowManager";

export const WelcomeWindow: React.FC = () => {
  const { t } = useI18n();
  const { openWindow, windows, focusWindow, restoreWindow } = useWindowManager();

  // Handle CTA button click - opens or focuses Contact window
  const handleContactClick = () => {
    const contactWindow = windows.find((w) => w.id === "contact");
    
    if (contactWindow?.isOpen) {
      if (contactWindow.isMinimized) {
        restoreWindow("contact");
      } else {
        focusWindow("contact");
      }
    } else {
      openWindow("contact", t.windows.contact);
    }
  };

  return (
    <div className="p-5 font-retro bg-gradient-to-b from-white to-gray-50">
      {/* Header with Icon */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-mac-gray border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_black]">
          <span className="text-4xl">👨‍💻</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-wide uppercase leading-tight mb-1">
            {t.profile.name}
          </h1>
          <h2 className="text-lg text-gray-700 mb-1">
            {t.profile.title}
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} />
            <span>Arequipa, Perú</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-300 my-4" />

      {/* Tagline */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-mac-gray border border-black text-sm font-bold">
          {t.profile.tagline}
        </span>
      </div>

      {/* Headline */}
      <p className="text-base text-center text-gray-700 leading-relaxed mb-4 px-2">
        {t.profile.headline}
      </p>

      {/* CTA Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {/* Availability Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-600 rounded-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-800">{t.hero.ctaStatus}</span>
        </div>

        {/* Contact Button */}
        <button
          onClick={handleContactClick}
          className="px-5 py-2 font-bold bg-mac-blue text-white border-2 border-black hover:bg-blue-800 active:bg-black transition-colors retro-border-outset active:retro-border-inset"
        >
          {t.hero.ctaButton}
        </button>
      </div>

      {/* Quick Contact */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <a 
          href="mailto:bvillena2000@gmail.com"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black hover:underline"
        >
          <Mail size={14} />
          bvillena2000@gmail.com
        </a>
      </div>
    </div>
  );
};
