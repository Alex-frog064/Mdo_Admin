import { useContext } from "react";
import { Link } from "react-router-dom";
import { SlidebarContext } from './Navbar';

export default function NavbarItem({ icon, text, to, active, alert }) {
  const { expanded } = useContext(SlidebarContext);

  return (
    <Link
      to={to}
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-blue-200 text-indigo-800"
            : "hover:bg-blue2 text-gray-600"
        }
      `}
    >
      {icon}

      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div 
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-emerald-100 text-blue1
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </Link>
  );
}
