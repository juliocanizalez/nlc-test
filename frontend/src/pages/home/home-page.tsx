import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/use-auth';
import { FolderOpen, ClipboardList, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='flex flex-col items-center'>
      <div className='text-center max-w-3xl mx-auto px-4 py-16'>
        <h1 className='text-4xl font-bold mb-4'>Service Order Manager</h1>
        <p className='text-xl text-gray-600 mb-8'>
          Manage your projects and service orders in one place.
        </p>

        {isAuthenticated ? (
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/dashboard'>
              <Button
                className='w-full sm:w-auto'
                size='lg'
              >
                Go to Dashboard <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        ) : (
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/auth'>
              <Button
                className='w-full sm:w-auto'
                size='lg'
              >
                Sign In / Register
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className='w-full max-w-6xl px-4 py-12'>
        <div className='grid md:grid-cols-2 gap-12'>
          <div className='bg-white p-8 rounded-lg shadow-md'>
            <div className='flex items-center mb-4'>
              <FolderOpen className='h-8 w-8 text-blue-600 mr-3' />
              <h2 className='text-2xl font-bold'>Project Management</h2>
            </div>
            <p className='text-gray-600 mb-6'>
              Create and manage projects effortlessly. Track important details,
              update information, and keep everything organized in one place.
            </p>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-blue-600 mr-2' />
                Create custom projects
              </li>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-blue-600 mr-2' />
                Detailed project views
              </li>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-blue-600 mr-2' />
                Easy editing and updates
              </li>
            </ul>
            {isAuthenticated && (
              <Link to='/projects'>
                <Button
                  variant='outline'
                  className='w-full'
                >
                  View Projects
                </Button>
              </Link>
            )}
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md'>
            <div className='flex items-center mb-4'>
              <ClipboardList className='h-8 w-8 text-green-600 mr-3' />
              <h2 className='text-2xl font-bold'>Service Order Tracking</h2>
            </div>
            <p className='text-gray-600 mb-6'>
              Manage service orders linked to your projects. Keep track of
              service categories, approval status, and relevant project
              connections.
            </p>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-green-600 mr-2' />
                Link orders to projects
              </li>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-green-600 mr-2' />
                Track approval status
              </li>
              <li className='flex items-center text-gray-700'>
                <div className='h-1.5 w-1.5 rounded-full bg-green-600 mr-2' />
                Organize by category
              </li>
            </ul>
            {isAuthenticated && (
              <Link to='/service-orders'>
                <Button
                  variant='outline'
                  className='w-full'
                >
                  View Service Orders
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
