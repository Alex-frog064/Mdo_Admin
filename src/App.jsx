import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  LifeBuoy,
  Calendar,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Store,
  Clock,
  HelpCircle
} from "lucide-react";
import Navbar from "./Components/Navbar/Navbar";
import NavbarItem from "./Components/Navbar/NavbarItem";
import HelpModal from './Components/Help/HelpModal';

export default function App() {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const isAuthenticated = !!localStorage.getItem("jwt");
  const [showHelpModal, setShowHelpModal] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/SignIn" replace />;
  }

  return (
    <div>
      <main className="flex h-screen">
        {/* Barra lateral */}
        <Navbar isExpanded={isNavbarExpanded} setIsExpanded={setIsNavbarExpanded}>
          <NavbarItem icon={<LayoutDashboard size={20} />} text="Blog" to="/dashboard/blog" />
          <NavbarItem icon={<Calendar size={20} />} text="Dates" to="/dashboard/dates" />
          <NavbarItem icon={<Clock size={20} />} text="Availability" to="/dashboard/time" />
          <NavbarItem icon={<BarChart3 size={20} />} text="Sales" to="/dashboard/sales" />
          <NavbarItem icon={<Boxes size={20} />} text="Inventory" to="/dashboard/inventory" />

          <hr className="my-3" />
          <NavbarItem icon={<LifeBuoy size={20} />} text="Help/Settings" to="/dashboard/help" />
          
          <NavbarItem icon={<Store size={20} />} text="Config store" to="/dashboard/datos" />
        </Navbar>

        {/* Contenido principal */}
        <section className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </section>
      </main>

      {/* Botón de ayuda flotante */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 p-3 bg-blue1 text-white rounded-full shadow-lg
                 hover:bg-blue2 transition-colors duration-300 z-50"
      >
        <HelpCircle size={24} />
      </button>

      {/* Modal de ayuda */}
      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
