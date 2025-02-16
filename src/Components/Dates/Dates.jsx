import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const citasIniciales = [
  { id: 1, idVeterinario: 101, idUsuario: 201, fecha: "2025-02-20", inicio: "10:00", fin: "10:30", estado: "Pendiente" },
  { id: 2, idVeterinario: 102, idUsuario: 202, fecha: "2025-02-21", inicio: "11:00", fin: "11:30", estado: "Aceptada" },
  { id: 3, idVeterinario: 103, idUsuario: 203, fecha: "2025-02-22", inicio: "12:00", fin: "12:30", estado: "Rechazada" },
];

export default function TablaCitas() {
  const [busqueda, setBusqueda] = useState("");
  const [citas, setCitas] = useState(citasIniciales);
  const [modal, setModal] = useState({ visible: false, id: null });

  const handleEstadoChange = (id, nuevoEstado) => {
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === id ? { ...cita, estado: nuevoEstado } : cita
      )
    );
  };

  const handleEliminar = (id) => {
    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
    setModal({ visible: false, id: null });
  };

  const citasFiltradas = citas.filter(
    (cita) =>
      cita.id.toString().includes(busqueda) ||
      cita.idVeterinario.toString().includes(busqueda) ||
      cita.idUsuario.toString().includes(busqueda) ||
      cita.fecha.includes(busqueda) ||
      cita.estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Citas</h2>
        <button className="bg-green-500 text-white px-3 py-1 rounded">Añadir nueva</button>
      </div>
      <div className="flex items-center gap-2 mb-3 border rounded-lg p-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-1 w-full outline-none text-gray-700 bg-transparent"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-gray-700 border-collapse">
          <thead className="text-left bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Veterinario</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Hora Inicio</th>
              <th className="p-3">Hora Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas.map((cita) => (
                <tr key={cita.id} className="border-b text-sm hover:bg-gray-50">
                  <td className="p-3">{cita.id}</td>
                  <td className="p-3">{cita.idVeterinario}</td>
                  <td className="p-3">{cita.idUsuario}</td>
                  <td className="p-3">{cita.fecha}</td>
                  <td className="p-3">{cita.inicio}</td>
                  <td className="p-3">{cita.fin}</td>
                  <td className="p-3">
                    <select
                      value={cita.estado}
                      onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white cursor-pointer outline-none 
                        ${cita.estado === "Pendiente" ? "bg-yellow-500" : cita.estado === "Aceptada" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <option value="Pendiente" className="text-black">Pendiente</option>
                      <option value="Aceptada" className="text-black">Aceptada</option>
                      <option value="Rechazada" className="text-black">Rechazada</option>
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
      {modal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar esta cita?</p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleEliminar(modal.id)}
              >Sí, eliminar</button>
              <button 
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModal({ visible: false, id: null })}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
