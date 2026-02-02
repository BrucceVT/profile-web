// Profile data - Bio, contact info, and social links

export const profile = {
  name: "Brucce Villena Terreros",
  title: "Full Stack Hybrid Developer",
  tagline: "React / Node / Flutter",
  location: "Arequipa, Perú",
  bio: "Focused on efficient solutions for retail and education. I build robust web and mobile applications with a focus on user experience and scalable architecture.",
  contact: {
    email: "bvillena2000@gmail.com",
    phone: "(+51) 997 029 047",
    linkedin: {
      url: "https://linkedin.com/in/brucce-villena-terreros-0432aa183",
      label: "Brucce Villena Terreros",
    },
  },
} as const;

export type Profile = typeof profile;
