import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Header: React.FC = () => {
  const navItems = [
    { to: "/", label: "Inicio" },
    { to: "/about", label: "Acerca" },
    { to: "/projects", label: "Proyectos" },
    { to: "/contact", label: "Contacto" },
  ];

  return (
    <motion.header
      className="bg-background text-foreground py-6 scanlines"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.h1
          className="text-2xl font-pixel text-primary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Brucce Yul Villena Terreros
        </motion.h1>

        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `text-secondary font-pixel text-sm pixel-border py-1 px-2 ${
                        isActive
                          ? "text-accent bg-primary/20"
                          : "hover:text-accent hover:bg-primary/10"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Botón de tema */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
