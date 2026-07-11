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
    '/facilities/regions': {
      get: {
        summary: 'List facility regions',
        responses: { '200': { description: 'Regions' } },
      },
      post: {
        summary: 'Create a facility region',
        responses: {
          '201': { description: 'Region created' },
          '400': { description: 'Invalid region' },
          '409': { description: 'Region already exists' },
        },
      },
    },
    '/facilities/site-groups': {
      get: {
        summary: 'List facility site groups',
        responses: { '200': { description: 'Site groups' } },
      },
      post: {
        summary: 'Create a facility site group',
        responses: {
          '201': { description: 'Site group created' },
          '400': { description: 'Invalid site group' },
          '409': { description: 'Site group already exists' },
        },
      },
    },
    '/facilities/sites': {
      get: {
        summary: 'List managed sites',
        responses: { '200': { description: 'Sites' } },
      },
      post: {
        summary: 'Create a managed site',
        responses: {
          '201': { description: 'Site created' },
          '400': { description: 'Invalid site' },
          '409': { description: 'Site already exists' },
        },
      },
    },
    '/facilities/locations': {
      get: {
        summary: 'List managed locations',
        responses: { '200': { description: 'Locations' } },
      },
      post: {
        summary: 'Create a managed location',
        responses: {
          '201': { description: 'Location created' },
          '400': { description: 'Invalid location' },
          '409': { description: 'Location already exists' },
        },
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
