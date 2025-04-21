import { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import mysqlPlugin from './mysql';
import config from '../config/config';

export default async function registerPlugins(
  server: FastifyInstance,
): Promise<void> {
  // mysql
  await server.register(mysqlPlugin);

  // cors
  await server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // jwt
  await server.register(fastifyJwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // swagger
  await server.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Service Order Management API',
        description: 'API for managing projects and service orders',
        version: '1.0.0',
      },
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  // swagger ui
  await server.register(fastifySwaggerUI, {
    routePrefix: '/api-docs',
  });
}
