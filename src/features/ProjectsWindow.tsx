// Projects Window - Curated experience showcase with recruiter-friendly descriptions

import React, { useState } from "react";
import { useI18n, type Lang } from "@/i18n";

interface BilingualText {
  es: string;
  en: string;
}

interface Project {
  id: string;
  company: string;
  role: BilingualText;
  period: string;
  description: BilingualText;
  highlights: BilingualText[];
  stack: string[];
  type: "fullstack" | "frontend" | "mobile" | "mixed";
}

const projects: Project[] = [
  {
    id: "virtuallabs",
    company: "VirtualLabs",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    period: "Feb 2024 – Present",
    description: {
      es: "Desarrollo de soluciones web y móviles para sectores como ganadería, educación, minería y logística escolar.",
      en: "Built web and mobile solutions for livestock management, education, mining, and school logistics sectors.",
    },
    highlights: [
      {
        es: "Desarrollé Contigo Pecuario: panel admin React + Redux, app móvil Flutter con QR, offline sync, y backend Node.js con AWS S3 y Prometheus",
        en: "Built Contigo Pecuario: React + Redux admin panel, Flutter mobile app with QR scanning, offline sync, and Node.js backend with AWS S3 & Prometheus",
      },
      {
        es: "Creé Tiacher: app educativa Flutter con OpenAI para aprendizaje de inglés, gamificación y suscripciones premium",
        en: "Developed Tiacher: Flutter educational app with OpenAI integration for English learning, gamification, and premium subscriptions",
      },
      {
        es: "Construí SGA: plataforma de pedidos corporativos con React + TypeScript, pasarela de pagos Culqi y gestión multiempresa",
        en: "Built SGA: corporate food ordering platform with React + TypeScript, Culqi payment gateway, and multi-company management",
      },
      {
        es: "Implementé Stoply: app Flutter de monitoreo de rutas con Google Maps, geolocalización en tiempo real y alertas de audio",
        en: "Implemented Stoply: Flutter route monitoring app with Google Maps, real-time geolocation, and audio alerts",
      },
    ],
    stack: ["React", "TypeScript", "Flutter", "Node.js", "Django", "MongoDB", "AWS"],
    type: "fullstack",
  },
  {
    id: "fimaki",
    company: "FIMAKI",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    period: "2024",
    description: {
      es: "Plataforma fintech de factoring con flujos de inversión, reportería y automatización operativa.",
      en: "Fintech factoring platform with investment workflows, reporting, and operational automation.",
    },
    highlights: [
      {
        es: "Desarrollé back-office en Oracle APEX con PL/SQL: gestión de inversores, depósitos/retiros, reportes y notificaciones por Telegram",
        en: "Built back-office in Oracle APEX with PL/SQL: investor management, deposits/withdrawals, reports, and Telegram notifications",
      },
      {
        es: "Implementé sitio corporativo y landing en WordPress con SEO optimizado, temas personalizados y rendimiento mejorado",
        en: "Delivered corporate site and landing in WordPress with optimized SEO, custom themes, and improved performance",
      },
    ],
    stack: ["Oracle APEX", "PL/SQL", "WordPress", "OCI Object Storage"],
    type: "fullstack",
  },
  {
    id: "deocasion",
    company: "DeOcasion",
    role: {
      es: "Desarrollador Frontend",
      en: "Frontend Developer",
    },
    period: "Sep 2023 – Feb 2024",
    description: {
      es: "Plataforma de subastas en tiempo real con pujas en vivo, gestión de catálogo y dashboards operativos.",
      en: "Real-time auction platform with live bidding, catalog management, and operational dashboards.",
    },
    highlights: [
      {
        es: "Desarrollé UI de subastas en tiempo real con React + TypeScript y WebSockets: pujas en vivo, temporizadores sincronizados y anti-sniping",
        en: "Built real-time auction UI with React + TypeScript and WebSockets: live bidding, synced timers, and anti-sniping",
      },
      {
        es: "Integré pasarela de pagos, dashboards de KPIs de conversión y exportación a CSV/Excel",
        en: "Integrated payment gateway, conversion KPI dashboards, and CSV/Excel export",
      },
      {
        es: "Optimicé rendimiento con code-splitting, lazy loading y React.memo, mejorando Core Web Vitals",
        en: "Optimized performance with code-splitting, lazy loading, and React.memo, improving Core Web Vitals",
      },
    ],
    stack: ["React", "TypeScript", "WebSockets", "Node.js", "JWT"],
    type: "frontend",
  },
  {
    id: "insource",
    company: "Insource Consultora",
    role: {
      es: "Desarrollador Frontend",
      en: "Frontend Developer",
    },
    period: "Apr 2023 – Sep 2023",
    description: {
      es: "Plataformas web de delivery, tracking de transporte y subastas con Vue.js y React.",
      en: "Web platforms for delivery, transport tracking, and auctions built with Vue.js and React.",
    },
    highlights: [
      {
        es: "Desarrollé plataforma de delivery con React, Firebase y Tailwind CSS: autenticación, carrito y pedidos en tiempo real",
        en: "Built delivery platform with React, Firebase, and Tailwind CSS: auth, cart, and real-time orders",
      },
      {
        es: "Implementé tracking de transporte urbano con React + Supabase: geolocalización en tiempo real y monitoreo de rutas",
        en: "Developed urban transport tracking with React + Supabase: real-time geolocation and route monitoring",
      },
    ],
    stack: ["React", "Vue.js", "Firebase", "Supabase", "Tailwind CSS"],
    type: "frontend",
  },
  {
    id: "chinalco",
    company: "Tecsup / Chinalco",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    period: "Jul 2021 – Apr 2023",
    description: {
      es: "Módulos web internos para gestión de procesos educativos y corporativos en el sector minero.",
      en: "Internal web modules for educational and corporate process management in the mining sector.",
    },
    highlights: [
      {
        es: "Desarrollé módulos web con React + Tailwind y backend C# .NET Core con patrones Repository/Service y SQL Server",
        en: "Built web modules with React + Tailwind and C# .NET Core backend using Repository/Service patterns and SQL Server",
      },
      {
        es: "Implementé autenticación JWT con roles/ACL y configuré despliegue en IIS con CI/CD automatizado",
        en: "Implemented JWT auth with role-based ACL and configured IIS deployment with automated CI/CD",
      },
    ],
    stack: ["React", "Tailwind", "C# .NET Core", "SQL Server", "IIS"],
    type: "fullstack",
  },
];

const typeColors: Record<string, string> = {
  fullstack: "bg-purple-100 text-purple-700 border-purple-300",
  frontend: "bg-blue-100 text-blue-700 border-blue-300",
  mobile: "bg-green-100 text-green-700 border-green-300",
  mixed: "bg-orange-100 text-orange-700 border-orange-300",
};

const typeLabels: Record<string, Record<Lang, string>> = {
  fullstack: { es: "Full Stack", en: "Full Stack" },
  frontend: { es: "Frontend", en: "Frontend" },
  mobile: { es: "Móvil", en: "Mobile" },
  mixed: { es: "Mixto", en: "Mixed" },
};

const getText = (text: BilingualText, lang: Lang): string => {
  return text[lang] || text.en || text.es;
};

export const ProjectsWindow: React.FC = () => {
  const { t, lang } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>("virtuallabs");

  return (
    <div className="font-retro bg-white overflow-y-auto p-3">
      {/* Project cards */}
      <div className="space-y-2">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id;
          
          return (
            <div
              key={project.id}
              className="border-2 border-black bg-white"
            >
              {/* Header - always visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 text-left"
              >
                {/* Expand indicator */}
                <span className="text-xs font-mono w-3 flex-shrink-0">
                  {isExpanded ? "▼" : "▶"}
                </span>
                
                {/* Company & Role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{project.company}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border font-bold ${typeColors[project.type]}`}>
                      {typeLabels[project.type][lang]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {getText(project.role, lang)} · {project.period}
                  </div>
                </div>

                {/* Stack preview (collapsed) */}
                {!isExpanded && (
                  <div className="hidden sm:flex gap-1 flex-shrink-0">
                    {project.stack.slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] bg-gray-100 border border-gray-300 px-1.5 py-0.5">{s}</span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="text-[10px] text-gray-400">+{project.stack.length - 3}</span>
                    )}
                  </div>
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-200">
                  {/* Description */}
                  <p className="text-sm text-gray-700 mt-2 mb-2">
                    {getText(project.description, lang)}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 mb-3">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="flex-shrink-0 mt-[3px]">
                          <div className="w-1.5 h-1.5 bg-black" />
                        </span>
                        <span className="leading-tight">{getText(h, lang)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map(s => (
                      <span
                        key={s}
                        className="text-[11px] bg-gray-100 border border-gray-300 px-2 py-0.5 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-300 flex items-center justify-between text-xs text-gray-500">
        <span>{projects.length} {t.projectsWindow.projectsInFolder}</span>
        <span>+4 {lang === "es" ? "años de experiencia" : "years of experience"}</span>
      </div>
    </div>
  );
};
