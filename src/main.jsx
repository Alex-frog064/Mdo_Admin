import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dates from './Components/Dates/Dates.jsx';
import User from './Profile/Signin.jsx'
import Register from './Profile/Signon.jsx';
import Profile from './Profile/Profile.jsx';
import Blogs from './Components/Blogs/BlogsList.jsx';
import ScheduleAppointments from './Components/Availability/Availability.jsx';
import AddProductModal from './Components/Products/allProducts.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/dates", element: <Dates/>},
      { path:"/SignIn", element: <User/>},
      {path:"/SignOn", element:<Register/>},
      {path:"/profile", element: <Profile/>},
      {path: "/blog", element: <Blogs/>},
      {path: "/time", element: <ScheduleAppointments/>},
      {path: "/inventory", element: <AddProductModal/>}
     
    ],
      },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
