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

registerPlugins(server);

registerRoutes(server);

const start = async () => {
  try {
    await server.listen({ port: config.port, host: '0.0.0.0' });
    server.log.info(`Server is running on port ${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
