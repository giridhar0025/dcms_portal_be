const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = require('./src/config/express');
const { connect: connectDB } = require('./src/config/database');
const { connectQueue } = require('./src/config/queue');

const swaggerDocument = YAML.load('./src/docs/api.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  // await connectQueue();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
