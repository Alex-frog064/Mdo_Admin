import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dates from './Components/Dates.jsx';

// Configuración de las rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "dates", element: <Dates /> }, 
    
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
