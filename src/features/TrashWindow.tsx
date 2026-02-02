// Trash Window - Empty trash display

import React from "react";
import { useI18n } from "@/i18n";

export const TrashWindow: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="p-6 font-retro text-lg bg-white h-full flex flex-col items-center justify-center gap-4">
      <div className="text-6xl mb-2">🗑️</div>
      <p className="text-center text-gray-600">{t.trashWindow.empty}</p>
      <p className="text-sm text-gray-400">0 {t.trashWindow.items}</p>
    </div>
  );
};
