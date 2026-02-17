// i18n Messages Dictionary

export type Lang = "es" | "en";

export interface Messages {
  // Profile
  profile: {
    name: string;
    title: string;
    tagline: string;
    headline: string;
    bio: string;
  };
  // Hero CTA
  hero: {
    ctaStatus: string;
    ctaButton: string;
  };
  // Boot screen
  boot: {
    title: string;
    subtitle: string;
    loading: string;
    starting: string;
    skipHint: string;
  };
  // Desktop Icons
  icons: {
    about: string;
    projects: string;
    skills: string;
    contact: string;
    trash: string;
    games: string;
    browser: string;
  };
  // Window Titles
  windows: {
    about: string;
    projects: string;
    skills: string;
    contact: string;
    trash: string;
    welcome: string;
    games: string;
    minesweeper: string;
    browser: string;
  };
  // Menu
  menu: {
    file: string;
    edit: string;
    view: string;
    special: string;
    language: string;
  };
  // About Window
  aboutWindow: {
    contactInfo: string;
    location: string;
  };
  // Projects Window
  projectsWindow: {
    name: string;
    description: string;
    projectsInFolder: string;
  };
  // Skills Window
  skillsWindow: {
    frontend: string;
    mobile: string;
    backend: string;
    dbCloud: string;
  };
  // Contact Window
  contactWindow: {
    getInTouch: string;
    linkedinProfile: string;
  };
  // Trash
  trashWindow: {
    empty: string;
    items: string;
  };
  // Browser
  browserWindow: {
    placeholder: string;
    blockedTitle: string;
    blockedMessage: string;
    openExternal: string;
    portfolio: string;
  };
}

export const messages: Record<Lang, Messages> = {
  es: {
    profile: {
      name: "Brucce Villena Terreros",
      title: "Desarrollador Full Stack",
      tagline: "Web · Móvil · Full Stack",
      headline: "Soluciones digitales escalables que impulsan el crecimiento de tu negocio",
      bio: "Desarrollador Full Stack con +4 años de experiencia especializado en React, Node.js y Flutter. He diseñado e implementado soluciones web y móviles para sectores como retail, educación, fintech y logística, con enfoque en arquitectura escalable, rendimiento y experiencia de usuario.",
    },
    hero: {
      ctaStatus: "Disponible para proyectos",
      ctaButton: "Contáctame",
    },
    boot: {
      title: "Brucce Villena",
      subtitle: "Portfolio",
      loading: "Cargando escritorio...",
      starting: "Iniciando...",
      skipHint: "Click o Enter para continuar",
    },
    icons: {
      about: "Sobre Mí",
      projects: "Proyectos",
      skills: "Habilidades",
      contact: "Contacto",
      trash: "Papelera",
      games: "Juegos",
      browser: "Navegador",
    },
    windows: {
      about: "Sobre Mí",
      projects: "Mis Proyectos",
      skills: "Habilidades Técnicas",
      contact: "Tarjeta de Contacto",
      trash: "Papelera",
      welcome: "Bienvenido",
      games: "Juegos",
      minesweeper: "Buscaminas",
      browser: "Navegador",
    },
    menu: {
      file: "Archivo",
      edit: "Editar",
      view: "Ver",
      special: "Especial",
      language: "Idioma",
    },
    aboutWindow: {
      contactInfo: "Información de Contacto:",
      location: "Ubicación",
    },
    projectsWindow: {
      name: "Nombre",
      description: "Descripción / Stack",
      projectsInFolder: "proyectos en la carpeta",
    },
    skillsWindow: {
      frontend: "Frontend",
      mobile: "Móvil",
      backend: "Backend",
      dbCloud: "BD & Cloud",
    },
    contactWindow: {
      getInTouch: "Contáctame",
      linkedinProfile: "Perfil de LinkedIn",
    },
    trashWindow: {
      empty: "La papelera está vacía",
      items: "elementos",
    },
    browserWindow: {
      placeholder: "Buscar o ingresar sitio web",
      blockedTitle: "Nota de Seguridad",
      blockedMessage: "Muchos sitios web populares (Google, YouTube) bloquean la visualización en marcos. Usa el botón 'Abrir Externo' para visitarlos.",
      openExternal: "Abrir en nueva pestaña",
      portfolio: "Mi Portafolio",
    },
  },
  en: {
    profile: {
      name: "Brucce Villena Terreros",
      title: "Full Stack Developer",
      tagline: "Web · Mobile · Full Stack",
      headline: "Scalable digital solutions that drive your business growth",
      bio: "Full Stack Developer with 4+ years of experience specialized in React, Node.js, and Flutter. I have designed and delivered web and mobile solutions for retail, education, fintech, and logistics, with a focus on scalable architecture, performance, and user experience.",
    },
    hero: {
      ctaStatus: "Available for projects",
      ctaButton: "Contact me",
    },
    boot: {
      title: "Brucce Villena",
      subtitle: "Portfolio",
      loading: "Loading desktop...",
      starting: "Starting...",
      skipHint: "Click or press Enter to continue",
    },
    icons: {
      about: "About Me",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
      trash: "Trash",
      games: "Games",
      browser: "Browser",
    },
    windows: {
      about: "About Me",
      projects: "My Projects",
      skills: "Technical Skills",
      contact: "Contact Card",
      trash: "Trash",
      welcome: "Welcome",
      games: "Games",
      minesweeper: "Minesweeper",
      browser: "Browser",
    },
    menu: {
      file: "File",
      edit: "Edit",
      view: "View",
      special: "Special",
      language: "Language",
    },
    aboutWindow: {
      contactInfo: "Contact Info:",
      location: "Location",
    },
    projectsWindow: {
      name: "Name",
      description: "Description / Stack",
      projectsInFolder: "projects in folder",
    },
    skillsWindow: {
      frontend: "Frontend",
      mobile: "Mobile",
      backend: "Backend",
      dbCloud: "DB & Cloud",
    },
    contactWindow: {
      getInTouch: "Get In Touch",
      linkedinProfile: "LinkedIn Profile",
    },
    trashWindow: {
      empty: "Trash is empty",
      items: "items",
    },
    browserWindow: {
      placeholder: "Search or enter website name",
      blockedTitle: "Security Note",
      blockedMessage: "Many major websites (Google, YouTube) block embedding via iframes. Use the 'Open External' button to visit them.",
      openExternal: "Open in new tab",
      portfolio: "My Portfolio",
    },
  },
};
