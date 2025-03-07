import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dates from './Components/Dates/Dates.jsx';
import User from './Profile/Signin.jsx'
import Register from './Profile/Signon.jsx';
import Profile from './Profile/Profile.jsx';
import Blogs from './Components/Blogs/BlogsList.jsx';
import ScheduleAppointments from './Components/Availability/Availability.jsx';
import AddProductModal from './Components/Products/allProducts.jsx';
import Sales from './Components/Sales/Sales.jsx';
import Help from './Components/Help/Help.jsx';
import Datos from './Components/Tienda/Datos.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/SignIn" replace />,
  },
  {
    path: "/SignIn",
    element: <User/>
  },
  {
    path: "/SignOn",
    element: <Register/>
  },
  {
    path: "/dashboard",
    element: <App />,
    children: [
      { path: "/dashboard/dates", element: <Dates/>},
      { path: "/dashboard/profile", element: <Profile/>},
      { path: "/dashboard/blog", element: <Blogs/>},
      { path: "/dashboard/time", element: <ScheduleAppointments/>},
      { path: "/dashboard/inventory", element: <AddProductModal/>},
      { path: "/dashboard/sales", element: <Sales/>},
      { path: "/dashboard/help", element: <Help/>},
      { path: "/dashboard/datos", element: <Datos/>}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
