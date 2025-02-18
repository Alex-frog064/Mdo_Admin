import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  LifeBuoy,
  Calendar,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Navbar from "./Components/Navbar";
import NavbarItem from "./Components/NavbarItem";
import { NavLink } from "react-router-dom";

export default function App() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true); // Control del navbar

  return (
    <main className="flex h-screen">
      {/* Barra lateral */}
      <Navbar isExpanded={isNavbarExpanded} setIsExpanded={setIsNavbarExpanded}>
        <NavbarItem icon={<LayoutDashboard size={20} />} text="Blogs" to="/" />
        <NavbarItem icon={<BarChart3 size={20} />} text="Statistics" to="/statistics" />
        <NavbarItem icon={<UserCircle size={20} />} text="User" to="/profile" />

        <NavbarItem icon={<Boxes size={20} />} text="Inventory" to="/inventory" />
        <NavbarItem icon={<Package size={20} />} text="Orders" to="/orders" />
        <NavbarItem icon={<Calendar size={20} />} text="Dates" to="/dates" />
        <hr className="my-3" />
        <NavbarItem icon={<Settings size={20} />} text="Settings" to="/settings" />
        <NavbarItem icon={<LifeBuoy size={20} />} text="Help" to="/help" />
      </Navbar>

      {/* Contenido principal */}
      <section className="flex-1 overflow-auto bg-gray-100 p-6">
        <Outlet />
      </section>
    </main>
  );
}
