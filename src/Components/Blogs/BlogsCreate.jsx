import { useState } from "react";
import { X, Upload, Save, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import { useNavigate } from "react-router-dom"; // Para redirigir en caso de error

export default function BlogsCreate({ isOpen, onClose }) {
  const [blog, setBlog] = useState({
    titulo: "",
    categoria: "Cuidado",
    contenido: "",
    imagen: null
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate(); // Para redirigir en caso de error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setBlog(prev => ({ ...prev, imagen: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Obtener el id_veterinario desde el localStorage
    const idVeterinario = localStorage.getItem("usuario"); // Obtienes el id desde localStorage
    if (idVeterinario) {
      const url = `/disponibilidad/veterinario/${idVeterinario}`; // Usas el id para formar la URL
      try {
        const response = await axiosInstance.get(url); // Realizas la petición GET
        console.log(response.data); // Muestras la respuesta en la consola
      } catch (error) {
        console.error("Error en la consulta:", error); // Muestras el error si ocurre
      }
    } else {
      console.error("No se encontró el id del veterinario en el localStorage."); // Si no se encuentra el id
    }

    try {
      const formData = new FormData();
      Object.entries(blog).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axiosInstance.post("/blogs", formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);

      // Mostrar detalles del error
      if (error.response) {
        console.log("Respuesta del servidor:", error.response.data);
        alert(`Error: ${error.response.data.message || "Datos incorrectos"}`);
      } else if (error.request) {
        alert("No se recibió respuesta del servidor");
      } else {
        alert("Error al enviar la solicitud");
      }

      // Manejar errores de autenticación
      if (error.response && error.response.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        navigate("/SignIn"); // Redirige al usuario a la página de inicio de sesión
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue1/20 to-blue2/20 backdrop-blur-[6px]"/>
      
      <div className="bg-white/90 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 flex relative overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all duration-300 group z-10"
        >
          <X className="text-gray-400 group-hover:text-blue1" size={24} />
        </button>

        {/* Contenedor izquierdo - Imagen */}
        <div className="w-1/3 bg-gradient-to-br from-blue1/10 to-blue2/10 p-8 flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/80 shadow-inner relative">
            <label 
              htmlFor="blogImage" 
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors"
            >
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ImageIcon size={40} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-blue1">
                  <ImageIcon size={40} />
                  <p className="text-sm">Subir imagen</p>
                </div>
              )}
            </label>
            <input 
              type="file"
              id="blogImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Contenedor derecho - Formulario */}
        <div className="w-2/3 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Blog</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="titulo"
              placeholder="Título del blog"
              className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
              onChange={handleChange}
              required
            />

            <select
              name="categoria"
              className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
              onChange={handleChange}
              value={blog.categoria}
            >
              <option value="Cuidado">Cuidado</option>
              <option value="Alimentación">Alimentación</option>
              <option value="Entrenamiento">Entrenamiento</option>
              <option value="Salud">Salud</option>
            </select>

            <textarea
              name="contenido"
              placeholder="Contenido del blog..."
              className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 h-40 resize-none"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue1 to-blue2 text-white py-4 rounded-xl
                       flex items-center justify-center gap-2 transition-all duration-300
                       hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"/>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Crear Blog</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}