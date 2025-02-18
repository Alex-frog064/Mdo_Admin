import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api-mascoticobereal.onrender.com/', 
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleEstadoChange = async (id, nuevoEstado) => {
  try {
    const response = await fetch(`https://api-mascoticobereal.onrender.com/citas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    fetchVeterinario(); // 🔄 Vuelve a cargar los datos sin recargar la página
  } catch (error) {
    alert("Hubo un error al actualizar el estado de la cita.");
  }
};
export default axiosInstance;
