import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import ProjectCard from '../../components/projects/project-card';
import ProjectDialog from '../../components/projects/project-dialog';
import { Project, ProjectRequest } from '../../lib/api';
import { useProjects } from '../../lib/hooks/use-projects';
import { PlusCircle } from 'lucide-react';

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const handleOpenDialog = (project: Project | null = null) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentProject(null);
  };

  const handleSubmit = async (data: ProjectRequest) => {
    if (currentProject) {
      await updateProject(currentProject.id, data);
    } else {
      await createProject(data);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Projects</h1>
        <Button
          onClick={() => handleOpenDialog()}
          className='flex items-center gap-1'
        >
          <PlusCircle className='h-4 w-4' />
          <span>New Project</span>
        </Button>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : error ? (
        <div className='bg-red-50 p-4 rounded-md text-red-600 mb-6'>
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg border'>
          <h3 className='text-lg font-medium text-gray-600'>
            No projects found
          </h3>
          <p className='text-gray-500 mt-1'>
            Get started by creating a new project
          </p>
          <Button
            onClick={() => handleOpenDialog()}
            className='mt-4'
          >
            Create Project
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={(project) => handleOpenDialog(project)}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        project={currentProject}
        title={currentProject ? 'Edit Project' : 'Create Project'}
      />
    </div>
  );
}
