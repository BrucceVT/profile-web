// Skills data - Technical skills by category

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: ["React", "Next.js", "Vue", "Tailwind CSS", "Material UI"],
  },
  {
    name: "Mobile",
    skills: ["Flutter", "React Native"],
  },
  {
    name: "Backend",
    skills: ["Node.js (Express)", "Django", "Laravel", ".NET Core"],
  },
  {
    name: "DB & Cloud",
    skills: ["MongoDB", "SQL Server", "AWS (S3, Lambda)", "Oracle APEX"],
  },
];
