const pgPool = require('../../utils/pg');
const logger = require('../../utils/logger');

const seedUsers = async () => {
  try {
    await pgPool.query('BEGIN');

    // Drop table if exists
    await pgPool.query('DROP TABLE IF EXISTS users');

    // Create table if not exists
    await pgPool.query('CREATE TABLE if not exists users (mobile VARCHAR(15) PRIMARY KEY, context TEXT)');

    // Delete all data
    await pgPool.query('DELETE FROM users');
    
    await pgPool.query('COMMIT');
  } catch (error) {
    await pgPool.query('ROLLBACK');
    logger.error({ message: 'Error seeding users', error });
  }
}

module.exports = {
  seedUsers,
};
