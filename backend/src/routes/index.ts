import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';

export default async function registerRoutes(
  server: FastifyInstance,
): Promise<void> {
  await server.register(authRoutes, { prefix: '/api/auth' });
}
