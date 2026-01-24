import './index.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Products from './pages/Index';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import Forget from './pages/Forget';
import NotFound from './pages/404';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Products /> },
      { path: '*', element: <NotFound /> },
      { path: '/Register', element: <Register /> },
      { path: '/login', element: <Login /> },
      { path: '/forget-pass', element: <Forget /> },
      { path: '/products/:slug', element: <Details /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
);