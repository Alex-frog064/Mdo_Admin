import './App.css';
import { Outlet } from 'react-router-dom';
import { LifeBuoy, Calendar, Boxes, Package, UserCircle, BarChart3, LayoutDashboard, Settings } from 'lucide-react';
import Navbar from './Components/Navbar';
import NavbarItem from './Components/NavbarItem';

export default function App() {
  return (
    <main className="App">
      <Navbar>
        <NavbarItem icon={<LayoutDashboard size={20} />} text="Blogs"  />
        <NavbarItem icon={<BarChart3 size={20} />} text="Statistics" active />
        <NavbarItem icon={<UserCircle size={20} />} text="Users" />
        <NavbarItem icon={<Boxes size={20} />} text="Inventory" />
        <NavbarItem icon={<Package size={20} />} text="Orders" />
        <NavbarItem icon={<Calendar size={20} />} text="Dates" />
        <hr className="my-3" />
        <NavbarItem icon={<Settings size={20} />} text="Settings" />
        <NavbarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Navbar>
      <Outlet /> {/* Renderiza las rutas hijas */}
    </main>
  );
}
