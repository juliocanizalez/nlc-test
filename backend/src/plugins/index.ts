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

  // Register Swagger with proper configuration
  // Use @ts-ignore to bypass TypeScript errors for the options
  // @ts-ignore
  await server.register(fastifySwagger, {
    routePrefix: '/api-docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Service Order Management API',
        description: 'API for managing projects and service orders',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://github.com/juliocanizalez',
        description: 'Find more info here',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'projects', description: 'Project management endpoints' },
        {
          name: 'service-orders',
          description: 'Service order management endpoints',
        },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  // Register Swagger UI as a separate plugin
  // @ts-ignore - to bypass TypeScript errors
  await server.register(fastifySwaggerUI, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      tryItOutEnabled: true,
    },
    staticCSP: true,
  });
}
