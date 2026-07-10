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
