import { useState, useEffect } from "react";
import { Search, Trash, Plus } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import AddProductModal from "./AddProducts";
import UpdateProduct from "./EditarProducts";
import DeleteConfirmModal from "./DeleteConfirmModal";
export default function ProductCard() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ""
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/productos?page=1&limit=10");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    console.log("Productos actuales:", productos);
  }, [productos]);

  const handleDelete = async (id, nombre) => {
    setDeleteModal({
      isOpen: true,
      productId: id,
      productName: nombre
    });
  };
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/productos/${deleteModal.productId}`);
      setProductos(productos.filter((producto) => producto.id !== deleteModal.productId));
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };
  const handleSearch = async () => {
    setLoading(true);
    if (!searchId) {
      fetchProductos();
      return;
    }
    try {
      const response = await axiosInstance.get(`/productos/${searchId}`);
      setProductos([response.data]);
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };
  const getMascotaName = (mascotaId) => {
    const mascotaTypes = {
      "1": "Perro",
      "3": "Gato",
      "4": "Roedores",
      "5": "Reptiles"
    };
    return mascotaTypes[mascotaId] || mascotaId;
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue1"></div>
      </div>
    );
  }
  return (
    <div className="p-8 flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Header y búsqueda */}
      <div className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-bold text-blue1 mb-6">Inventario de Productos</h1>
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Buscar producto por ID..."
              className="w-full p-4 pl-5 pr-12 rounded-xl bg-white border border-gray-200 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue1 focus:border-transparent
                       text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="text-blue1" size={20} />
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue2 hover:bg-blue1 text-white rounded-xl px-6 py-4 
                     shadow-md transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            Agregar Producto
          </button>
        </div>
      </div>
      {showModal && <AddProductModal isOpen={showModal} onClose={() => setShowModal(false)} />}

      {/* Grid de productos */}
      <div className="w-full max-w-6xl grid grid-cols-1 gap-6">
        {productos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
          </div>
        ) : (
          productos.map((producto) => (
            <div 
              key={producto.id} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex gap-6">
                {/* Imagen del producto */}
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={producto.imagen || "https://via.placeholder.com/150"}
                    alt={producto.nombre}
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-blue1 mb-1">{producto.nombre}</h2>
                      <p className="text-gray-500">ID: {producto.id}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(producto.id, producto.nombre)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash className="text-red-400 hover:text-red-600" size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue1 rounded-lg text-sm">
                        {producto.marca}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue1 rounded-lg text-sm">
                        {getMascotaName(producto.mascota)}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue1 rounded-lg text-sm">
                        {producto.edad}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Stock:</span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg">
                          {producto.stock} unidades
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue1">
                        ${producto.precio}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        if (producto) {
                          setSelectedProduct(producto);
                          setShowUpdateModal(true);
                        }
                      }}
                      className="bg-blue2 hover:bg-blue1 px-6 py-2 rounded-lg text-white 
                               shadow-sm transition-all duration-200 transform hover:scale-105"
                    >
                      Actualizar Producto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showUpdateModal && selectedProduct && (
        <UpdateProduct
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedProduct(null);
          }}
          productData={selectedProduct}
          fetchProductos={fetchProductos}
        />
      )}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: "" })}
        onConfirm={confirmDelete}
        productName={deleteModal.productName}
      />
    </div>
  );
}
