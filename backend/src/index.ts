import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import config from './config/config';
import registerPlugins from './plugins';
import registerRoutes from './routes';

const server: FastifyInstance = Fastify({
  logger: {
    level: config.logLevel,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

const setup = async () => {
  await registerPlugins(server);
  await registerRoutes(server);
};

const start = async () => {
  try {
    // Set up plugins and routes
    await setup();

    // Start the server
    await server.listen({ port: config.port, host: '0.0.0.0' });
    server.log.info(`Server is running on port ${config.port}`);
    server.log.info('Swagger documentation available at /api-docs');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
