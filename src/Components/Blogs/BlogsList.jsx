import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import BlogsCreate from "./BlogsCreate";
import BlogUpdate from "./BlogUpdate";

export default function BlogList() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  // Obtener el ID del veterinario autenticado
  const idVeterinario = 7967;

  // Obtener todos los blogs del veterinario autenticado
  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get(`/blogs/veterinario/${idVeterinario}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error al obtener blogs:", error);
    }
  };

  useEffect(() => {
    if (idVeterinario) {
      fetchBlogs();
    }
  }, [idVeterinario]);


   const buscarBlog = async () => {
    try {
      const response = await fetch(
        `https://api-mascoticobereal.onrender.com/blog/nombre?nombre=${nombre}`
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener el blog");
      }
      const data = await response.json();
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBlogs([]);
    }
  };
  
  // Eliminar un blog por ID
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error al eliminar el blog:", error);
    }
  };

  const handleUpdateClick = (blog) => {
    setSelectedBlog(blog);
    setShowUpdateModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Mis Blogs</h2>
        <div className="relative w-1/3">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Buscar..."
            className="w-full p-3 pl-4 pr-10 rounded-full bg-gray-800 shadow-md text-black"
          />
          <Search
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            size={20}
            onClick={buscarBlog }
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue2 text-black rounded-full px-6 py-2 shadow-md hover:text-white hover:bg-blue1"
        >
          Crear blog
        </button>
      </div>

      {/* Lista de blogs */}
      <div className="grid grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No hay blogs disponibles.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="shadow-md rounded-lg overflow-hidden relative bg-white group">
              <div className="relative">
                <img src={blog.imagen} alt={blog.titulo} className="w-full h-48 object-cover" />
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                  <button
                    onClick={() => handleUpdateClick(blog)}
                    className="p-2 bg-white rounded-full hover:bg-sky-50 transition-colors"
                  >
                    <Pencil className="w-5 h-5 text-sky-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <span className="text-blue-500 text-sm font-medium">{blog.categoria}</span>
                <h3 className="text-lg font-semibold mt-2">{blog.titulo}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  ID: {blog.id_veterinario} • {blog.fecha_publicacion}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <BlogsCreate onClose={() => setShowModal(false)} />}
      {showUpdateModal && <BlogUpdate blog={selectedBlog} onClose={() => setShowUpdateModal(false)} />}
    </div>
  );
}
