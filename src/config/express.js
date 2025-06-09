const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('../routes');
const { errorHandler } = require('../middlewares/error');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
