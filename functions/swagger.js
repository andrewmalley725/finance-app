// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance API',
      version: '1.0.0',
      description: '',
    },
  },
  apis: ['./api/routers/api.router.js'], // Specify the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
