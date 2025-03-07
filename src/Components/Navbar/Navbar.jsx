import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { createContext, useState, useEffect } from "react";

export const SlidebarContext = createContext();

export default function Navbar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-gradient-to-b from-sky-50 to-white border-r border-sky-100 transition-all duration-300 ease-in-out relative
        ${expanded ? "w-64" : "w-20"}`}
      >
        {/* Sección superior */}
        <div className="p-6 flex justify-between items-center border-b border-">
          <div className="flex items-center gap-3">
            {/* Foto de perfil o imagen por defecto */}
            {userData?.veterinario?.imagen ? (
              <img
                src={userData.veterinario.imagen}
                className={`w-10 h-10 rounded-xl shadow-sm transition-all duration-300 object-cover
                ${expanded ? "rotate-0" : "rotate-180"}`}
                alt="Profile"
              />
            ) : (
              <div className={`w-10 h-10 rounded-xl shadow-sm transition-all duration-300 bg-blue2
                flex items-center justify-center text-blue1 font-semibold
                ${expanded ? "rotate-0" : "rotate-180"}`}>
                {userData?.veterinario?.nombre?.[0]?.toUpperCase() || "M"}
              </div>
            )}
            
            <div className={`transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
              <span className="font-semibold text-blue1">
                {userData?.veterinario?.nombre || "Cargando..."}
              </span>
              <span className="text-sm text-blue2 block">
                {userData?.veterinario?.email || "sopas"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`absolute -right-3 top-9 p-1.5 rounded-full bg-sky-100 hover:bg-sky-00 
            text-sky-800 transition-colors duration-200 shadow-md`}
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Contenedor de elementos */}
        <SlidebarContext.Provider value={{ expanded }}>
          <div className="flex-1 px-4 py-6">
            <ul className="space-y-2">{children}</ul>
          </div>
        </SlidebarContext.Provider>

        
      </nav>
    </aside>
  );
}
