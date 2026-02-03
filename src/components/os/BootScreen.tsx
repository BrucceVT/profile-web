// BootScreen - Mac-style startup animation with branding

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n";

interface BootScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  onComplete,
  duration = 2200,
}) => {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Skip boot animation
  const handleSkip = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, prefersReducedMotion ? 0 : 400);
  }, [onComplete, prefersReducedMotion]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Progress bar animation with easing
  useEffect(() => {
    if (prefersReducedMotion) {
      setTimeout(onComplete, 300);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease-out curve for more natural feel
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(Math.round(easedProgress * 100));

      if (rawProgress >= 1) {
        clearInterval(interval);
        setTimeout(handleSkip, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, handleSkip, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0d2833 0%, #1a4052 50%, #0f2d3d 100%)",
          }}
          onClick={handleSkip}
        >
          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Logo / Initials */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6"
          >
            <div
              className="w-24 h-24 rounded-lg flex items-center justify-center border-2 border-white/20"
              style={{
                background: "linear-gradient(135deg, #2d6b7a 0%, #1a4a5e 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <span className="font-retro text-white text-5xl font-bold tracking-tight">
                BV
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-retro text-white text-3xl sm:text-4xl mb-1 tracking-wider"
          >
            {t.boot.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="font-retro text-white/60 text-lg sm:text-xl mb-10"
          >
            {t.boot.subtitle}
          </motion.p>

          {/* Progress Bar Container */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-64 sm:w-72 h-6 bg-black/40 border-2 border-white/20 rounded-sm overflow-hidden"
            style={{
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Progress Fill */}
            <motion.div
              className="h-full rounded-sm"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #3d8b9e 0%, #5ab3c7 50%, #3d8b9e 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 8px rgba(90,179,199,0.3)",
              }}
            />
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 }}
            className="font-retro text-white/70 text-base mt-4"
          >
            {progress < 100 ? t.boot.loading : t.boot.starting}
          </motion.p>

          {/* Skip Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            className="font-retro text-white/40 text-sm mt-8 absolute bottom-8"
          >
            {t.boot.skipHint}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
