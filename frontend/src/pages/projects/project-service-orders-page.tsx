import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import ServiceOrderCard from '../../components/service-orders/service-order-card';
import ServiceOrderDialog from '../../components/service-orders/service-order-dialog';
import {
  ServiceOrder,
  ServiceOrderRequest,
  projectService,
} from '../../lib/api';
import { useServiceOrders } from '../../lib/hooks/use-service-orders';
import { useProjects } from '../../lib/hooks/use-projects';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export default function ProjectServiceOrdersPage() {
  const { projectId } = useParams();
  const id = projectId ? parseInt(projectId) : 0;

  const {
    serviceOrders,
    isLoading: ordersLoading,
    error: ordersError,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  } = useServiceOrders(id);
  const { projects, isLoading: projectsLoading } = useProjects();

  const [project, setProject] = useState<{ id: number; name: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentServiceOrder, setCurrentServiceOrder] =
    useState<ServiceOrder | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const data = await projectService.getById(id);
          setProject(data);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleOpenDialog = (serviceOrder: ServiceOrder | null = null) => {
    setCurrentServiceOrder(serviceOrder);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentServiceOrder(null);
  };

  const handleSubmit = async (data: ServiceOrderRequest) => {
    if (currentServiceOrder) {
      await updateServiceOrder(currentServiceOrder.id, data);
    } else {
      await createServiceOrder(data);
    }
  };

  const isPageLoading = isLoading || ordersLoading || projectsLoading;
  const pageError = error || ordersError;

  return (
    <div>
      <div className='flex items-center mb-4'>
        <Link
          to='/projects'
          className='mr-4'
        >
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-1'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Projects</span>
          </Button>
        </Link>
      </div>

      {isPageLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : pageError ? (
        <div className='bg-red-50 p-4 rounded-md text-red-600 mb-6'>
          {pageError}
        </div>
      ) : project ? (
        <>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h1 className='text-2xl font-bold'>
                {project.name}: Service Orders
              </h1>
              <p className='text-gray-500 mt-1'>
                Manage service orders for this project
              </p>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className='flex items-center gap-1'
            >
              <PlusCircle className='h-4 w-4' />
              <span>New Service Order</span>
            </Button>
          </div>

          {serviceOrders.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg border'>
              <h3 className='text-lg font-medium text-gray-600'>
                No service orders found
              </h3>
              <p className='text-gray-500 mt-1'>
                Get started by creating a new service order for this project
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className='mt-4'
              >
                Create Service Order
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {serviceOrders.map((serviceOrder) => (
                <ServiceOrderCard
                  key={serviceOrder.id}
                  serviceOrder={serviceOrder}
                  onEdit={(serviceOrder) => handleOpenDialog(serviceOrder)}
                  onDelete={deleteServiceOrder}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className='bg-amber-50 p-4 rounded-md text-amber-600 mb-6'>
          Project not found
        </div>
      )}

      <ServiceOrderDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        serviceOrder={currentServiceOrder}
        projects={projects}
        title={
          currentServiceOrder ? 'Edit Service Order' : 'Create Service Order'
        }
        selectedProjectId={id}
      />
    </div>
  );
}
