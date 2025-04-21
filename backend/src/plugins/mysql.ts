import { FastifyInstance } from 'fastify';
import fastifyMysql from '@fastify/mysql';
import fastifyPlugin from 'fastify-plugin';
import config from '../config/config';

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(fastifyMysql, {
    promise: true,
    connectionString: `mysql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`,
  });
});
