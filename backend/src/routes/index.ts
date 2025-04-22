import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';

export default async function registerRoutes(
  server: FastifyInstance,
): Promise<void> {
  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(projectRoutes, { prefix: '/api/projects' });
}
