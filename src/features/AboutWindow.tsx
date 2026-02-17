// About Window - Professional profile display

import React from "react";
import { Mail, MapPin, Phone, Linkedin, ExternalLink, GraduationCap, Briefcase } from "lucide-react";
import { useI18n, type Lang } from "@/i18n";

const contact = {
  email: "bvillena2000@gmail.com",
  phone: "(+51) 997 029 047",
  linkedin: {
    url: "https://linkedin.com/in/brucce-villena-terreros-0432aa183",
    label: "LinkedIn",
  },
  location: "Arequipa, Perú",
};

interface BilingualText {
  es: string;
  en: string;
}

const education: { institution: string; degree: BilingualText; period: string }[] = [
  {
    institution: "Universidad Tecnológica del Perú",
    degree: {
      es: "Ingeniería de Sistemas e Informática",
      en: "Systems & IT Engineering",
    },
    period: "2022 – Present",
  },
  {
    institution: "TECSUP",
    degree: {
      es: "Diseño de Software e Integración de Sistemas",
      en: "Software Design & Systems Integration",
    },
    period: "2018 – 2020",
  },
];

const getText = (text: BilingualText, lang: Lang): string => text[lang] || text.en;

export const AboutWindow: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <div className="font-retro bg-white p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-mac-gray border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_black]">
          <span className="text-3xl">👨‍💻</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold uppercase tracking-wider leading-tight">
            {t.profile.name}
          </h1>
          <h2 className="text-sm font-bold text-gray-600 mt-0.5">{t.profile.title}</h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <MapPin size={12} />
            <span>{contact.location}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-black mb-3" />

      {/* Bio */}
      <p className="text-sm leading-relaxed text-gray-700 mb-4">
        {t.profile.bio}
      </p>

      {/* Experience summary */}
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={14} />
        <span className="text-sm font-bold">
          {lang === "es" ? "Experiencia destacada" : "Key Experience"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { value: "+4", label: lang === "es" ? "Años exp." : "Years exp." },
          { value: "+10", label: lang === "es" ? "Proyectos" : "Projects" },
          { value: "5", label: lang === "es" ? "Empresas" : "Companies" },
        ].map((stat) => (
          <div key={stat.label} className="text-center bg-gray-50 border border-gray-300 p-2">
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-[10px] text-gray-500 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap size={14} />
        <span className="text-sm font-bold">
          {lang === "es" ? "Educación" : "Education"}
        </span>
      </div>
      <div className="space-y-1.5 mb-4">
        {education.map((edu) => (
          <div key={edu.institution} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-black flex-shrink-0 mt-[5px]" />
            <div className="min-w-0">
              <span className="font-bold">{edu.institution}</span>
              <span className="text-gray-500"> · {getText(edu.degree, lang)} · {edu.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contact links */}
      <div className="border-t border-gray-300 pt-3">
        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-300 px-2.5 py-1.5 hover:bg-mac-blue hover:text-white hover:border-black transition-colors"
          >
            <Mail size={12} />
            {contact.email}
          </a>
          <a
            href={contact.linkedin.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-300 px-2.5 py-1.5 hover:bg-mac-blue hover:text-white hover:border-black transition-colors"
          >
            <Linkedin size={12} />
            {contact.linkedin.label}
            <ExternalLink size={10} />
          </a>
          <div className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-300 px-2.5 py-1.5">
            <Phone size={12} />
            {contact.phone}
          </div>
        </div>
      </div>
    </div>
  );
};
