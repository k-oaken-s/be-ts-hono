import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NLP API',
      version: '1.0.0',
      description: '日本語テキスト処理のためのAPI',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/interfaces/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options); 