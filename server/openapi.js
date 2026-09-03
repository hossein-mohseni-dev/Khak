export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Khak API',
    version: '2.0.0',
    description: 'Auth, plant-disease diagnosis, experts, cart checkout and user history.',
  },
  servers: [{ url: '/', description: 'Current host' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: { 200: { description: 'API is up' } },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Create an account',
        responses: { 201: { description: 'Registered' }, 400: { description: 'Validation error' } },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and receive a JWT',
        responses: { 200: { description: 'OK' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/api/me': {
      get: { summary: 'Current profile', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
      put: { summary: 'Update profile', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/api/detect': {
      post: {
        summary: 'Diagnose a plant image (Hugging Face when HF_TOKEN is set)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Diagnosis' } },
      },
    },
    '/api/history': {
      get: { summary: 'Diagnosis history', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/api/products': { get: { summary: 'List products', responses: { 200: { description: 'OK' } } } },
    '/api/experts': { get: { summary: 'List experts', responses: { 200: { description: 'OK' } } } },
    '/api/consultations': {
      get: { summary: 'My consultation requests', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
      post: { summary: 'Request a consultation', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/api/consultations/{id}': {
      patch: {
        summary: 'Update consultation status (pending → confirmed/cancelled → completed)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Updated' }, 409: { description: 'Illegal transition' } },
      },
    },
    '/api/orders': {
      get: { summary: 'My orders', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
      post: { summary: 'Checkout cart', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
  },
}
