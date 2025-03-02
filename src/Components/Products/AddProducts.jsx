import { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProduct((prev) => ({ ...prev, imagen: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      onClose();
      if (fetchProductos) fetchProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      {/* Fondo con blur y animación */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue1/20 to-blue2/20 backdrop-blur-[6px] animate-fade-in"/>

      <div className="bg-white/90 rounded-3xl shadow-lg max-w-5xl w-full mx-4 flex relative overflow-hidden animate-scale-up">
        {/* Decoración de fondo más sutil */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue1 rounded-full opacity-5"/>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue2 rounded-full opacity-5"/>

        {/* Botón de Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all duration-300 group z-10"
        >
          <X className="text-gray-400 group-hover:text-blue1 transition-colors" size={24} />
        </button>

        {/* Contenedor izquierdo - Imagen */}
        <div className="w-1/3 bg-gray-50/50 p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/80 relative group">
            <label 
              htmlFor="imageUpload" 
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
            >
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Producto" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Upload size={40} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-blue1 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={50} className="group-hover:text-blue2 transition-colors" />
                  <p className="text-sm font-medium">Subir imagen</p>
                </div>
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
        </div>

        {/* Contenedor derecho - Formulario */}
        <div className="w-2/3 p-10 relative bg-white/70">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Agregar Producto</h2>
            <p className="text-gray-500">Completa los detalles del nuevo producto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  className="w-full p-4 pl-8 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="number"
                name="stock"
                placeholder="Stock disponible"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <select
                name="mascota"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                required
              >
                <option value="">Tipo de mascota</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otros">Otros</option>
              </select>

              <select
                name="edad"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                required
              >
                <option value="">Edad recomendada</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Joven">Joven</option>
                <option value="Adulto">Adulto</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue1 to-blue2 text-white py-4 rounded-xl flex items-center justify-center gap-3 
                       transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"/>
                  <span className="font-medium">Procesando...</span>
                </>
              ) : (
                <>
                  <Save size={22} />
                  <span className="font-medium">Agregar Producto</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
