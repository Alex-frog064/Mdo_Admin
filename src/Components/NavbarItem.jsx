import { useContext } from "react";
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import { SlidebarContext } from './Navbar';

export default function NavbarItem({ icon, text, to, active, alert }) {
  const { expanded } = useContext(SlidebarContext);

  return (
    <Link
      to={to} // Ruta para la navegación
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-blue-200 text-indigo-800"
            : "hover:bg-yellow-100 text-gray-600"
        }
      `}
    >
      {/* Ícono */}
      {icon}

      {/* Texto (condicional según estado de `expanded`) */}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>

      {/* Indicador de alerta */}
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {/* Tooltip si el navbar no está expandido */}
      {!expanded && (
        <div 
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            invisible opacity-0 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </Link>
  );
}
