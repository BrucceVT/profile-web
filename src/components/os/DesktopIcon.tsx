// Desktop Icon - with selection state support and multi-line labels

import React from "react";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  icon,
  isSelected,
  onSelect,
  onOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(id);
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-start w-28 gap-1.5 p-2 cursor-pointer
        transition-all duration-100
        ${isSelected ? "bg-mac-blue/20 rounded" : ""}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center">
        <span className="text-5xl drop-shadow-md select-none">{icon}</span>
      </div>

      {/* Label - allows 2 lines, no truncation */}
      <span
        className={`
          font-retro text-base px-2 py-1 text-center select-none border
          w-full leading-tight
          ${isSelected
            ? "bg-mac-blue text-white border-mac-blue"
            : "bg-white/90 text-black border-black shadow-[1px_1px_0px_black]"
          }
        `}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2em",
          wordBreak: "break-word",
        }}
      >
        {label}
      </span>
    </div>
  );
};
