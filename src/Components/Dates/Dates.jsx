import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TablaCitas() {
  const [busqueda, setBusqueda] = useState("");
  const [citas, setCitas] = useState([]);
  const [modal, setModal] = useState({ visible: false, id: null });
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("confirmada");
  const [citasProximas, setCitasProximas] = useState([]);
  const [citasHistorial, setCitasHistorial] = useState([]);
  const [verHistorial, setVerHistorial] = useState(false);
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
        
        // Separar citas en futuras e historial
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const citasFuturas = data.filter(cita => {
          const fechaCita = new Date(cita.fecha_cita);
          return fechaCita >= today;
        });

        const citasPasadas = data.filter(cita => {
          const fechaCita = new Date(cita.fecha_cita);
          return fechaCita < today;
        }).sort((a, b) => new Date(b.fecha_cita) - new Date(a.fecha_cita)); // Ordenar por fecha más reciente

        // Obtener citas próximas (7 días)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const proximasCitas = citasFuturas
          .filter(cita => {
            const fechaCita = new Date(cita.fecha_cita);
            return fechaCita <= nextWeek;
          })
          .sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));

        setCitasProximas(proximasCitas);
        setCitas(citasFuturas);
        setCitasHistorial(citasPasadas);
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

  const getCitasFiltradas = () => {
    return citas.filter((cita) => {
      const coincideBusqueda = 
        cita.id.toString().includes(busqueda) ||
        cita.fecha_cita.includes(busqueda) ||
        cita.razon.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideEstado = cita.estado === filtroEstado;
      
      return coincideBusqueda && coincideEstado;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue1"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-8">
      {/* Panel principal */}
      <div className="flex-1 bg-gradient-to-b from-blue1/5 to-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-blue1">Citas Programadas</h2>
            <p className="text-gray-600 text-sm mt-1">Gestiona tus citas médicas</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVerHistorial(!verHistorial)}
              className={`px-4 py-2 rounded-xl transition-all duration-200
                ${verHistorial 
                  ? "bg-blue1 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {verHistorial ? "Ver Próximas" : "Ver Historial"}
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cita..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border-0 focus:ring-2 focus:ring-blue1 bg-white shadow-sm w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue1" />
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setFiltroEstado("confirmada")}
              className={`pb-4 px-1 relative font-medium text-sm transition-colors duration-200
                ${filtroEstado === "confirmada" ? 'text-blue1' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Próximamente
              {filtroEstado === "confirmada" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue1 rounded-full" />
              )}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue1/10 text-blue1">
                {citas.filter(cita => cita.estado === "confirmada").length}
              </span>
            </button>

            <button
              onClick={() => setFiltroEstado("pendiente")}
              className={`pb-4 px-1 relative font-medium text-sm transition-colors duration-200
                ${filtroEstado === "pendiente" ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pendientes
              {filtroEstado === "pendiente" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
              )}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700">
                {citas.filter(cita => cita.estado === "pendiente").length}
              </span>
            </button>

            <button
              onClick={() => setFiltroEstado("rechazada")}
              className={`pb-4 px-1 relative font-medium text-sm transition-colors duration-200
                ${filtroEstado === "rechazada" ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Rechazadas
              {filtroEstado === "rechazada" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700">
                {citas.filter(cita => cita.estado === "rechazada").length}
              </span>
            </button>
          </nav>
        </div>

        <div className="overflow-hidden rounded-xl border border-sky-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-100 text-sky-900">
                <th className="px-6 py-4 font-medium text-left">ID</th>
                <th className="px-6 py-4 font-medium text-left">Fecha</th>
                <th className="px-6 py-4 font-medium text-left">Hora</th>
                <th className="px-6 py-4 font-medium text-left">Razón</th>
                <th className="px-6 py-4 font-medium text-center">ID Mascota</th>
                <th className="px-6 py-4 font-medium text-center">Estado</th>
                <th className="px-6 py-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {(verHistorial ? citasHistorial : getCitasFiltradas()).map((cita) => (
                <tr key={cita.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                  <td className="px-6 py-4">{cita.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-sky-900">{cita.fecha_cita}</span>
                  </td>
                  <td className="px-6 py-4 text-sky-800">{cita.hora_cita}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 line-clamp-1">{cita.razon}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700">
                      {cita.mascota}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={cita.estado}
                      onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-150
                        ${cita.estado === "pendiente" 
                          ? "bg-amber-50 text-amber-700 border-amber-200" 
                          : cita.estado === "confirmada"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="confirmada">✅ Aceptada</option>
                      <option value="rechazada">❌ Rechazada</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="px-3 py-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors duration-150">
                        Ver detalles
                      </button>
                      <button 
                        onClick={() => setModal({ visible: true, id: cita.id })}
                        className="px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(verHistorial ? citasHistorial : getCitasFiltradas()).length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center text-gray-500">
                      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-lg font-medium">
                        {verHistorial ? "No hay citas anteriores" : `No hay citas ${filtroEstado}s`}
                      </p>
                      <p className="text-sm text-gray-400">
                        {verHistorial 
                          ? "No se encontraron citas en el historial"
                          : "No se encontraron citas en esta categoría"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel derecho - Citas próximas */}
      {!verHistorial && (
        <div className="w-80 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-blue1 mb-4">Próximas Citas</h3>
          <div className="space-y-4">
            {citasProximas.length > 0 ? (
              citasProximas.map((cita) => (
                <div 
                  key={cita.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue1/5 to-blue2/5 border border-blue1/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-blue1">
                        {new Date(cita.fecha_cita).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{cita.hora_cita}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium
                      ${cita.estado === 'confirmada' ? 'bg-blue1/10 text-blue1' : 
                        cita.estado === 'pendiente' ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600'}`}>
                      {cita.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{cita.razon}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue1/5 rounded-lg text-xs text-blue1">
                      ID Mascota: {cita.mascota}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay citas próximas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {modal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal({ visible: false, id: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(modal.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
