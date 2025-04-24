import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import ServiceOrderCard from '../../components/service-orders/service-order-card';
import ServiceOrderDialog from '../../components/service-orders/service-order-dialog';
import { ServiceOrder, ServiceOrderRequest } from '../../lib/api';
import { useServiceOrders } from '../../lib/hooks/use-service-orders';
import { useProjects } from '../../lib/hooks/use-projects';
import { PlusCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export default function ServiceOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project_id');
  const projectId = projectIdParam ? parseInt(projectIdParam) : undefined;

  const {
    serviceOrders,
    isLoading: ordersLoading,
    error: ordersError,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  } = useServiceOrders(projectId);
  const { projects, isLoading: projectsLoading } = useProjects();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentServiceOrder, setCurrentServiceOrder] =
    useState<ServiceOrder | null>(null);

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

  const handleProjectFilterChange = (projectId: string) => {
    if (projectId === 'all') {
      searchParams.delete('project_id');
    } else {
      searchParams.set('project_id', projectId);
    }
    setSearchParams(searchParams);
  };

  const isLoading = ordersLoading || projectsLoading;
  const error = ordersError;

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>Service Orders</h1>
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
          <div className='w-full sm:w-64'>
            <Select
              value={projectId?.toString() || 'all'}
              onValueChange={handleProjectFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter by project' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id.toString()}
                  >
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className='flex items-center gap-1'
          >
            <PlusCircle className='h-4 w-4' />
            <span>New Service Order</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : error ? (
        <div className='bg-red-50 p-4 rounded-md text-red-600 mb-6'>
          {error}
        </div>
      ) : serviceOrders.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg border'>
          <h3 className='text-lg font-medium text-gray-600'>
            No service orders found
          </h3>
          <p className='text-gray-500 mt-1'>
            Get started by creating a new service order
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

      <ServiceOrderDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        serviceOrder={currentServiceOrder}
        projects={projects}
        title={
          currentServiceOrder ? 'Edit Service Order' : 'Create Service Order'
        }
        selectedProjectId={projectId}
      />
    </div>
  );
}
