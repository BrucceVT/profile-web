// Contact Window - Contact card display

import React from "react";
import { Mail, Phone, Linkedin, ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n";

// Static contact data
const contact = {
  email: "bvillena2000@gmail.com",
  phone: "(+51) 997 029 047",
  linkedin: {
    url: "https://linkedin.com/in/brucce-villena-terreros-0432aa183",
  },
};

export const ContactWindow: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="p-6 font-retro text-lg bg-white h-full flex flex-col items-center justify-center gap-4">
      <div className="text-4xl mb-2">📬</div>
      
      <h2 className="font-bold text-xl">{t.contactWindow.getInTouch}</h2>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Email */}
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 p-2 border border-black bg-mac-gray hover:bg-mac-blue hover:text-white transition-colors retro-border-outset"
        >
          <Mail size={18} />
          <span className="text-base">{contact.email}</span>
        </a>

        {/* Phone */}
        <div className="flex items-center gap-3 p-2 border border-black bg-mac-gray retro-border-outset">
          <Phone size={18} />
          <span className="text-base">{contact.phone}</span>
        </div>

        {/* LinkedIn */}
        <a
          href={contact.linkedin.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-2 border border-black bg-mac-gray hover:bg-mac-blue hover:text-white transition-colors retro-border-outset"
        >
          <Linkedin size={18} />
          <span className="text-base flex-1">{t.contactWindow.linkedinProfile}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
