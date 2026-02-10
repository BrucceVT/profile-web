// Skills Window - Elegant single-view retro design

import React from "react";
import { useI18n } from "@/i18n";

// Skill with proficiency level
interface Skill {
  name: string;
  level: number; // 1-5
}

interface SkillCategory {
  key: string;
  icon: string;
  skills: Skill[];
}

// Skills data with proficiency
const skillCategories: SkillCategory[] = [
  {
    key: "frontend",
    icon: "🖥",
    skills: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 4 },
      { name: "Vue", level: 3 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Material UI", level: 4 },
    ],
  },
  {
    key: "mobile",
    icon: "📱",
    skills: [
      { name: "Flutter", level: 4 },
      { name: "React Native", level: 3 },
    ],
  },
  {
    key: "backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: 5 },
      { name: "Django", level: 3 },
      { name: "Laravel", level: 4 },
      { name: ".NET Core", level: 3 },
    ],
  },
  {
    key: "dbCloud",
    icon: "☁️",
    skills: [
      { name: "MongoDB", level: 4 },
      { name: "SQL Server", level: 4 },
      { name: "AWS", level: 3 },
      { name: "Oracle APEX", level: 3 },
    ],
  },
];

// Pixel-style proficiency dots
const SkillDots: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex gap-[2px] ml-auto flex-shrink-0">
    {Array(5).fill(0).map((_, i) => (
      <div
        key={i}
        className={`w-[7px] h-[7px] ${
          i < level ? "bg-black" : "bg-black/15"
        }`}
      />
    ))}
  </div>
);

export const SkillsWindow: React.FC = () => {
  const { t } = useI18n();

  const labels: Record<string, string> = {
    frontend: t.skillsWindow.frontend,
    mobile: t.skillsWindow.mobile,
    backend: t.skillsWindow.backend,
    dbCloud: t.skillsWindow.dbCloud,
  };

  return (
    <div className="font-retro bg-white p-4 overflow-y-auto">
      {/* Grid: 2 columns for categories */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        {skillCategories.map((cat) => (
          <div key={cat.key}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
              <span className="text-base leading-none">{cat.icon}</span>
              <span className="text-sm font-bold tracking-wide uppercase">
                {labels[cat.key]}
              </span>
            </div>

            {/* Skill rows */}
            <div className="space-y-1.5 pl-1">
              {cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm leading-tight">{skill.name}</span>
                  <SkillDots level={skill.level} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer legend */}
      <div className="mt-5 pt-2 border-t border-gray-300 flex items-center justify-end gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-flex gap-[1px]">
            {[1,1,1,0,0].map((filled, i) => (
              <span key={i} className={`inline-block w-[5px] h-[5px] ${filled ? "bg-black" : "bg-black/15"}`} />
            ))}
          </span>
          Intermedio
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex gap-[1px]">
            {[1,1,1,1,1].map((_, i) => (
              <span key={i} className="inline-block w-[5px] h-[5px] bg-black" />
            ))}
          </span>
          Experto
        </span>
      </div>
    </div>
  );
};
