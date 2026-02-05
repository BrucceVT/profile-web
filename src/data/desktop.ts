// Desktop configuration - Icons and window registry

// Desktop icon configuration
export interface DesktopIconConfig {
  id: string;
  label: string;
  icon: string;
  windowId: string;
}

export const desktopIcons: DesktopIconConfig[] = [
  { id: "about", label: "About Me", icon: "👨‍💻", windowId: "about" },
  { id: "projects", label: "Projects", icon: "📂", windowId: "projects" },
  { id: "skills", label: "Skills", icon: "🛠️", windowId: "skills" },
  { id: "contact", label: "Contact", icon: "☎️", windowId: "contact" },
  { id: "browser", label: "Browser", icon: "🌐", windowId: "browser" },
];

export const trashIcon: DesktopIconConfig = {
  id: "trash",
  label: "Trash",
  icon: "🗑️",
  windowId: "trash",
};

// Window registry - maps window IDs to their configuration
export interface WindowConfig {
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export const windowConfigs: Record<string, WindowConfig> = {
  about: {
    title: "About Me",
    defaultPosition: { x: 50, y: 50 },
  },
  projects: {
    title: "My Projects",
    defaultPosition: { x: 100, y: 80 },
  },
  skills: {
    title: "Technical Skills",
    defaultPosition: { x: 150, y: 110 },
  },
  contact: {
    title: "Contact Card",
    defaultPosition: { x: 200, y: 140 },
  },
  trash: {
    title: "Trash",
    defaultPosition: { x: 250, y: 170 },
  },
  browser: {
    title: "Web Browser",
    defaultPosition: { x: 50, y: 50 },
    defaultSize: { width: 800, height: 600 },
  },
};
