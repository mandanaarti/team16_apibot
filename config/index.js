'use strict';

require('dotenv').config();

module.exports = {
  environment: process.env.ENVIRONMENT || 'development',
  webConfig: {
    port: process.env.NODE_PORT,
  },
  botConfig: {
    medium: process.env.MEDIUM,
    waProvider: process.env.WA_PROVIDER,
  },
  redisConfig: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX,
  },
  pgConfig: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
  statsApiConfig: {
    enableStats: parseInt(process.env.ENABLE_STATS, 10),
  },
  klusterConfig: {
    botId: process.env.BOT_UUID,
    apiUrl: process.env.KLUSTER_API_URL,
    apiToken: process.env.KLUSTER_API_TOKEN,
    httpConfig: {
      maxSockets: 100,
      maxFreeSockets: 10,
      timeout: 50000,
      freeSocketTimeout: 30000,
    },
  },
};
