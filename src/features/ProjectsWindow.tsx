// Projects Window - Portfolio projects display

import React from "react";
import { Database, Smartphone, Globe, Server, Folder } from "lucide-react";
import { projects, type Project } from "@/data";

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
  return (
    <div className="p-2 font-retro">
      <div className="grid grid-cols-1 gap-0 bg-white border border-black retro-border-inset">
        {/* Header Row */}
        <div className="grid grid-cols-12 bg-gray-200 border-b border-black font-bold text-sm p-1">
          <div className="col-span-1"></div>
          <div className="col-span-4">Name</div>
          <div className="col-span-7">Description / Stack</div>
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
            <div className="col-span-7 text-sm leading-tight">
              <div>{project.description}</div>
              <div className="text-xs opacity-75 mt-0.5 font-mono">
                {project.stack.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 text-xs text-center text-gray-500">
        {projects.length} projects in folder
      </div>
    </div>
  );
};
