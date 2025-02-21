import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import BlogsCreate from "./BlogsCreate";
import BlogUpdate from "./BlogUpdate"; 

export default function BlogList() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); 

 
  const blogs = [
    {
      id: 1,
      image: "https://i.pinimg.com/736x/74/a2/b4/74a2b44a4c31bd45c151fd773a3feb95.jpg",
      category: "Technology",
      title: "The Impact of Technology on the Workplace: How Technology is Changing",
      author: "Tracey Wilson",
      date: "August 20, 2022",
    },
    {
      id: 2,
      image: "https://i.pinimg.com/736x/42/b4/a5/42b4a5928d0bc952689d084b5e8c3b67.jpg",
      category: "Technology",
      title: "The Impact of Technology on the Workplace: How Technology is Changing",
      author: "Jason Francisco",
      date: "August 20, 2022",
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/85/15/c0/8515c0bec5ad824acff4fa79a9608044.jpg",
      category: "Technology",
      title: "The Impact of Technology on the Workplace: How Technology is Changing",
      author: "Elizabeth Slavin",
      date: "August 20, 2022",
    },
  ];


  const handleUpdateClick = (blog) => {
    setSelectedBlog(blog); 
    setShowUpdateModal(true);
  };

  return (
    <div className="p-6">
      {/* Encabezado y botón para crear blog */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Blogs creados</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue2 text-black rounded-full px-6 py-2 shadow-md hover:text-white hover:bg-blue1"
        >
          Crear blog
        </button>
      </div>

      {/* Lista de blogs */}
      <div className="grid grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="shadow-md rounded-lg overflow-hidden relative bg-white">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="text-blue-500 text-sm font-medium">{blog.category}</span>
              <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {blog.author} • {blog.date}
              </p>
            </div>
            {/* Botón para abrir el modal de actualización */}
            <button
              onClick={() => handleUpdateClick(blog)} 
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="absolute top-14 right-4 bg-white p-2 rounded-full shadow"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal para crear blog */}
      {showModal && <BlogsCreate onClose={() => setShowModal(false)} />}

      {/* Modal para actualizar blog */}
      {showUpdateModal && (
        <BlogUpdate
          blog={selectedBlog} 
          onClose={() => setShowUpdateModal(false)} 
        />
      )}
    </div>
  );
}