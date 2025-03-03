import { useState } from "react";
import { X, Save, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import { useNavigate } from "react-router-dom";

export default function BlogsCreate({ isOpen, onClose, onBlogCreated }) {
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "Consejos de cuidado",
    contenido: "",
    imagen: null, // Guardará el archivo de imagen
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen: file, // Guardamos el archivo en formData.imagen
      }));
      setPreviewImage(URL.createObjectURL(file)); // Para la previsualización
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("usuario"));

      // Crear FormData para enviar imagen y datos juntos
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("categoria", formData.categoria);
      formDataToSend.append("contenido", formData.contenido);
      formDataToSend.append("id_veterinario", userData?.veterinario?.id?.toString());

      if (formData.imagen) {
        formDataToSend.append("imagen", formData.imagen); // Agregar imagen al FormData
      }

      const response = await axiosInstance.post("/blogs", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        setModalInfo({ type: "success", message: "¡Blog creado exitosamente!" });
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          onBlogCreated();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al crear el blog:", error);
      setModalInfo({
        type: "error",
        message: error.response?.data?.message || "Error al crear el blog. Intenta de nuevo.",
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

      {/* Modal de éxito/error */}
      {showModal && (
        <div
          className={`absolute top-4 right-4 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3
          ${modalInfo.type === "success" ? "bg-emerald-100" : "bg-red-100"}`}
        >
          {modalInfo.type === "success" ? (
            <CheckCircle className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-500" size={20} />
          )}
          <p className={modalInfo.type === "success" ? "text-emerald-700" : "text-red-700"}>
            {modalInfo.message}
          </p>
        </div>
      )}

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
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-blue1">
                  <ImageIcon size={40} />
                  <p className="text-sm">Subir imagen</p>
                </div>
              )}
            </label>
            <input type="file" id="blogImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
              value={formData.categoria}
            >
              <option value="Consejos de cuidado">Consejos de cuidado</option>
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
              className="w-full bg-gradient-to-r from-blue1 to-blue2 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <span>Creando...</span> : <><Save size={20} /><span>Crear Blog</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
