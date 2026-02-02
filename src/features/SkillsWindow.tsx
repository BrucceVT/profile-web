// Skills Window - Technical skills display

import React from "react";
import { skillCategories } from "@/data";

export const SkillsWindow: React.FC = () => {
  return (
    <div className="p-4 font-retro">
      <div className="grid grid-cols-2 gap-4">
        {skillCategories.map((category) => (
          <fieldset
            key={category.name}
            className="border-2 border-black p-2 bg-white relative mt-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
          >
            <legend className="bg-mac-gray px-2 text-sm font-bold border border-black shadow-[1px_1px_0px_white] ml-2">
              {category.name}
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
