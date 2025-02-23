import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaSignOutAlt, FaLock, FaUnlock, FaPlus, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Conexion/AxiosInstance";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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
      formData.append('imagen', file);

      const vetId = getVetId();
      const response = await axiosInstance.put(`/veterinario/${vetId}/imagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Imagen actualizada correctamente");
        // Actualizar datos en localStorage si es necesario
        const userData = JSON.parse(localStorage.getItem('usuario'));
        userData.veterinario.imagen = response.data.imagen;
        localStorage.setItem('usuario', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      setError("Error al actualizar la imagen de perfil");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex">
        {/* Panel izquierdo azul pastel */}
        <div className="w-1/3 bg-sky-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8 group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div 
              onClick={handleImageClick}
              className="w-32 h-32 bg-sky-200 rounded-full overflow-hidden cursor-pointer relative group"
            >
              <img
                src={imagePreview || formData.imagen || "../assets/fondo.png"}
                alt="Profile"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-sky-900 mb-4">
            {formData.nombre || "Información del Perfil"}
          </h2>
          <p className="text-sky-700 text-sm">
            Gestiona tu información personal
          </p>
        </div>

        {/* Panel derecho con formulario */}
        <div className="w-2/3 p-12 bg-white">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(formData).map((field, index) => (
              <div key={index} className="relative">
                <label className={`block text-sm font-medium mb-1 ${isEditing ? "text-sky-900" : "text-sky-600"}`}>
                  {field.replace("_", " ")}
                </label>
                <div className="relative">
                  <input
                    type={field.includes("contraseña") ? "password" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg pr-10 transition-all duration-300 
                      ${isEditing 
                        ? "bg-white border border-sky-100 focus:ring-2 focus:ring-sky-100 focus:border-sky-300" 
                        : "bg-sky-50 text-sky-700 cursor-not-allowed"}`}
                  />
                  <span className={`absolute right-3 top-3 ${isEditing ? "text-sky-500" : "text-sky-400"}`}>
                    {isEditing ? <FaUnlock /> : <FaLock />}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button 
              className="px-6 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => navigate("/SignIn")}
            >
              <FaSignOutAlt /> 
              Cerrar cuenta
            </button>
            <button 
              className={`px-8 py-2 rounded-lg transition-colors flex items-center gap-2
                ${isEditing 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-sky-400 text-white hover:bg-sky-500"}`}
              onClick={toggleEditing}
              disabled={loading}
            >
              <FaEdit />
              {isEditing ? "Guardar cambios" : "Editar"}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-2">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;
