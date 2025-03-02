import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Calendar } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import BlogsCreate from "./BlogsCreate";
import BlogUpdate from "./BlogUpdate";
import DeleteBlogModal from "./DeleteBlogModal";

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blogId: null, blogTitle: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('usuario'));
      const vetId = userData?.veterinario?.id;
      
      if (!vetId) {
        console.error("No se encontró ID del veterinario");
        return;
      }

      const response = await axiosInstance.get(`/blogs/veterinario/${vetId}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error al obtener blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/blogs/${deleteModal.blogId}`);
      fetchBlogs();
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue1"></div>
      </div>
    );
  }

  const filteredBlogs = blogs.filter(blog => 
    blog.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header y búsqueda */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue1 text-white px-6 py-3 rounded-xl
                     hover:bg-blue2 transition-all duration-300 hover:shadow-lg"
          >
            <Plus size={20} />
            Nuevo Post
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl px-5 py-3 rounded-xl bg-white border-0 focus:ring-2 focus:ring-blue1
                     shadow-sm pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Grid de blogs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Imagen del blog */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.imagen || "https://via.placeholder.com/400x200"}
                alt={blog.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedBlog(blog);
                    setShowUpdateModal(true);
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-blue1 hover:text-white transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => setDeleteModal({ 
                    isOpen: true, 
                    blogId: blog.id, 
                    blogTitle: blog.titulo 
                  })}
                  className="p-2 bg-white/90 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Contenido del blog */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={16} />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.titulo}</h3>
              <span className="inline-block px-3 py-1 bg-blue1/10 text-blue1 rounded-full text-sm">
                {blog.categoria}
              </span>
              <p className="mt-4 text-gray-600 line-clamp-3">{blog.contenido}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      <BlogsCreate 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          fetchBlogs();
        }} 
      />

      <BlogUpdate 
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedBlog(null);
          fetchBlogs();
        }}
        blogData={selectedBlog}
      />

      <DeleteBlogModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" })}
        onConfirm={handleDelete}
        blogTitle={deleteModal.blogTitle}
      />
    </div>
  );
}
