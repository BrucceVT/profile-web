// Trash Window - Empty trash display

import React from "react";

export const TrashWindow: React.FC = () => {
  return (
    <div className="p-6 font-retro text-lg bg-white h-full flex flex-col items-center justify-center gap-4">
      <div className="text-6xl mb-2">🗑️</div>
      <p className="text-center text-gray-600">Trash is empty</p>
      <p className="text-xs text-gray-400">0 items</p>
    </div>
  );
};
