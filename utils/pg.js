'use strict';

require('dotenv').config();

const pgPool = require('pg').Pool;
const logger = require('./logger');
const { pgConfig } = require('../config');

const pool = new pgPool(pgConfig);

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL.');
});
pool.on('error', (error) => {
  logger.error(`PostgreSQL Error: ${error}`);
});

module.exports = pool;
