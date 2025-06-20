const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('../routes');
const { errorHandler } = require('../middlewares/error');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
