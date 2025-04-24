import { useState, useEffect, useCallback } from 'react';
import { projectService, Project, ProjectRequest } from '../api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (project: ProjectRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newProject = await projectService.create(project);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: number, project: ProjectRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProject = await projectService.update(id, project);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p)),
      );
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
