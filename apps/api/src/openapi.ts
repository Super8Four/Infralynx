export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Infralynx API',
    version: '0.1.0',
    description: 'REST API for the Infralynx IPAM and DCIM platform.',
  },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Return API liveness information',
        responses: {
          '200': {
            description: 'The API is running.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/ipam/sites': {
      get: {
        summary: 'List sites',
        responses: { '200': { description: 'Sites' } },
      },
    },
    '/ipam/vrfs': {
      get: {
        summary: 'List VRFs',
        responses: { '200': { description: 'VRFs' } },
      },
    },
    '/ipam/prefixes': {
      get: {
        summary: 'List prefixes',
        responses: { '200': { description: 'Prefixes' } },
      },
      post: {
        summary: 'Create a prefix',
        responses: {
          '201': { description: 'Prefix created' },
          '400': { description: 'Invalid prefix' },
          '409': { description: 'Prefix already exists' },
        },
      },
    },
    '/ipam/prefixes/{id}': {
      delete: {
        summary: 'Delete a prefix',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Prefix deleted' },
          '404': { description: 'Not found' },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        required: ['status', 'service', 'version', 'timestamp'],
        properties: {
          status: { type: 'string', const: 'ok' },
          service: { type: 'string' },
          version: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
} as const;
