// Desktop Icon - with selection state support

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
        flex flex-col items-center justify-center w-20 gap-1 p-2 cursor-pointer
        transition-all duration-100
        ${isSelected ? "bg-mac-blue/20 rounded" : ""}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center mb-1">
        <span className="text-4xl drop-shadow-md select-none">{icon}</span>
      </div>

      {/* Label */}
      <span
        className={`
          font-retro text-sm px-1 text-center select-none border
          max-w-[72px] truncate
          ${isSelected
            ? "bg-mac-blue text-white border-mac-blue"
            : "bg-white/90 text-black border-black shadow-[1px_1px_0px_black]"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
};
