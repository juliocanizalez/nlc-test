import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

export default function DashboardLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <main className='flex-1 container mx-auto py-8 px-4'>
        <Outlet />
      </main>
    </div>
  );
}
