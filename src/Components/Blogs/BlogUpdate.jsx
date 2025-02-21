import { useState } from "react";

export default function BlogUpdate({ blog, onClose }) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content || "");
  const [category, setCategory] = useState(blog.category);
  const [image, setImage] = useState(blog.image);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Opciones de categoría
  const categories = ["Cuidado", "Paseos", "Alimentación"];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[600px] bg-white rounded-lg overflow-hidden shadow-2xl">
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
        <div className="w-full h-64 bg-gray-200 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Blog cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-gray-500">
              <span className="text-xl">📷</span>
            </div>
          )}
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {/* Título del modal */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Actualizar Blog</h2>

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

          {/* Input para subir imagen */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Botón para guardar cambios */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                // Aquí puedes agregar la lógica para guardar los cambios
                console.log("Guardar cambios:", { title, content, category, image });
                onClose(); // Cierra el modal después de guardar
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}