import { useState, useEffect } from "react";
import { Search, Trash } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import AddProductModal from "./AddProducts";
import UpdateProduct from "./EditarProducts";

export default function ProductCard() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productos, setProductos] = useState([]);

  // Función para obtener los primeros 10 productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get("/productos?page=1&limit=10");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/productos/${id}`);
      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Barra de búsqueda y botón de agregar */}
      <div className="flex justify-between items-center w-2/3 mb-4">
        <div className="relative w-3/4">
          <input
            type="text"
            placeholder="Buscar por id..."
            className="w-full p-3 pl-4 pr-10 rounded-full bg-gray-800 shadow-md"
          />
          <Search className="absolute right-3 top-3 text-gray-500" size={20} />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="hover:text-white hover:bg-blue1 text-white rounded-full px-6 py-2 shadow-md bg-blue2"
        >
          Agregar Producto
        </button>
      </div>

      {showModal && <AddProductModal isOpen={showModal} onClose={() => setShowModal(false)} />}

      {/* Mostrar productos */}
      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        productos.map((producto) => (
          <div key={producto.id} className="rounded-lg p-4 flex shadow-lg bg-white w-2/3 relative mb-4">
            <img
              src={producto.imagen || "https://via.placeholder.com/150"}
              alt={producto.nombre}
              className="w-40 h-40 object-cover rounded-md"
            />
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold text-blue1">{producto.nombre}</h2>
              <h3 className="text-blue1">ID: {producto.id}</h3>
              <div className="flex flex-col items-start gap-2 my-2">
                <span className="border px-3 py-1 text-blue1 rounded-lg shadow-sm">{producto.marca}</span>
                <span className="border px-3 py-1 text-blue1 rounded-lg shadow-sm">{producto.mascota}</span>
                <div className="flex gap-2">
                  <span className="border px-3 py-1 text-blue1 rounded-lg shadow-sm">{producto.edad}</span>
                  <span className="border px-3 py-1 text-blue1 rounded-lg shadow-sm">{producto.stock}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end ml-4">
              <Trash
                className="text-gray-400 cursor-pointer"
                size={28}
                onClick={() => handleDelete(producto.id)}
              />
              <span className="text-2xl font-bold">${producto.precio}</span>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="bg-blue1 hover:bg-blue2 px-4 py-2 rounded-lg text-white shadow-md"
              >
                Actualizar Producto
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
