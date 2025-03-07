import { useState, useEffect } from "react";
import { ImageUp, X, Upload, Save } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";

export default function UpdateProduct({ isOpen, onClose, productData, fetchProductos }) {
  const [product, setProduct] = useState({
    nombre: "",
    marca: "",
    mascota: "",
    edad: "",
    precio: "",
    stock: "",
    categoria: "",
    peso: "",
    imagen: null,
    id_veterinario: ""
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen && productData) {
      setProduct({
        ...productData,
        precio: productData.precio?.toString() || "",
        stock: productData.stock?.toString() || "",
        peso: productData.peso?.toString() || "",
        mascota: productData.mascota?.toString() || "",
        categoria: productData.categoria?.toString() || "",
        id_veterinario: productData.id_veterinario?.toString() || "",
        edad: productData.edad || ""
      });
      setPreviewImage(productData.imagen || null);
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
      setProduct(prev => ({ ...prev, imagen: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
     
      formData.append("nombre", product.nombre);
      formData.append("marca", product.marca);
      formData.append("mascota", parseInt(product.mascota)); 
      formData.append("edad", product.edad); 
      formData.append("precio", product.precio.toString());
      formData.append("stock", parseInt(product.stock)); 
      formData.append("categoria", parseInt(product.categoria)); 
      formData.append("peso", product.peso.toString());
      formData.append("id_veterinario", parseInt(product.id_veterinario)); 

      
      if (product.imagen instanceof File) {
        formData.append("imagen", product.imagen);
      }

      const response = await axiosInstance.put(`/productos/${productData.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        onClose();
        if (fetchProductos) fetchProductos();
      }
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
  
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

        {/* Panel izquierdo - Imagen */}
        <div className="w-1/3 bg-gradient-to-br from-blue1/10 to-blue2/10 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/80 relative group shadow-md">
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

        {/* Panel derecho - Formulario */}
        <div className="w-2/3 p-12 bg-white/70">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Actualizar Producto</h2>
            <p className="text-gray-500">Modifica los detalles del producto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.nombre}
                required
              />
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.marca}
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
                  value={product.precio}
                  required
                />
              </div>
              <input
                type="number"
                name="stock"
                placeholder="Stock disponible"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.stock}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <select
                name="mascota"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.mascota}
                required
              >
                <option value="">Tipo de mascota</option>
                <option value="1">Perro</option>
                <option value="3">Gato</option>
                <option value="4">Ave</option>
                <option value="5">Otros</option>
              </select>

              <select
                name="edad"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.edad}
                required
              >
                <option value="">Edad recomendada</option>
                <option value="Adultos">Adultos</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Joven">Joven</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <select
                name="categoria"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.categoria}
                required
              >
                <option value="">Categoría del producto</option>
                <option value="1">Alimento</option>
                <option value="2">Juguetes</option>
                <option value="3">Accesorios</option>
                <option value="4">Higiene</option>
                <option value="5">Salud</option>
              </select>

              <input
                type="number"
                name="peso"
                placeholder="Peso del producto (kg)"
                className="w-full p-4 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0 transition-all duration-300 hover:bg-gray-50"
                onChange={handleChange}
                value={product.peso}
                required
              />
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
                  <span className="font-medium">Guardar Cambios</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
