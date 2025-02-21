import { useState, useEffect } from "react";
import {ImageUp} from "lucide-react"

export default function UpdateProduct({ isOpen, onClose, productData }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    petType: "",
    age: "",
    image: null,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      if (productData) {
        setProduct(productData);
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto actualizado:", product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full flex relative">
        {/* Botón de Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-xl transition">✖</button>

        {/* Contenedor izquierdo - Imagen */}
        <div className="w-1/3 bg-gray-200 flex items-center justify-center p-8 rounded-l-lg relative">
          <label htmlFor="imageUpload" className="cursor-pointer">
            {product.image ? (
              <img src={product.image} alt="Producto" className="w-full h-full object-cover rounded" />
            ) : (
              <span className="text-gray-700 text-5xl"><ImageUp/></span>
            )}
          </label>
          <input 
            type="file" 
            id="imageUpload" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange} 
          />
        </div>

        {/* Contenedor derecho - Formulario */}
        <div className="w-2/3 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actualizar Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
              onChange={handleChange}
              value={product.name}
              required
            />

            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">$</span>
              <input
                type="number"
                name="price"
                placeholder="Precio"
                className="w-1/2 p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
                onChange={handleChange}
                value={product.price}
                required
              />
              <span className="ml-auto text-gray-700">Stock:</span>
              <input
                type="number"
                name="stock"
                className="w-1/4 p-2 bg-stone-300 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
                onChange={handleChange}
                value={product.stock}
                required
              />
            </div>

            <input
              type="text"
              name="brand"
              placeholder="Marca"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
              onChange={handleChange}
              value={product.brand}
              required
            />
            <input
              type="text"
              name="petType"
              placeholder="Mascota"
              className="w-full p-2 bg-gray-100 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
              onChange={handleChange}
              value={product.petType}
              required
            />
            <select
              name="age"
              className="w-full p-2 rounded focus:ring-2 focus:ring-gray-400 shadow-md"
              onChange={handleChange}
              value={product.age}
              required
            >
              <option value="">Seleccione la edad</option>
              <option value="pequeños">Pequeños</option>
              <option value="jovenes">Jóvenes</option>
              <option value="adultos">Adultos</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue1 hover:bg-teal-900 hover:text-black text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Actualizar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
