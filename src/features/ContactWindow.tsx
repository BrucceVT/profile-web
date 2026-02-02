// Contact Window - Contact card display

import React from "react";
import { Mail, Phone, Linkedin, ExternalLink } from "lucide-react";
import { profile } from "@/data";

export const ContactWindow: React.FC = () => {
  return (
    <div className="p-6 font-retro text-lg bg-white h-full flex flex-col items-center justify-center gap-4">
      <div className="text-4xl mb-2">📬</div>
      
      <h2 className="font-bold text-xl">Get In Touch</h2>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Email */}
        <a
          href={`mailto:${profile.contact.email}`}
          className="flex items-center gap-3 p-2 border border-black bg-mac-gray hover:bg-mac-blue hover:text-white transition-colors retro-border-outset"
        >
          <Mail size={18} />
          <span className="text-base">{profile.contact.email}</span>
        </a>

        {/* Phone */}
        <div className="flex items-center gap-3 p-2 border border-black bg-mac-gray retro-border-outset">
          <Phone size={18} />
          <span className="text-base">{profile.contact.phone}</span>
        </div>

        {/* LinkedIn */}
        <a
          href={profile.contact.linkedin.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-2 border border-black bg-mac-gray hover:bg-mac-blue hover:text-white transition-colors retro-border-outset"
        >
          <Linkedin size={18} />
          <span className="text-base flex-1">LinkedIn Profile</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
