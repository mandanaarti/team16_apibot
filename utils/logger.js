'use strict';

const { createLogger, format, transports } = require('winston');
const colors = require('colors');
const path = require('path');
const { environment } = require('../config');

const { printf } = format;

const loggingLevels = {
  production: 'info',
  test: 'info',
  development: 'debug',
};
let loggingLevel = loggingLevels[environment];
if (!loggingLevel) {
  loggingLevel = 'debug';
}

function formatLevel(level) {
  if (level === 'error') return colors.red;
  if (level === 'info') return colors.green;
  if (level === 'warn') return colors.yellow;
  return colors.white;
}

function isEmpty(params) {
  if (!params) return true;
  if (params && Object.keys(params).length === 0) return true;
  return false;
}

const myFormat = printf(({ timestamp, level, message, src, ...params }) => {
  if (src) {
    src = `[${path.basename(src).green}]`;
  } else {
    src = '';
  }

  let result = `${timestamp} [${formatLevel(level)(level.padEnd(5, ' '))}] ${src}: ${message}`;

  // eslint-disable-next-line guard-for-in
  if (params.stack) {
    result += `\n${params.stack}`;
  } else {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const prop in params) {
      const obj = params[prop];
      if (obj instanceof Error) {
        result += `\n${obj.stack}`;
      }
    }
    if (!isEmpty(params)) result += `\n${JSON.stringify(params, null, 4)}`;
  }
  return result;
});

const logger = createLogger({
  format: format.combine(format.simple(), format.timestamp(), format.splat(), myFormat),
  transports: [new transports.Console()],
});

logger.on('error', (e) => {
  console.log(e);
});

module.exports = logger;