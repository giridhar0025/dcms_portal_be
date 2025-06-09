const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {},
  apis: ['./src/docs/api.yaml'],
};

module.exports = swaggerJSDoc(options);
