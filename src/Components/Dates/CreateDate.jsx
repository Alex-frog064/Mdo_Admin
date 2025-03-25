import { useState } from "react";
import { X, Save, Calendar, Clock, User, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateDate({ isOpen, onClose, onDateCreated }) {
  const [formData, setFormData] = useState({
    fecha_cita: "",
    hora_cita: "",
    razon: "",
    mascota: "1", // Valor por defecto: perro
    nombreCliente: "",
    cliente: "",
    estado: "pendiente"
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const tiposMascota = [
    { id: "1", nombre: "Perro" },
    { id: "3", nombre: "Gato" },
    { id: "4", nombre: "Reptil" },
    { id: "5", nombre: "Otros" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      const token = localStorage.getItem("jwt");

      const citaData = {
        id_veterinario: usuarioData?.veterinario?.id,
        fecha_cita: formData.fecha_cita,
        hora_cita: formData.hora_cita,
        razon: formData.razon,
        mascota: parseInt(formData.mascota),
        cliente: parseInt(formData.cliente),
        estado: "pendiente"
      };

      // Guardar nombre del cliente en localStorage
      const clientesGuardados = JSON.parse(localStorage.getItem("clientesCitas") || "{}");
      clientesGuardados[citaData.cliente] = formData.nombreCliente;
      localStorage.setItem("clientesCitas", JSON.stringify(clientesGuardados));

      const response = await fetch("https://api-mascoticobereal.onrender.com/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(citaData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      setModalInfo({ type: "success", message: "¡Cita creada exitosamente!" });
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        onDateCreated();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al crear la cita:", error);
      setModalInfo({
        type: "error",
        message: "Error al crear la cita. Intenta de nuevo."
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue1/20 to-blue2/20 backdrop-blur-[6px]" />

      <div className="bg-white/90 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all duration-300 group"
        >
          <X className="text-gray-400 group-hover:text-blue1" size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Cita</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue1" size={20} />
                <input
                  type="date"
                  name="fecha_cita"
                  className="w-full pl-12 p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue1" size={20} />
                <input
                  type="time"
                  name="hora_cita"
                  className="w-full pl-12 p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <PawPrint className="absolute left-4 top-1/2 -translate-y-1/2 text-blue1" size={20} />
                <select
                  name="mascota"
                  className="w-full pl-12 p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                  onChange={handleChange}
                  value={formData.mascota}
                  required
                >
                  {tiposMascota.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue1" size={20} />
                <input
                  type="number"
                  name="cliente"
                  placeholder="ID Cliente"
                  className="w-full pl-12 p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <User className="absolute left-4 top-6 text-blue1" size={20} />
              <input
                type="text"
                name="nombreCliente"
                placeholder="Nombre del Cliente"
                className="w-full pl-12 p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="razon"
              placeholder="Razón de la cita..."
              className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 h-32 resize-none"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue1 to-blue2 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <span>Creando...</span> : <><Save size={20} /><span>Crear Cita</span></>}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div
          className={`absolute top-4 right-4 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3
          ${modalInfo.type === "success" ? "bg-emerald-100" : "bg-red-100"}`}
        >
          <p className={modalInfo.type === "success" ? "text-emerald-700" : "text-red-700"}>
            {modalInfo.message}
          </p>
        </div>
      )}
    </div>
  );
} 