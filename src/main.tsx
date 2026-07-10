import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import App from './app/App.tsx';
import { AuthProvider } from './lib/useAuth.tsx';
import AdminGuard from './admin/AdminGuard.tsx';
import ProductsPage from './admin/pages/ProductsPage.tsx';
import ProductFormPage from './admin/pages/ProductFormPage.tsx';
import SectionsPage from './admin/pages/SectionsPage.tsx';
import UsersPage from './admin/pages/UsersPage.tsx';
import './styles/index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <AdminGuard />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/products" replace /> },
      { path: 'products',          element: <ProductsPage /> },
      { path: 'products/new',      element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'sections',          element: <SectionsPage /> },
      { path: 'users',             element: <UsersPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
