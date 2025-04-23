import { FastifyInstance } from 'fastify';
import { Type } from '@fastify/type-provider-typebox';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticate } from '../middlewares/auth.middleware';

interface ProjectRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export default async function projectRoutes(
  server: FastifyInstance,
): Promise<void> {
  // Add authentication to all routes
  server.addHook('onRequest', authenticate);

  // Schema
  const projectSchema = {
    body: Type.Object({
      name: Type.String({ minLength: 1 }),
      description: Type.Optional(Type.String()),
    }),
  };

  // Response schema
  const projectResponseSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    created_at: Type.String(),
    updated_at: Type.String(),
  });

  /**
   * Get all projects
   * @returns {ProjectRow[]} All projects
   */
  server.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(projectResponseSchema),
        },
      },
    },
    async (request, reply) => {
      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects',
        );
        connection.release();

        reply.send(projects);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error retrieving projects',
        });
      }
    },
  );

  /**
   * Get project by ID
   * @param {number} id - The ID of the project
   * @returns {ProjectRow} The project
   */
  server.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          200: projectResponseSchema,
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
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );
        connection.release();

        if (projects.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${id} not found`,
          });
        }

        reply.send(projects[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error retrieving project',
        });
      }
    },
  );

  /**
   * Create a new Project
   * @param {RequestBody} request.body - The project's name and description
   * @returns {ProjectRow} The created project
   */
  server.post(
    '/',
    {
      schema: {
        body: projectSchema.body,
        response: {
          201: projectResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, description } = request.body as {
        name: string;
        description?: string;
      };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();
        const [result] = await connection.query<ResultSetHeader>(
          'INSERT INTO projects (name, description) VALUES (?, ?)',
          [name, description || null],
        );

        const projectId = result.insertId;

        // Get the created project
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [projectId],
        );

        connection.release();

        reply.status(201).send(projects[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error creating project',
        });
      }
    },
  );

  /**
   * Update a project
   * @param {number} id - The ID of the project
   * @param {RequestBody} request.body - The project's name and description
   * @returns {ProjectRow} The updated project
   */
  server.put(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        body: projectSchema.body,
        response: {
          200: projectResponseSchema,
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
      const { name, description } = request.body as {
        name: string;
        description?: string;
      };

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );

        if (existingProjects.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${id} not found`,
          });
        }

        // Update
        await connection.query(
          'UPDATE projects SET name = ?, description = ? WHERE id = ?',
          [name, description || null, id],
        );

        // Get updated project
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );

        connection.release();

        reply.send(projects[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error updating project',
        });
      }
    },
  );

  /**
   * Delete a project
   * @param {number} id - The ID of the project
   * @returns {null} The deleted project
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

        // Validate if project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );

        if (existingProjects.length === 0) {
          connection.release();
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${id} not found`,
          });
        }

        // Delete project
        await connection.query('DELETE FROM projects WHERE id = ?', [id]);

        connection.release();

        reply.status(204).send();
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error deleting project',
        });
      }
    },
  );
}
