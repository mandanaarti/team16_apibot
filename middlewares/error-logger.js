'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');
const { format, transports } = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console(), // to print log in console
  ],
});
logger.on('error', (e) => { console.log(e) });

module.exports = expressWinston.errorLogger({
  winstonInstance: logger,
});
