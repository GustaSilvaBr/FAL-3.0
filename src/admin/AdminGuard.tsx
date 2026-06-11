import { Outlet } from 'react-router';
import { useAuth } from '../lib/useAuth';
import AdminLoginPage from './AdminLoginPage';
import AdminLayout from './AdminLayout';

export default function AdminGuard() {
  const { username, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!username) {
    return <AdminLoginPage />;
  }

  return <AdminLayout />;
}
