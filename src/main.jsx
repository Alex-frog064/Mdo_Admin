import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
//import Main from './Components/Main.jsx';
//import Profile from './Profile/Profile.jsx';
//import SignIn from './Profile/Signin.jsx';
//import SignOn from './Profile/Signon.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
     
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
