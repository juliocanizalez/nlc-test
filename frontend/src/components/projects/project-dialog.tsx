import { useState, useEffect } from 'react';
import { Project, ProjectRequest } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Spinner } from '../ui/spinner';

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectRequest) => Promise<void>;
  project?: Project | null;
  title: string;
}

export default function ProjectDialog({
  isOpen,
  onClose,
  onSubmit,
  project = null,
  title,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectRequest>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setError(null);
  }, [project, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError('Failed to save project');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='space-y-4 py-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>Project Name *</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter project name'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              name='description'
              value={formData.description || ''}
              onChange={handleChange}
              placeholder='Enter project description'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <DialogFooter className='pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size='sm' /> : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
