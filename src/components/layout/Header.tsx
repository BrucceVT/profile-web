import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">John Doe</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 underline"
                    : "text-white hover:underline"
                }
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 underline"
                    : "text-white hover:underline"
                }
              >
                Acerca
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 underline"
                    : "text-white hover:underline"
                }
              >
                Proyectos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 underline"
                    : "text-white hover:underline"
                }
              >
                Contacto
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
