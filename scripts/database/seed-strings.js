const pgPool = require('../../utils/pg');
const logger = require('../../utils/logger');
const strings = require('../constants/strings');

const seedStrings = async () => {
  try {
    await pgPool.query('BEGIN');

    // Drop table if exists
    await pgPool.query('DROP TABLE IF EXISTS strings');

    // Create table if not exists
    await pgPool.query('CREATE TABLE IF NOT EXISTS strings (string_id VARCHAR(10), medium VARCHAR(5), string_data TEXT, PRIMARY KEY (string_id, medium))');

    // Delete all data
    await pgPool.query('DELETE FROM strings');

    // Insert data
    for (const item of strings) {
      const query = 'INSERT INTO strings (string_id, medium, string_data) VALUES ($1, $2, $3)';
      const values = [item.stringId, item.medium, item.stringData];
      await pgPool.query(query, values);
    }
    await pgPool.query('COMMIT');
  } catch (error) {
    await pgPool.query('ROLLBACK');
    logger.error({ message: 'Error seeding strings', error });
  }
};

module.exports = {
  seedStrings,
};