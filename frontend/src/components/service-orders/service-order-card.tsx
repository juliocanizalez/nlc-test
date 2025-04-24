import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { ServiceOrder } from '../../lib/api';
import { useState } from 'react';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ServiceOrderCardProps {
  serviceOrder: ServiceOrder;
  onEdit: (serviceOrder: ServiceOrder) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function ServiceOrderCard({
  serviceOrder,
  onEdit,
  onDelete,
}: ServiceOrderCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(serviceOrder.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting service order:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <Card className='h-full flex flex-col'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <CardTitle className='text-xl truncate mr-2'>
              {serviceOrder.name}
            </CardTitle>
            {serviceOrder.is_approved ? (
              <div className='flex items-center text-green-600 text-sm'>
                <CheckCircle2 className='h-4 w-4 mr-1' />
                <span>Approved</span>
              </div>
            ) : (
              <div className='flex items-center text-amber-600 text-sm'>
                <XCircle className='h-4 w-4 mr-1' />
                <span>Pending</span>
              </div>
            )}
          </div>
          <div className='text-sm text-gray-500 mt-1'>
            Category:{' '}
            <span className='font-medium'>{serviceOrder.category}</span>
          </div>
        </CardHeader>
        <CardContent className='flex-1 pt-0'>
          <p className='text-gray-600 text-sm line-clamp-2 mb-2'>
            {serviceOrder.description || 'No description provided'}
          </p>
          <div className='flex justify-between text-xs text-gray-500 mt-3'>
            <span>Project: {serviceOrder.project_name}</span>
            <span>Created: {formatDate(serviceOrder.created_date)}</span>
          </div>
        </CardContent>
        <CardFooter className='border-t pt-4 flex justify-between gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(serviceOrder)}
          >
            Edit
          </Button>

          <Button
            variant='destructive'
            size='sm'
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title='Delete Service Order'
        description='Are you sure you want to delete this service order? This action cannot be undone.'
        confirmLabel='Delete'
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        variant='destructive'
      />
    </>
  );
}
