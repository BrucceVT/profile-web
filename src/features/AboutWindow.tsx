// About Window - Profile information display

import React from "react";
import { Mail, MapPin, Phone, Linkedin } from "lucide-react";
import { profile } from "@/data";

export const AboutWindow: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 font-retro text-lg">
      {/* Header - Photo + Name */}
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-mac-gray border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_black]">
          <span className="text-4xl">👨‍💻</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1 uppercase tracking-wider">
            {profile.name}
          </h1>
          <h2 className="text-xl italic mb-2 text-gray-700">{profile.title}</h2>
          <p className="text-base leading-tight mb-2">{profile.tagline}</p>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black border-dashed my-2" />

      {/* Bio */}
      <div>
        <p className="mb-4 text-justify">{profile.bio}</p>

        <h3 className="font-bold underline mb-2">Contact Info:</h3>
        <ul className="space-y-1 text-base">
          <li className="flex items-center gap-2">
            <Mail size={16} />
            <a
              href={`mailto:${profile.contact.email}`}
              className="hover:bg-black hover:text-white px-1"
            >
              {profile.contact.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Phone size={16} />
            <span>{profile.contact.phone}</span>
          </li>
          <li className="flex items-center gap-2">
            <Linkedin size={16} />
            <a
              href={profile.contact.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-black hover:text-white px-1"
            >
              {profile.contact.linkedin.label}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
