import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useProjects } from '../../lib/hooks/use-projects';
import { useServiceOrders } from '../../lib/hooks/use-service-orders';
import { useAuth } from '../../lib/use-auth';
import {
  CircleUser,
  FolderOpen,
  ClipboardList,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Spinner } from '../../components/ui/spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { serviceOrders, isLoading: ordersLoading } = useServiceOrders();

  const isLoading = projectsLoading || ordersLoading;

  const approvedOrders = serviceOrders.filter(
    (order) => order.is_approved,
  ).length;
  const pendingOrders = serviceOrders.length - approvedOrders;

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Welcome, {user?.username}!</h1>
        <p className='text-gray-600'>
          Here's an overview of your projects and service orders.
        </p>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium flex items-center'>
                <CircleUser className='mr-2 h-4 w-4' />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-gray-500'>
                <div>
                  <strong>Username:</strong> {user?.username}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium flex items-center'>
                <FolderOpen className='mr-2 h-4 w-4' />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{projects.length}</div>
              <p className='text-sm text-gray-500'>Total projects</p>
            </CardContent>
            <CardFooter>
              <Link to='/projects'>
                <Button
                  variant='outline'
                  size='sm'
                >
                  View All Projects
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium flex items-center'>
                <ClipboardList className='mr-2 h-4 w-4' />
                Service Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{serviceOrders.length}</div>
              <p className='text-sm text-gray-500'>Total service orders</p>
            </CardContent>
            <CardFooter>
              <Link to='/service-orders'>
                <Button
                  variant='outline'
                  size='sm'
                >
                  View All Orders
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium flex items-center'>
                <CheckCircle2 className='mr-2 h-4 w-4' />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <CheckCircle2 className='h-4 w-4 text-green-500 mr-1' />
                    <span className='text-sm'>Approved</span>
                  </div>
                  <span className='font-bold'>{approvedOrders}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <XCircle className='h-4 w-4 text-amber-500 mr-1' />
                    <span className='text-sm'>Pending</span>
                  </div>
                  <span className='font-bold'>{pendingOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className='mt-8 grid gap-6 md:grid-cols-2'>
        {!isLoading && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your most recently created projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className='text-sm text-gray-500'>No projects found</p>
                ) : (
                  <div className='space-y-2'>
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className='flex justify-between items-center p-2 border rounded-md'
                      >
                        <div>
                          <div className='font-medium'>{project.name}</div>
                          <div className='text-xs text-gray-500'>
                            Created:{' '}
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Link to={`/projects/${project.id}/service-orders`}>
                          <Button
                            variant='ghost'
                            size='sm'
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to='/projects'>
                  <Button variant='outline'>View All Projects</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Service Orders</CardTitle>
                <CardDescription>
                  Your most recently created service orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serviceOrders.length === 0 ? (
                  <p className='text-sm text-gray-500'>
                    No service orders found
                  </p>
                ) : (
                  <div className='space-y-2'>
                    {serviceOrders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className='flex justify-between items-center p-2 border rounded-md'
                      >
                        <div>
                          <div className='font-medium'>{order.name}</div>
                          <div className='text-xs text-gray-500'>
                            Project: {order.project_name}
                          </div>
                        </div>
                        <div className='flex items-center'>
                          {order.is_approved ? (
                            <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
                              Approved
                            </span>
                          ) : (
                            <span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to='/service-orders'>
                  <Button variant='outline'>View All Service Orders</Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
