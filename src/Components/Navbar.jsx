import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { createContext, useState } from "react";

export const SlidebarContext = createContext();

export default function Navbar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-gradient-to-b from-sky-50 to-white border-r border-sky-100 transition-all duration-300 ease-in-out relative
        ${expanded ? "w-64" : "w-20"}`}
      >
        {/* Sección superior */}
        <div className="p-6 flex justify-between items-center border-b border-sky-100">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pinimg.com/736x/25/f9/b3/25f9b35a2fe17a24e9c330b592d47c5c.jpg"
              className={`w-10 h-10 rounded-xl shadow-sm transition-all duration-300 
              ${expanded ? "rotate-0" : "rotate-180"}`}
              alt="Epic Face Logo"
            />
            <span className={`font-semibold text-sky-900 transition-all duration-300 
              ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
              MascoTico
            </span>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`absolute -right-3 top-9 p-1.5 rounded-full bg-sky-100 hover:bg-sky-200 
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

        {/* Sección inferior */}
        <div className="border-t border-sky-100 p-6">
          <div className={`flex items-center gap-4 ${!expanded && "justify-center"}`}>
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/c2/0e/e5/c20ee5463d9554ffb3b9caa4a7cb3473.jpg"
                alt="User Avatar"
                className="w-10 h-10 rounded-xl shadow-sm object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div
              className={`flex-1 transition-all duration-300 overflow-hidden
              ${expanded ? "opacity-100" : "opacity-0 w-0"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm text-sky-900">MascoTico CORP</h4>
                  <p className="text-xs text-sky-600 truncate">
                    mascotico.1225@gmail.com
                  </p>
                </div>
                <button className="p-1.5 hover:bg-sky-100 rounded-lg transition-colors duration-200">
                  <MoreVertical size={18} className="text-sky-800" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
