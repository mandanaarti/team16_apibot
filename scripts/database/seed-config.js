const pgPool = require('../../utils/pg');
const logger = require('../../utils/logger');
const config = require('../constants/config');

const seedConfig = async () => {
  try {
    await pgPool.query('BEGIN');

    // Drop table if exists
    await pgPool.query('DROP TABLE IF EXISTS config');

    // Create table if not exists
    await pgPool.query('CREATE TABLE IF NOT EXISTS config (attribute_name TEXT PRIMARY KEY, value TEXT)');

    // Delete all data
    await pgPool.query('DELETE FROM config');

    // Insert data
    for (const item of config) {
      const query = 'INSERT INTO config (attribute_name, value) VALUES ($1, $2)';
      const values = [item.attributeName, JSON.stringify(item.value)];
      await pgPool.query(query, values);
    }
    await pgPool.query('COMMIT');
  } catch (error) {
    await pgPool.query('ROLLBACK');
    logger.error({ message: 'Error seeding config', error });
  }
};

module.exports = {
  seedConfig,
};
