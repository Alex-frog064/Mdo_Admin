import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api-mascoticobereal.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false 
});

// Interceptor para las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Asegurarnos de que siempre tengamos el Content-Type correcto
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default axiosInstance; 