/**
 * Shared schema definitions for routes
 * These schemas are compatible with Fastify validation and OpenAPI documentation
 */

// Common schemas
export const errorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

export const notFoundResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

// Auth schemas
export const registerSchema = {
  tags: ['auth'],
  description: 'Register a new user',
  body: {
    type: 'object',
    required: ['username', 'password', 'email'],
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        description: 'Username (minimum 3 characters)',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Password (minimum 6 characters)',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User ID',
        },
        username: {
          type: 'string',
          description: 'Username',
        },
        email: {
          type: 'string',
          description: 'User email address',
        },
      },
    },
    409: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const loginSchema = {
  tags: ['auth'],
  description: 'User login',
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        description: 'Username',
      },
      password: {
        type: 'string',
        description: 'Password',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT token',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              description: 'User email address',
            },
          },
        },
      },
    },
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

// Project schemas
export const projectRequestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Project name',
    },
    description: {
      type: 'string',
      description: 'Project description',
    },
  },
};

export const projectResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      description: 'Project ID',
    },
    name: {
      type: 'string',
      description: 'Project name',
    },
    description: {
      type: ['string', 'null'],
      description: 'Project description',
    },
    created_at: {
      type: 'string',
      description: 'Creation timestamp',
    },
    updated_at: {
      type: 'string',
      description: 'Last update timestamp',
    },
  },
};

export const projectIdParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'number',
      description: 'Project ID',
    },
  },
};

// Project route schemas
export const getAllProjectsSchema = {
  tags: ['projects'],
  description: 'Get all projects',
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: 'array',
      items: projectResponseSchema,
    },
    500: errorResponseSchema,
  },
};

export const getProjectByIdSchema = {
  tags: ['projects'],
  description: 'Get a project by ID',
  security: [{ bearerAuth: [] }],
  params: projectIdParamSchema,
  response: {
    200: projectResponseSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

export const createProjectSchema = {
  tags: ['projects'],
  description: 'Create a new project',
  security: [{ bearerAuth: [] }],
  body: projectRequestSchema,
  response: {
    201: projectResponseSchema,
    500: errorResponseSchema,
  },
};

export const updateProjectSchema = {
  tags: ['projects'],
  description: 'Update a project',
  security: [{ bearerAuth: [] }],
  params: projectIdParamSchema,
  body: projectRequestSchema,
  response: {
    200: projectResponseSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

export const deleteProjectSchema = {
  tags: ['projects'],
  description: 'Delete a project',
  security: [{ bearerAuth: [] }],
  params: projectIdParamSchema,
  response: {
    204: {
      type: 'null',
      description: 'Project deleted successfully',
    },
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

// Service Order schemas
export const serviceOrderRequestSchema = {
  type: 'object',
  required: ['name', 'category', 'project_id'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Service order name',
    },
    category: {
      type: 'string',
      minLength: 1,
      description: 'Service category',
    },
    description: {
      type: 'string',
      description: 'Service order description',
    },
    project_id: {
      type: 'number',
      description: 'ID of the associated project',
    },
    is_approved: {
      type: 'boolean',
      description: 'Approval status',
    },
  },
};

export const serviceOrderResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      description: 'Service order ID',
    },
    name: {
      type: 'string',
      description: 'Service order name',
    },
    category: {
      type: 'string',
      description: 'Service category',
    },
    description: {
      type: ['string', 'null'],
      description: 'Service order description',
    },
    project_id: {
      type: 'number',
      description: 'ID of the associated project',
    },
    is_approved: {
      type: 'boolean',
      description: 'Approval status',
    },
    created_date: {
      type: 'string',
      description: 'Creation timestamp',
    },
    updated_date: {
      type: 'string',
      description: 'Last update timestamp',
    },
  },
};

export const serviceOrderExtendedSchema = {
  type: 'object',
  properties: {
    ...serviceOrderResponseSchema.properties,
    project_name: {
      type: 'string',
      description: 'Name of the associated project',
    },
  },
};

export const serviceOrderIdParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'number',
      description: 'Service order ID',
    },
  },
};

export const serviceOrderQuerySchema = {
  type: 'object',
  properties: {
    project_id: {
      type: 'number',
      description: 'Filter by project ID',
    },
  },
};

// Service Order route schemas
export const getAllServiceOrdersSchema = {
  tags: ['service-orders'],
  description: 'Get all service orders, optionally filtered by project ID',
  security: [{ bearerAuth: [] }],
  querystring: serviceOrderQuerySchema,
  response: {
    200: {
      type: 'array',
      items: serviceOrderExtendedSchema,
    },
    500: errorResponseSchema,
  },
};

export const getServiceOrderByIdSchema = {
  tags: ['service-orders'],
  description: 'Get a service order by ID',
  security: [{ bearerAuth: [] }],
  params: serviceOrderIdParamSchema,
  response: {
    200: serviceOrderExtendedSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

export const createServiceOrderSchema = {
  tags: ['service-orders'],
  description: 'Create a new service order',
  security: [{ bearerAuth: [] }],
  body: serviceOrderRequestSchema,
  response: {
    201: serviceOrderResponseSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

export const updateServiceOrderSchema = {
  tags: ['service-orders'],
  description: 'Update a service order',
  security: [{ bearerAuth: [] }],
  params: serviceOrderIdParamSchema,
  body: serviceOrderRequestSchema,
  response: {
    200: serviceOrderResponseSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};

export const deleteServiceOrderSchema = {
  tags: ['service-orders'],
  description: 'Delete a service order',
  security: [{ bearerAuth: [] }],
  params: serviceOrderIdParamSchema,
  response: {
    204: {
      type: 'null',
      description: 'Service order deleted successfully',
    },
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
};
