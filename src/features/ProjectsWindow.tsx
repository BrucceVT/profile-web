// Projects Window - Portfolio projects display

import React from "react";
import { Database, Smartphone, Globe, Server, Folder } from "lucide-react";
import { useI18n } from "@/i18n";

// Project data (descriptions could be translated in future)
interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  icon: "database" | "smartphone" | "globe" | "server" | "folder";
}

const projects: Project[] = [
  {
    id: "contigo-pecuario",
    title: "VirtualLabs (Contigo Pecuario)",
    description: "Full Stack solution for livestock management.",
    stack: ["React", "Redux", "Flutter", "Node.js", "Express", "MongoDB", "AWS S3"],
    icon: "database",
  },
  {
    id: "tiacher",
    title: "VirtualLabs (Tiacher)",
    description: "Educational mobile app with OpenAI integration for personalized English learning.",
    stack: ["Flutter", "OpenAI API", "Django"],
    icon: "smartphone",
  },
  {
    id: "sga",
    title: "VirtualLabs (SGA)",
    description: "Corporate food ordering web platform. Menu management & Culqi payment.",
    stack: ["React", "TypeScript", "Django", "Culqi"],
    icon: "globe",
  },
  {
    id: "deocasion",
    title: "DeOcasion",
    description: "Real-time auction platform with WebSockets for live bidding.",
    stack: ["React", "TypeScript", "WebSockets", "Node.js"],
    icon: "server",
  },
  {
    id: "chinalco",
    title: "Tecsup (Chinalco Project)",
    description: "Internal web modules and Backend systems.",
    stack: ["React", "Tailwind", "C# .NET Core", "SQL Server"],
    icon: "folder",
  },
];

// Icon mapping
const iconMap = {
  database: Database,
  smartphone: Smartphone,
  globe: Globe,
  server: Server,
  folder: Folder,
};

const ProjectIcon: React.FC<{ type: Project["icon"] }> = ({ type }) => {
  const IconComponent = iconMap[type];
  return <IconComponent size={20} />;
};

export const ProjectsWindow: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="p-2 font-retro">
      <div className="grid grid-cols-1 gap-0 bg-white border border-black retro-border-inset">
        {/* Header Row */}
        <div className="grid grid-cols-12 bg-gray-200 border-b border-black font-bold text-base p-1.5">
          <div className="col-span-1"></div>
          <div className="col-span-4">{t.projectsWindow.name}</div>
          <div className="col-span-7">{t.projectsWindow.description}</div>
        </div>

        {/* Project Rows */}
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className={`
              grid grid-cols-12 p-2 items-center cursor-pointer border-b border-gray-100
              hover:bg-mac-blue hover:text-white
              ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            `}
          >
            <div className="col-span-1 flex justify-center">
              <ProjectIcon type={project.icon} />
            </div>
            <div className="col-span-4 font-bold truncate pr-2">
              {project.title}
            </div>
            <div className="col-span-7 text-base leading-tight">
              <div>{project.description}</div>
              <div className="text-sm opacity-75 mt-0.5 font-mono">
                {project.stack.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 text-sm text-center text-gray-500">
        {projects.length} {t.projectsWindow.projectsInFolder}
      </div>
    </div>
  );
};
