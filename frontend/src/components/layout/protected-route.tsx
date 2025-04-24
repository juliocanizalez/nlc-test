import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/use-auth';
import { Spinner } from '../ui/spinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth' />;
  }

  return <Outlet />;
}
