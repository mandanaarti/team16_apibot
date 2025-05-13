'use strict';
const setTZ = require('set-tz');

setTZ('Asia/Calcutta');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const { webConfig } = require('./config');
const apiAuth = require('./middlewares/api-auth');
const errorHandler = require('./middlewares/error-handler');
const errorLogger = require('./middlewares/error-logger');
const routes = require('./routes');
const logger = require('./utils/logger');

console.log(new Date().toString());
const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/ping', (req, res) => res.sendStatus(httpStatus.OK));
app.use('/api', apiAuth, routes);
app.use(errorHandler);
app.use(errorLogger);

const server = app.listen(webConfig.port, () =>
  logger.info(`API running on port ${webConfig.port}.`)
);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

module.exports = {
  app,
};
