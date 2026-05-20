import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './app/App.tsx';
import ProductsPage from './app/pages/ProductsPage.tsx';
import './styles/index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/produtos', element: <ProductsPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
