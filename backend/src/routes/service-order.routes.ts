import { FastifyInstance } from 'fastify';
import { Type } from '@fastify/type-provider-typebox';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticate } from '../middlewares/auth.middleware';

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

export default async function serviceOrderRoutes(
  server: FastifyInstance,
): Promise<void> {
  // Authentication hook
  server.addHook('onRequest', authenticate);

  // Schema
  const serviceOrderSchema = {
    body: Type.Object({
      name: Type.String({ minLength: 1 }),
      category: Type.String({ minLength: 1 }),
      description: Type.Optional(Type.String()),
      project_id: Type.Number(),
      is_approved: Type.Optional(Type.Boolean()),
    }),
  };

  // Response schema
  const serviceOrderResponseSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    category: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    project_id: Type.Number(),
    is_approved: Type.Boolean(),
    created_date: Type.String(),
    updated_date: Type.String(),
  });

  // Extended schema with project info
  const serviceOrderExtendedSchema = Type.Object({
    ...serviceOrderResponseSchema.properties,
    project_name: Type.String(),
  });

  /**
   * Get all service orders
   * @param {number} project_id - The ID of the project (optional)
   * @returns {ServiceOrderRow[]} All service orders
   */
  server.get(
    '/',
    {
      schema: {
        querystring: Type.Object({
          project_id: Type.Optional(Type.Number()),
        }),
        response: {
          200: Type.Array(serviceOrderExtendedSchema),
        },
      },
    },
    async (request, reply) => {
      const { project_id } = request.query as { project_id?: number };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

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
        connection.release();

        reply.send(serviceOrders);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error retrieving service orders',
        });
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
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: serviceOrderExtendedSchema,
          404: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          `SELECT so.*, p.name as project_name
         FROM service_orders so
         JOIN projects p ON so.project_id = p.id
         WHERE so.id = ?`,
          [id],
        );

        connection.release();

        if (serviceOrders.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service Order with ID ${id} not found`,
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
      }
    },
  );

  /**
   * Create a new service order
   * @param {RequestBody} request.body - The service order's name, category, description, project_id, and is_approved
   * @returns {ServiceOrderRow} The created service order
   */
  server.post(
    '/',
    {
      schema: {
        body: serviceOrderSchema.body,
        response: {
          201: serviceOrderResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        category: string;
        description?: string;
        project_id: number;
        is_approved?: boolean;
      };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if project exists
        const [projects] = await connection.query<RowDataPacket[]>(
          'SELECT id FROM projects WHERE id = ?',
          [body.project_id],
        );

        if (projects.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${body.project_id} not found`,
          });
        }

        // INSERT
        const [result] = await connection.query<ResultSetHeader>(
          `INSERT INTO service_orders
         (name, category, description, project_id, is_approved)
         VALUES (?, ?, ?, ?, ?)`,
          [
            body.name,
            body.category,
            body.description || null,
            body.project_id,
            body.is_approved ?? false,
          ],
        );

        const serviceOrderId = result.insertId;

        // GET
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [serviceOrderId],
        );

        connection.release();

        reply.status(201).send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error creating service order',
        });
      }
    },
  );

  /**
   * Update a service order
   * @param {number} id - The ID of the service order
   * @param {RequestBody} request.body - The service order's name, category, description, project_id, and is_approved
   * @returns {ServiceOrderRow} The updated service order
   */
  server.put(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        body: serviceOrderSchema.body,
        response: {
          200: serviceOrderResponseSchema,
          404: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const body = request.body as {
        name: string;
        category: string;
        description?: string;
        project_id: number;
        is_approved?: boolean;
      };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if service order exists
        const [existingOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        if (existingOrders.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service Order with ID ${id} not found`,
          });
        }

        // Validate if project exists
        const [projects] = await connection.query<RowDataPacket[]>(
          'SELECT id FROM projects WHERE id = ?',
          [body.project_id],
        );

        if (projects.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${body.project_id} not found`,
          });
        }

        // UPDATE
        await connection.query(
          `UPDATE service_orders
         SET name = ?, category = ?, description = ?, project_id = ?, is_approved = ?
         WHERE id = ?`,
          [
            body.name,
            body.category,
            body.description || null,
            body.project_id,
            body.is_approved ?? existingOrders[0].is_approved,
            id,
          ],
        );

        // GET
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        connection.release();

        reply.send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error updating service order',
        });
      }
    },
  );

  /**
   * Delete a service order
   * @param {number} id - The ID of the service order
   * @returns {null} The deleted service order
   */
  server.delete(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          204: Type.Null(),
          404: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if service order exists
        const [existingOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        if (existingOrders.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service Order with ID ${id} not found`,
          });
        }

        // Delete
        await connection.query('DELETE FROM service_orders WHERE id = ?', [id]);

        connection.release();

        reply.status(204).send();
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error deleting service order',
        });
      }
    },
  );

  /**
   * Toggle approval status
   * @param {number} id - The ID of the service order
   * @returns {ServiceOrderRow} The updated service order
   */
  server.patch(
    '/:id/approve',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: serviceOrderResponseSchema,
          404: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if service order exists
        const [existingOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        if (existingOrders.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Service Order with ID ${id} not found`,
          });
        }

        const newApprovalStatus = !existingOrders[0].is_approved;

        // UPDATE
        await connection.query(
          'UPDATE service_orders SET is_approved = ? WHERE id = ?',
          [newApprovalStatus, id],
        );

        // GET
        const [serviceOrders] = await connection.query<ServiceOrderRow[]>(
          'SELECT * FROM service_orders WHERE id = ?',
          [id],
        );

        connection.release();

        reply.send(serviceOrders[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error updating approval status',
        });
      }
    },
  );
}
