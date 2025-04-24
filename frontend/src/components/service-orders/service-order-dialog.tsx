import { useState, useEffect } from 'react';
import { ServiceOrder, ServiceOrderRequest, Project } from '../../lib/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ServiceOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceOrderRequest) => Promise<void>;
  serviceOrder?: ServiceOrder | null;
  projects: Project[];
  title: string;
  selectedProjectId?: number;
}

export default function ServiceOrderDialog({
  isOpen,
  onClose,
  onSubmit,
  serviceOrder = null,
  projects,
  title,
  selectedProjectId,
}: ServiceOrderDialogProps) {
  const [formData, setFormData] = useState<ServiceOrderRequest>({
    name: '',
    category: '',
    description: '',
    project_id: selectedProjectId || 0,
    is_approved: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceOrder) {
      setFormData({
        name: serviceOrder.name,
        category: serviceOrder.category,
        description: serviceOrder.description || '',
        project_id: serviceOrder.project_id,
        is_approved: serviceOrder.is_approved,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        project_id:
          selectedProjectId || (projects.length > 0 ? projects[0].id : 0),
        is_approved: false,
      });
    }
    setError(null);
  }, [serviceOrder, isOpen, projects, selectedProjectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'project_id') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === 'is_approved') {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Service order name is required');
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    if (!formData.project_id) {
      setError('Project selection is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError('Failed to save service order');
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
            <Label htmlFor='name'>Service Order Name *</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter service order name'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category *</Label>
            <Input
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              placeholder='Enter category'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='project_id'>Project *</Label>
            <Select
              value={formData.project_id.toString()}
              onValueChange={(value) => handleSelectChange('project_id', value)}
              disabled={!!selectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a project' />
              </SelectTrigger>
              <SelectContent>
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

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              name='description'
              value={formData.description || ''}
              onChange={handleChange}
              placeholder='Enter description'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='is_approved'>Status</Label>
            <Select
              value={(formData.is_approved !== undefined
                ? formData.is_approved
                : false
              ).toString()}
              onValueChange={(value) =>
                handleSelectChange('is_approved', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='false'>Pending</SelectItem>
                <SelectItem value='true'>Approved</SelectItem>
              </SelectContent>
            </Select>
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
