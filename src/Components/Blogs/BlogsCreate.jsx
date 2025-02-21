import { useState } from "react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import { useNavigate } from "react-router-dom"; // Para redirigir en caso de error

export default function BlogsCreate({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Cuidado"); // Valor inicial
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para redirigir en caso de error

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Guarda el archivo de imagen
    }
  };

  // Opciones de categoría
  const categories = ["Cuidado", "Paseos", "Alimentación"];

  const handleCreateBlog = async () => {
    setLoading(true);

    // Obtener el id_veterinario desde el localStorage
    const id_veterinario = localStorage.getItem("id_veterinario") || "7167"; // Cambia esto según tu lógica

    // Crear un objeto FormData para enviar la imagen
    const formData = new FormData();
    formData.append("titulo", title);
    formData.append("categoria", category);
    formData.append("id_veterinario", id_veterinario);
    formData.append("contenido", content);
    if (image) {
      formData.append("imagen", image); // Añade la imagen al FormData
    }

    try {
      // Usar axiosInstance para enviar la solicitud
      const response = await axiosInstance.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Especifica el tipo de contenido
        },
      });

      if (response.status === 201) { // 201 significa "Created"
        alert("Blog creado exitosamente");
        onClose(); // Cierra el modal después de crear
      } else {
        alert("Error al crear el blog");
      }
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[500px] bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-white rounded-full p-2 shadow-md z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Imagen del blog */}
        <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
          {image ? (
            <img
              src={URL.createObjectURL(image)} // Muestra la imagen seleccionada
              alt="Blog cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-gray-500 cursor-pointer">
              {/* Input oculto para subir la imagen */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {/* Ícono que activa el input */}
              <label
                htmlFor="image-upload"
                className="text-xl cursor-pointer"
              >
                📷
              </label>
            </div>
          )}
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {/* Título del modal */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Blog</h2>

          {/* Input para el título */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe el título"
            />
          </div>

          {/* Textarea para el contenido */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Escribe el contenido"
            />
          </div>

          {/* Menú desplegable para la categoría */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para crear blog */}
          <div className="flex justify-end">
            <button
              onClick={handleCreateBlog}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Creando..." : "Crear blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}