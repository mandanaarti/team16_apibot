'use strict';

const redis = require('redis');
const { redisConfig } = require('../config');
const logger = require('./logger');

const client = redis.createClient(redisConfig);

client.on('connect', () => {
  logger.info('Connected to Redis.');
});
client.on('error', (error) => {
  logger.error(`Redis Error: ${error}`);
});

module.exports = client;
