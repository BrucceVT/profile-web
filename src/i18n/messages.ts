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
}

export const messages: Record<Lang, Messages> = {
  es: {
    profile: {
      name: "Brucce Villena Terreros",
      title: "Desarrollador Full Stack",
      tagline: "Aplicaciones de Escritorio, Web y Móviles",
      headline: "Construyo soluciones digitales de alto rendimiento que impulsan el crecimiento de tu negocio",
      bio: "Enfocado en soluciones eficientes para retail y educación. Desarrollo aplicaciones web y móviles robustas con énfasis en experiencia de usuario y arquitectura escalable.",
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
  },
  en: {
    profile: {
      name: "Brucce Villena Terreros",
      title: "Full Stack Developer",
      tagline: "Desktop, Web & Mobile Applications",
      headline: "Building high-performance digital solutions that drive your business growth",
      bio: "Focused on efficient solutions for retail and education. I build robust web and mobile applications with a focus on user experience and scalable architecture.",
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
  },
};
