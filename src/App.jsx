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
  Settings,
  Clock
} from "lucide-react";
import Navbar from "./Components/Navbar";
import NavbarItem from "./Components/NavbarItem";

export default function App() {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const isAuthenticated = !!localStorage.getItem("jwt");

  if (!isAuthenticated) {
    return <Navigate to="/SignIn" replace />;
  }

  return (
    <main className="flex h-screen">
      {/* Barra lateral */}
      <Navbar isExpanded={isNavbarExpanded} setIsExpanded={setIsNavbarExpanded}>
        <NavbarItem icon={<LayoutDashboard size={20} />} text="Blog" to="/dashboard/blog" />
        <NavbarItem icon={<Calendar size={20} />} text="Dates" to="/dashboard/dates" />
        <NavbarItem icon={<UserCircle size={20} />} text="User" to="/dashboard/profile" />
        <NavbarItem icon={<Clock size={20} />} text="Availability" to="/dashboard/time" />
        <NavbarItem icon={<BarChart3 size={20} />} text="Sales" to="/dashboard/sales" />
        <NavbarItem icon={<Boxes size={20} />} text="Inventory" to="/dashboard/inventory" />

        <hr className="my-3" />
        <NavbarItem icon={<Settings size={20} />} text="Settings" to="/dashboard/settings" />
        <NavbarItem icon={<LifeBuoy size={20} />} text="Help" to="/dashboard/help" />
      </Navbar>

      {/* Contenido principal */}
      <section className="flex-1 overflow-auto bg-gray-100 p-6">
        <Outlet />
      </section>
    </main>
  );
}
