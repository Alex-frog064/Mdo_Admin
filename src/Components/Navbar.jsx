import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { createContext, useContext, useState } from "react";

export const SlidebarContext = createContext();

export default function Navbar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside>
      <nav
        className={`h-full flex flex-col bg-white border-r shadow-sm transition-all ${
          expanded ? "w-48" : "w-16"
        }`} // Ajustamos el ancho del navbar
      >
        {/* Sección superior */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://i.pinimg.com/736x/25/f9/b3/25f9b35a2fe17a24e9c330b592d47c5c.jpg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-10" : "w-0"
            }`}
            alt="Epic Face Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-blue2 hover:bg-blue1"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Contenedor de elementos */}
        <SlidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SlidebarContext.Provider>

        {/* Sección inferior */}
        <div className="border-t flex p-3">
          <img
            src="https://i.pinimg.com/736x/c2/0e/e5/c20ee5463d9554ffb3b9caa4a7cb3473.jpg"
            alt="User Avatar"
            className="w-8 h-8 rounded-md" // Ajuste de tamaño del avatar
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-36 ml-3" : "w-0"
            }`} // Ajustamos el espacio inferior según el estado expandido
          >
            <div className="leading-4">
              <h4 className="font-semibold text-sm">MascoTico CORP</h4>
              <span className="text-xs text-blue1">
              mascotico.1225@gmail.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
