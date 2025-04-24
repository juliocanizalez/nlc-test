import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Project } from '../../lib/api';
import { useState } from 'react';
import { ConfirmationDialog } from '../ui/confirmation-dialog';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(project.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      <Card className='h-full flex flex-col'>
        <CardHeader>
          <CardTitle className='text-xl truncate'>{project.name}</CardTitle>
        </CardHeader>
        <CardContent className='flex-1'>
          <p className='text-gray-600 text-sm line-clamp-3'>
            {project.description || 'No description provided'}
          </p>
        </CardContent>
        <CardFooter className='border-t pt-4 flex justify-between gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(project)}
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

          <Link
            to={`/projects/${project.id}/service-orders`}
            className='ml-auto'
          >
            <Button
              variant='default'
              size='sm'
            >
              Service Orders
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title='Delete Project'
        description='Are you sure you want to delete this project? This action cannot be undone.'
        confirmLabel='Delete'
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        variant='destructive'
      />
    </>
  );
}
