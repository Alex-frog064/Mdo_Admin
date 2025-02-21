import { useState, useEffect } from "react";
import axiosInstance from "../../../Conexion/AxiosInstance";

export default function AddProductModal({ isOpen, onClose, fetchProductos }) {
  const [product, setProduct] = useState({
    nombre: "",
    marca: "",
    mascota: "",
    edad: "",
    precio: "",
    stock: "",
    imagen: null,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("marca", product.marca);
      formData.append("mascota", product.mascota);
      formData.append("edad", product.edad);
      formData.append("precio", product.precio);
      formData.append("stock", product.stock);
      if (product.imagen) {
        formData.append("imagen", product.imagen);
      }
  
      await axiosInstance.post("/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      onClose(); // Solo cerramos el modal
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 max-w-2xl w-full flex relative">
        
        {/* Botón de Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 text-xl transition">
          ✖
        </button>

        {/* Contenedor izquierdo - Selector de imagen */}
        <div className="w-1/3 bg-gray-200 flex flex-col items-center justify-center p-8 rounded-l-lg">
          <label className="cursor-pointer flex flex-col items-center">
            {product.imagen ? (
              <img
                src={URL.createObjectURL(product.imagen)}
                alt="Vista previa"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            ) : (
              <span className="text-gray-700 text-5xl">📷</span>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Contenedor derecho - Formulario */}
        <div className="w-2/3 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400"
              onChange={handleChange}
              required
            />
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">$</span>
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                className="w-1/2 p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400"
                onChange={handleChange}
                required
              />
              <span className="ml-auto text-gray-700">Stock:</span>
              <input
                type="number"
                name="stock"
                className="w-1/4 p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400"
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="marca"
              placeholder="Marca"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mascota"
              placeholder="Tipo de Mascota (Perro, Gato, etc..)"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400"
              onChange={handleChange}
              required
            />
            <select
              name="edad"
              className="w-full p-2 rounded focus:ring-2 focus:ring-gray-400"
              onChange={handleChange}
              required
            >
              <option value="">Seleccione la edad</option>
              <option value="pequeño">Pequeño</option>
              <option value="joven">Joven</option>
              <option value="adulto">Adulto</option>
            </select>

            <button 
              type="submit" 
              className="w-full bg-black hover:text-black hover:bg-blue1 text-white py-2 rounded transition">
              Agregar producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
