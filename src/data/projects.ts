// Projects data - Portfolio projects list

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  icon: "database" | "smartphone" | "globe" | "server" | "folder";
  url?: string;
}

export const projects: Project[] = [
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
