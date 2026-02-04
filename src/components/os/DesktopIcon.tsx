// Desktop Icon - with selection state support, multi-line labels, and retro PNG icons

import React from "react";

// Icon source mapping for desktop icons (from tstamborski/pixelart-icons CC0)
export const DESKTOP_ICON_SOURCES: Record<string, string> = {
  about: "/icons/about.png",
  projects: "/icons/projects.png",
  skills: "/icons/skills.png",
  trash: "/icons/trash.png",
  contact: "/icons/contact.png",
  welcome: "/icons/welcome.png",
};

interface DesktopIconProps {
  id: string;
  label: string;
  iconSrc?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  iconSrc,
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

  // Resolve icon source from id if not provided
  const resolvedIconSrc = iconSrc || DESKTOP_ICON_SOURCES[id] || "/icons/welcome.png";

  return (
    <div
      className={`
        flex flex-col items-center justify-start w-28 gap-1.5 p-2 cursor-pointer
        transition-all duration-100
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      aria-label={`${label} icon`}
      tabIndex={0}
    >
      {/* Retro PNG Icon */}
      <div 
        className="w-14 h-14 flex items-center justify-center"
      >
        <img
          src={resolvedIconSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          width={48}
          height={48}
          className={`
            transition-transform duration-100
            hover:scale-105
          `}
          style={{
            imageRendering: "pixelated",
          }}
        />
        <span className="sr-only">{label}</span>
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
