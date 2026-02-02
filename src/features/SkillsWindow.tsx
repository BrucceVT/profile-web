// Skills Window - Technical skills display

import React from "react";
import { useI18n } from "@/i18n";

// Skills data
const skillsData = {
  frontend: ["React", "Next.js", "Vue", "Tailwind CSS", "Material UI"],
  mobile: ["Flutter", "React Native"],
  backend: ["Node.js (Express)", "Django", "Laravel", ".NET Core"],
  dbCloud: ["MongoDB", "SQL Server", "AWS (S3, Lambda)", "Oracle APEX"],
};

export const SkillsWindow: React.FC = () => {
  const { t } = useI18n();

  const categories = [
    { key: "frontend", label: t.skillsWindow.frontend, skills: skillsData.frontend },
    { key: "mobile", label: t.skillsWindow.mobile, skills: skillsData.mobile },
    { key: "backend", label: t.skillsWindow.backend, skills: skillsData.backend },
    { key: "dbCloud", label: t.skillsWindow.dbCloud, skills: skillsData.dbCloud },
  ];

  return (
    <div className="p-4 font-retro">
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <fieldset
            key={category.key}
            className="border-2 border-black p-2 bg-white relative mt-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
          >
            <legend className="bg-mac-gray px-2 text-base font-bold border border-black shadow-[1px_1px_0px_white] ml-2">
              {category.label}
            </legend>
            <ul className="list-none p-1">
              {category.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-black" />
                  <span className="text-base">{skill}</span>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
};
