import { FastifyInstance } from 'fastify';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getAllProjectsSchema,
  getProjectByIdSchema,
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
} from '../types/schema';

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

  /**
   * Get all projects
   * @returns {ProjectRow[]} All projects
   */
  server.get('/', { schema: getAllProjectsSchema }, async (request, reply) => {
    const mysql = server.mysql;
    const connection = await mysql.getConnection();

    try {
      const [projects] = await connection.query<ProjectRow[]>(
        'SELECT * FROM projects',
      );

      reply.send(projects);
    } catch (err) {
      server.log.error(err);
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Error retrieving projects',
      });
    } finally {
      connection.release();
    }
  });

  /**
   * Get project by ID
   * @param {number} id - The ID of the project
   * @returns {ProjectRow} The project
   */
  server.get(
    '/:id',
    { schema: getProjectByIdSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );

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
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Create a new Project
   * @param {RequestBody} request.body - The project's name and description
   * @returns {ProjectRow} The created project
   */
  server.post('/', { schema: createProjectSchema }, async (request, reply) => {
    const { name, description = null } = request.body as {
      name: string;
      description?: string | null;
    };

    const mysql = server.mysql;
    const connection = await mysql.getConnection();

    try {
      // Create record
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO projects (name, description) VALUES (?, ?)',
        [name, description],
      );

      const projectId = result.insertId;

      // Get the created project
      const [projects] = await connection.query<ProjectRow[]>(
        'SELECT * FROM projects WHERE id = ?',
        [projectId],
      );

      reply.status(201).send(projects[0]);
    } catch (err) {
      server.log.error(err);
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Error creating project',
      });
    } finally {
      connection.release();
    }
  });

  /**
   * Update a project
   * @param {number} id - The ID of the project
   * @param {RequestBody} request.body - The updated name and description
   * @returns {ProjectRow} The updated project
   */
  server.put(
    '/:id',
    { schema: updateProjectSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const { name, description = null } = request.body as {
        name: string;
        description?: string | null;
      };

      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        // Verify project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT id FROM projects WHERE id = ?',
          [id],
        );

        if (existingProjects.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${id} not found`,
          });
        }

        // Update record
        await connection.query<ResultSetHeader>(
          'UPDATE projects SET name = ?, description = ? WHERE id = ?',
          [name, description, id],
        );

        // Get the updated project
        const [projects] = await connection.query<ProjectRow[]>(
          'SELECT * FROM projects WHERE id = ?',
          [id],
        );

        reply.send(projects[0]);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error updating project',
        });
      } finally {
        connection.release();
      }
    },
  );

  /**
   * Delete a project
   * @param {number} id - The ID of the project
   */
  server.delete(
    '/:id',
    { schema: deleteProjectSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      try {
        // Verify project exists
        const [existingProjects] = await connection.query<ProjectRow[]>(
          'SELECT id FROM projects WHERE id = ?',
          [id],
        );

        if (existingProjects.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Project with ID ${id} not found`,
          });
        }

        // Delete record
        await connection.query<ResultSetHeader>(
          'DELETE FROM projects WHERE id = ?',
          [id],
        );

        reply.status(204).send();
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error deleting project',
        });
      } finally {
        connection.release();
      }
    },
  );
}
