import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import BlogsCreate from "./BlogsCreate";
import BlogUpdate from "./BlogUpdate";

export default function BlogList() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [searchId, setSearchId] = useState("");

  // Obtener todos los blogs
  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error al obtener blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Buscar blog por ID
  const handleSearch = async () => {
    if (!searchId) {
      fetchBlogs();
      return;
    }
    try {
      const response = await axiosInstance.get(`/blogs/${searchId}`);
      setBlogs([response.data]);
    } catch (error) {
      console.error("Error al buscar el blog:", error);
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
        <h2 className="text-2xl font-semibold">Blogs creados</h2>
        <div className="relative w-1/3">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Buscar por ID..."
            className="w-full p-3 pl-4 pr-10 rounded-full bg-gray-800 shadow-md text-black"
          />
          <Search
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            size={20}
            onClick={handleSearch}
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
            <div key={blog.id} className="shadow-md rounded-lg overflow-hidden relative bg-white">
              <img src={blog.imagen} alt={blog.titulo} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-blue-500 text-sm font-medium">{blog.categoria}</span>
                <h3 className="text-lg font-semibold mt-2">{blog.titulo}</h3>
                <p className="text-sm text-gray-500 mt-2">ID: {blog.id_veterinario} • {blog.fecha_publicacion} 
                
                </p>
              </div>
            
              <button
                onClick={() => handleUpdateClick(blog)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="absolute top-14 right-4 bg-white p-2 rounded-full shadow"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))
        )}
      </div>

     
      {showModal && <BlogsCreate onClose={() => setShowModal(false)} />}

     
      {showUpdateModal && (
        <BlogUpdate
          blog={selectedBlog}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  );
}
