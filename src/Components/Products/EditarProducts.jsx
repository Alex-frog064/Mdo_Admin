import { useState, useEffect } from "react";
import { ImageUp, X, Upload, Save } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";

export default function UpdateProduct({ isOpen, onClose, productData }) {
  const [product, setProduct] = useState({
    nombre: "",
    precio: "",
    stock: "",
    marca: "",
    mascota: "",
    edad: "",
    imagen: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen && productData) {
      setProduct({
        ...productData,
        precio: parseFloat(productData.precio).toString(),
        stock: parseInt(productData.stock).toString(),
      });
      setPreviewImage(productData.imagen);
    }
  }, [isOpen, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      
      // Crear FormData para la imagen
      const formData = new FormData();
      formData.append("imagen", file);

      try {
        const response = await axiosInstance.post("/upload", formData);
        setProduct(prev => ({ ...prev, imagen: response.data.url }));
      } catch (error) {
        console.error("Error al subir imagen:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(`/productos/${productData.id}`, {
        ...product,
        precio: parseFloat(product.precio),
        stock: parseInt(product.stock)
      });

      if (response.status === 200) {
        onClose();
        // Aquí podrías agregar una notificación de éxito
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      // Aquí podrías agregar una notificación de error
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 flex relative overflow-hidden">
        {/* Botón de Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="text-gray-500" size={20} />
        </button>

        {/* Contenedor izquierdo - Imagen */}
        <div className="w-1/3 bg-gradient-to-br from-blue1/10 to-blue2/10 p-8 flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-inner relative">
            <label 
              htmlFor="imageUpload" 
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors"
            >
              {previewImage ? (
                <img src={previewImage} alt="Producto" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-blue1">
                  <Upload size={40} />
                  <p className="text-sm">Subir imagen</p>
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
        <div className="w-2/3 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actualizar Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                onChange={handleChange}
                value={product.nombre}
                required
              />

              <input
                type="text"
                name="marca"
                placeholder="Marca"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                onChange={handleChange}
                value={product.marca}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  className="w-full p-3 pl-8 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                  onChange={handleChange}
                  value={product.precio}
                  required
                />
              </div>

              <input
                type="number"
                name="stock"
                placeholder="Stock disponible"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                onChange={handleChange}
                value={product.stock}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="mascota"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                onChange={handleChange}
                value={product.mascota}
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
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue1 focus:border-transparent"
                onChange={handleChange}
                value={product.edad}
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
              className="w-full bg-blue1 hover:bg-blue2 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
