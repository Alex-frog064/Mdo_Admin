import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaSignOutAlt, FaLock, FaUnlock, FaPlus, FaCamera, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Conexion/AxiosInstance";
import DeleteAccountModal from "./DeleteAccountModal";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Obtener el ID del veterinario del localStorage
  const getVetId = () => {
    const userData = JSON.parse(localStorage.getItem('usuario'));
    return userData?.veterinario?.id;
  };

  useEffect(() => {
    const fetchVeterinario = async () => {
      const vetId = getVetId();
      if (!vetId) {
        setError("No se encontró ID del veterinario");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/veterinario/${vetId}`);
        setFormData(response.data);
        setError("");
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const vetId = getVetId();
    if (!vetId) {
      setError("No se encontró ID del veterinario");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/veterinario/${vetId}`, formData);
      
      if (response.status === 200) {
        setSuccessMessage("Datos actualizados correctamente");
        setIsEditing(false);
        // Actualizar datos en localStorage si es necesario
        const userData = JSON.parse(localStorage.getItem('usuario'));
        userData.veterinario = { ...userData.veterinario, ...formData };
        localStorage.setItem('usuario', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      setError("Error al actualizar los datos del perfil");
    } finally {
      setLoading(false);
      // El mensaje de éxito desaparecerá después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      // Si estamos guardando los cambios
      handleSubmit();
    } else {
      // Si estamos activando el modo edición
      setIsEditing(true);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError("Por favor selecciona una imagen válida");
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Preparar para subir
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('imagen_perfil', file);

      const vetId = getVetId();
      const response = await axiosInstance.put(`/veterinario/${vetId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Imagen actualizada correctamente");
        setFormData(prevData => ({
          ...prevData,
          imagen_perfil: response.data.imagen_perfil
        }));
        
        // Actualizar datos en localStorage
        const userData = JSON.parse(localStorage.getItem('usuario'));
        if (userData && userData.veterinario) {
          userData.veterinario.imagen_perfil = response.data.imagen_perfil;
          localStorage.setItem('usuario', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      setError("Error al actualizar la imagen de perfil. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    const vetId = getVetId();
    try {
      await axiosInstance.delete(`/veterinario/${vetId}`);
      localStorage.removeItem('jwt');
      localStorage.removeItem('usuario');
      navigate("/SignIn");
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      setError("Error al eliminar la cuenta");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue1"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex">
        {/* Panel izquierdo */}
        <div className="w-1/3 bg-gradient-to-br from-blue1/10 to-blue2/10 p-12 flex flex-col items-center justify-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg mb-2">
              <img
                src={formData.imagen_perfil || "/assets/default-profile.png"}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/assets/default-profile.png";
                }}
              />
              <div
                onClick={handleImageClick}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center 
                         transition-all duration-300 cursor-pointer"
              >
                <FaCamera className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-600 mt-2">ID: {getVetId()}</p>
          </div>
          <h2 className="text-2xl font-semibold text-blue1 mb-4 mt-4">
            {formData.nombre || "Información del Perfil"}
          </h2>
          <p className="text-gray-600 text-sm">
            Gestiona tu información personal
          </p>
        </div>

        {/* Panel derecho con formulario */}
        <div className="w-2/3 p-12 bg-white">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-xl">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(formData).map(([field, value]) => {
              // No mostrar campos específicos
              if (field === 'id' || field === 'imagen' || field === 'imagen_perfil') return null;

              return (
                <div key={field} className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                  </label>
                  <div className="relative">
                    <input
                      type={field.includes("contraseña") ? "password" : "text"}
                      name={field}
                      value={value || ""}
                      onChange={handleChange}
                      disabled={!isEditing || field === 'id'}
                      className={`w-full p-4 rounded-xl transition-all duration-300 
                        ${isEditing 
                          ? "bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0" 
                          : "bg-gray-100 text-gray-700 cursor-not-allowed"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors 
                       flex items-center gap-2"
            >
              <FaTrash />
              Eliminar cuenta
            </button>

            <div className="flex gap-4">
              <button 
                className="px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors 
                         flex items-center gap-2"
                onClick={() => navigate("/SignIn")}
              >
                <FaSignOutAlt />
                Cerrar sesión
              </button>
              <button 
                className={`px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2
                  ${isEditing 
                    ? "bg-gradient-to-r from-blue1 to-blue2 text-white hover:shadow-lg hover:scale-[1.02]" 
                    : "bg-blue1 text-white hover:bg-blue2"}`}
                onClick={toggleEditing}
                disabled={loading}
              >
                <FaEdit />
                {isEditing ? "Guardar cambios" : "Editar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfileUpdate;
