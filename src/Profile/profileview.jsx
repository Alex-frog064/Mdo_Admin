import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVeterinario = async () => {
      const token = localStorage.getItem("jwt");
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      const usuarioId = usuarioData?.veterinario?.id; 

      console.log("📥 Datos obtenidos de localStorage:", token, usuarioData);

      if (!token || !usuarioId) {
        console.warn("⚠️ No se encontró token o ID en localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api-mascoticobereal.onrender.com/veterinario/${usuarioId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("jwt");
          navigate("/login");
          return;
        }

        const data = await response.json();
        console.log("📤 Datos recibidos de la API:", data);
        setFormData(data); // Se guarda el objeto directamente
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  if (!formData || Object.keys(formData).length === 0) {
    return <p className="text-center text-red-500">No hay datos disponibles</p>;
  }

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <ul>
        <li><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</li>
        <li><strong>Grado de Estudio:</strong> {formData.grado_estudio}</li>
        <li><strong>Especialidad:</strong> {formData.especialidad}</li>
      </ul>
    </div>
  );
};

export default ProfileView;


//////////
import React, { useState, useEffect } from "react";

const ProfileView = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("jwt");
    const usuarioData = localStorage.getItem("usuario");
    

    console.log("🔍 Datos obtenidos de localStorage:", storedData, usuarioData);

    if (storedData ) {
      try {
        const parsedData = storedData; // guarda el token ya esta en json

        console.log("✅ Objeto parseado:", parsedData, usuarioData);

        if (usuarioData) {
          console.log("📌 Datos del veterinario:", usuarioData);
          setFormData(usuarioData);
        } else {
          console.warn("⚠️ No se encontraron datos de 'veterinario' en localStorage.");
        }
      } catch (error) {
        console.error("❌ Error al parsear los datos de localStorage:", error);
      }
    } else {
      console.warn("⚠️ No se encontró información en localStorage.");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  if (!formData) {
    return <p className="text-center text-red-500">No hay datos disponibles</p>;
  }

    return (
      <div>
        <h2>Bienvenido al Dashboard</h2>
        <button onClick={handleLogout}>Cerrar Sesión</button>
        <ul>
          {productos.map(prod => (
            <li key={prod.id}>{prod.nombre}</li>
          ))}
        </ul>
      </div>
    );
};

export default ProfileView;
