import { FastifyInstance } from 'fastify';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getAllServiceOrdersSchema,
  getServiceOrderByIdSchema,
  createServiceOrderSchema,
  updateServiceOrderSchema,
  deleteServiceOrderSchema,
} from '../types/schema';

interface ServiceOrderRow extends RowDataPacket {
  id: number;
  name: string;
  category: string;
  description: string | null;
  project_id: number;
  is_approved: boolean;
  created_date: Date;
  updated_date: Date;
  project_name?: string;
}

interface ProjectRow extends RowDataPacket {
  id: number;
  name: string;
}

export default async function serviceOrderRoutes(
  server: FastifyInstance,
): Promise<void> {
  // Authentication hook
  server.addHook('onRequest', authenticate);

  /**
   * Get all service orders
   * @param {number} project_id - The ID of the project (optional)
   * @returns {ServiceOrderRow[]} All service orders
   */
  server.get(
    '/',
    { schema: getAllServiceOrdersSchema },
    async (request, reply) => {
      const { project_id } = request.query as { project_id?: number };
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        let query = `
          SELECT so.*, p.name as project_name
          FROM service_orders so
          JOIN projects p ON so.project_id = p.id
        `;

        const params = [];

        if (project_id) {
          query += ' WHERE so.project_id = ?';
          params.push(project_id);
        }

        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          query,
          params,
        );

        reply.send(serviceOrders);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error retrieving service orders',
        });
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Get service order by ID
   * @param {number} id - The ID of the service order
   * @returns {ServiceOrderRow} The service order
   */
  server.get(
    '/:id',
    { schema: getServiceOrderByIdSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          `
          SELECT so.*, p.name as project_name
          FROM service_orders so
          JOIN projects p ON so.project_id = p.id
          WHERE so.id = ?
        `,
          [id],
        );

        if (serviceOrders.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service order with ID ${id} not found`,
          });
        }

        reply.send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error retrieving service order',
        });
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Create a new service order
   * @param {RequestBody} request.body - The service order details
   * @returns {ServiceOrderRow} The created service order
   */
  server.post(
    '/',
    { schema: createServiceOrderSchema },
    async (request, reply) => {
      const {
        name,
        category,
        description = null,
        project_id,
        is_approved = false,
      } = request.body as {
        name: string;
        category: string;
        description?: string | null;
        project_id: number;
        is_approved?: boolean;
      };

      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        // Verify project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT id FROM projects WHERE id = ?',
          [project_id],
        );

        if (existingProjects.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${project_id} not found`,
          });
        }

        // Create record
        const [result] = await connection.query<ResultSetHeader>(
          'INSERT INTO service_orders (name, category, description, project_id, is_approved) VALUES (?, ?, ?, ?, ?)',
          [name, category, description, project_id, is_approved],
        );

        const serviceOrderId = result.insertId;

        // Get the created service order
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [serviceOrderId],
        );

        reply.status(201).send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error creating service order',
        });
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Update a service order
   * @param {number} id - The ID of the service order
   * @param {RequestBody} request.body - The updated service order details
   * @returns {ServiceOrderRow} The updated service order
   */
  server.put(
    '/:id',
    { schema: updateServiceOrderSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const {
        name,
        category,
        description = null,
        project_id,
        is_approved = false,
      } = request.body as {
        name: string;
        category: string;
        description?: string | null;
        project_id: number;
        is_approved?: boolean;
      };

      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        // Verify service order exists
        const [existingOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT id FROM service_orders WHERE id = ?',
          [id],
        );

        if (existingOrders.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service order with ID ${id} not found`,
          });
        }

        // Verify project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT id FROM projects WHERE id = ?',
          [project_id],
        );

        if (existingProjects.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${project_id} not found`,
          });
        }

        // Update record
        await connection.query<ResultSetHeader>(
          'UPDATE service_orders SET name = ?, category = ?, description = ?, project_id = ?, is_approved = ? WHERE id = ?',
          [name, category, description, project_id, is_approved, id],
        );

        // Get the updated service order
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        reply.send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error updating service order',
        });
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Delete a service order
   * @param {number} id - The ID of the service order to delete
   */
  server.delete(
    '/:id',
    { schema: deleteServiceOrderSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        // Verify service order exists
        const [existingOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT id FROM service_orders WHERE id = ?',
          [id],
        );

        if (existingOrders.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service order with ID ${id} not found`,
          });
        }

        // Delete record
        await connection.query<ResultSetHeader>(
          'DELETE FROM service_orders WHERE id = ?',
          [id],
        );

        reply.status(204).send();
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error deleting service order',
        });
      } finally {
        connection.release();
      }
    },
  );
}
