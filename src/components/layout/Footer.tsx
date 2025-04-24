import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-background text-foreground py-4 scanlines"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.p
          className="text-sm font-pixel text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          © 2025 Brucce Yul Villena Terreros. Todos los derechos reservados.
        </motion.p>
        <motion.div
          className="flex justify-center space-x-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <a
            href="mailto:bvillena2000@gmail.com"
            className="text-secondary hover:text-accent font-pixel text-sm"
          >
            Email
          </a>
          <a
            href="https://github.com/BrucceVT"
            className="text-secondary hover:text-accent font-pixel text-sm"
          >
            GitHub
          </a>
          <a
            href="https://pe.linkedin.com/in/brucce-villena-terreros-0432aa183"
            className="text-secondary hover:text-accent font-pixel text-sm"
          >
            LinkedIn
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
