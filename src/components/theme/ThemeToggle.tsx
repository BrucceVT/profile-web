import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  // Toggle simple: si se ve oscuro -> forzamos light; si se ve claro -> forzamos dark
  const onToggle = () => {
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  // Texto para accesibilidad
  const label =
    theme === "system" ? `Tema: sistema (${effectiveTheme})` : `Tema: ${theme}`;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="font-pixel"
      aria-label={label}
      title={`${label} — click para alternar`}
    >
      {effectiveTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="ml-2 hidden sm:inline">
        {effectiveTheme === "dark" ? "Claro" : "Oscuro"}
      </span>
    </Button>
  );
};

export default ThemeToggle;
