import React, { useState } from "react";
import { FaEdit, FaSignOutAlt, FaLock, FaUnlock, FaPlus, FaCamera } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    grado_estudio: "Licenciatura en Veterinaria",
    especialidad: "Cirugía Animal",
    email: "juan.perez@email.com",
    contraseña: "********",
    nuevaContraseña: "",
    confirmarContraseña: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col sm:flex-row">
        {/* Contenedor izquierdo para la imagen */}
        <div className="w-full sm:w-1/3 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r pr-6 pb-6 sm:pb-0">
          <div className="relative w-32 h-32 bg-gray-300 rounded-full overflow-hidden shadow-lg">
            <img src="../assets/fondo.png" alt="Profile" className="w-full h-full object-cover" />
            <button className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600">
              <FaCamera />
            </button>
          </div>
          <button className="border-2 border-black text-black rounded-full px-4 py-2 mt-4 flex items-center gap-2 font-semibold hover:bg-blue-500 hover:text-white">
            <FaPlus /> Agregar archivo
          </button>
        </div>

        {/* Contenedor derecho para los datos */}
        <div className="w-full sm:w-2/3 pl-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Información General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(formData).map((field, index) => (
              <div key={index} className="relative">
                <label className={`block text-sm font-medium mb-1 ${isEditing ? "text-gray-700" : "text-gray-500"}`}>
                  {field.replace("_", " ")}
                </label>
                <div className="relative">
                  <input
                    type={field.includes("Contraseña") ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-lg pr-10 transition-all duration-300 shadow-inner ${isEditing ? "bg-white text-gray-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                  />
                  <span className={`absolute right-3 top-3 ${isEditing ? "text-gray-600" : "text-gray-400"}`}>
                    {isEditing ? <FaUnlock /> : <FaLock />}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
            <button 
              className="border-2 border-black text-black rounded-full px-4 py-2 flex items-center gap-2 font-semibold hover:bg-red-600 hover:text-white"
              onClick={() => navigate("/SignOn")}
            >
              <FaSignOutAlt /> Cerrar cuenta
            </button>
            <button className="border-2 border-black text-black rounded-full px-4 py-2 flex items-center gap-2 font-semibold hover:bg-blue-500 hover:text-white" onClick={toggleEditing}>
              <FaEdit /> {isEditing ? "Guardar" : "Editar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
