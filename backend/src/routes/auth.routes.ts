import { FastifyInstance } from 'fastify';
import { Type } from '@fastify/type-provider-typebox';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
}

interface RequestBody {
  username: string;
  password: string;
  email?: string;
}

export default async function authRoutes(
  server: FastifyInstance,
): Promise<void> {
  // Register schema
  const registerSchema = {
    body: Type.Object({
      username: Type.String({ minLength: 3 }),
      password: Type.String({ minLength: 6 }),
      email: Type.String({ format: 'email' }),
    }),
    response: {
      201: Type.Object({
        id: Type.Number(),
        username: Type.String(),
        email: Type.String(),
      }),
    },
  };

  // Login schema
  const loginSchema = {
    body: Type.Object({
      username: Type.String(),
      password: Type.String(),
    }),
    response: {
      200: Type.Object({
        token: Type.String(),
        user: Type.Object({
          id: Type.Number(),
          username: Type.String(),
          email: Type.String(),
        }),
      }),
    },
  };

  /**
   * Registers a new user
   * @param {RequestBody} request.body - The user's username, password, and email
   * @returns {UserRow} The created user
   */
  server.post(
    '/register',
    { schema: registerSchema },
    async (request, reply) => {
      const { username, password, email } = request.body as RequestBody;

      try {
        const mysql = server.mysql;
        const connection = await mysql.getConnection();

        // Validate if username or email already exists
        const [existingUsers] = await connection.query<UserRow[]>(
          'SELECT * FROM users WHERE username = ? OR email = ?',
          [username, email],
        );

        if (existingUsers.length > 0) {
          connection.release();
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: 'Username or email already exists',
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create record
        const [result] = await connection.query<ResultSetHeader>(
          'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
          [username, hashedPassword, email],
        );

        const userId = result.insertId;

        // Get the created user
        const [users] = await connection.query<UserRow[]>(
          'SELECT id, username, email FROM users WHERE id = ?',
          [userId],
        );

        connection.release();

        const user = users[0];

        reply.status(201).send(user);
      } catch (err) {
        server.log.error(err);
        reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Error creating user',
        });
      }
    },
  );

  /**
   * Logs in a user
   * @param {RequestBody} request.body - The user's username and password
   * @returns {UserRow} The logged in user
   */
  server.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body as RequestBody;

    try {
      const mysql = server.mysql;
      const connection = await mysql.getConnection();

      // Find user
      const [users] = await connection.query<UserRow[]>(
        'SELECT * FROM users WHERE username = ?',
        [username],
      );

      connection.release();

      if (users.length === 0) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid username or password',
        });
      }

      const user = users[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid username or password',
        });
      }

      // JWT
      const token = server.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      reply.send({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      server.log.error(err);
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Error during login',
      });
    }
  });
}
