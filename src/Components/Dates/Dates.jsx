import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TablaCitas() {
  const [busqueda, setBusqueda] = useState("");
  const [citas, setCitas] = useState([]);
  const [modal, setModal] = useState({ visible: false, id: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVeterinario = async () => {
      const token = localStorage.getItem("jwt");
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      const usuarioId = usuarioData?.veterinario?.id;

      if (!token || !usuarioId) {
        console.warn("⚠️ No se encontró token o ID en localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api-mascoticobereal.onrender.com/citas/veterinario/${usuarioId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("jwt");
          navigate("/SignIn");
          return;
        }

        const data = await response.json();
        setCitas(data);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, [navigate]);

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`https://api-mascoticobereal.onrender.com/disponibilidad/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      setModal({ visible: false, id: null });
    } catch (error) {
      console.error("❌ Error al eliminar la cita:", error);
      alert("No se pudo eliminar la cita. Verifica los permisos del servidor.");
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`https://api-mascoticobereal.onrender.com/citas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }   
    } catch (error) {
      window.location.reload(); // che adrian quita el error
      
    }
  };

  const citasFiltradas = citas.filter(
    (cita) =>
      cita.id.toString().includes(busqueda) ||
      cita.id_veterinario.toString().includes(busqueda) ||
      cita.fecha.includes(busqueda)
  );

  if (loading) {
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Citas</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-gray-700 border-collapse">
          <thead className="text-left bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3">ID</th>
              
              <th className="p-3">Fecha cita</th>
              <th className="p-3">Hora cita</th>
              <th className="p-3">Razon</th>
              <th className="p-3 text-center">Id Mascotas</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas.map((cita) => (
                <tr key={cita.id} className="border-b text-sm hover:bg-gray-50">
                  <td className="p-3">{cita.id}</td>
                  <td className="p-3">{cita.fecha_cita}</td>
                  <td className="p-3">{cita.hora_cita}</td>
                  <td className="p-3">{cita.razon}</td>
                  <td className="p-3">{cita.mascota}</td>
                  <td className="p-3">
                  <select
                      value={cita.estado} 
                      onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white cursor-pointer outline-none 
                        ${cita.estado === "pendiente" ? "bg-yellow-500" : 
                          cita.estado === "confirmada" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <option value="pendiente" className="text-black">Pendiente</option>
                      <option value="confirmada" className="text-black">Aceptada</option>
                      <option value="rechazada" className="text-black">Rechazada</option>
                  </select>
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button className="text-blue-500 hover:underline">Ver</button>
                    <button 
                      className="text-red-500 hover:underline"
                      onClick={() => setModal({ visible: true, id: cita.id })}
                    >Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-400">
                  No se encontraron citas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
