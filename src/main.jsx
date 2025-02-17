import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dates from './Components/Dates/Dates.jsx';
import User from './Profile/Signin.jsx'
import Register from './Profile/Signon.jsx';
import Profile from './Profile/Profile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/dates", element: <Dates/>},
      { path:"/SignIn", element: <User/>},
      {path:"/SignOn", element:<Register/>},
      {path:"/profile", element: <Profile/>}
     
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
