const pgPool = require('../../utils/pg');
const logger = require('../../utils/logger');

const seedStatsTables = async () => {
  try {
    await pgPool.query('BEGIN');

    // Drop table if exists
    await pgPool.query('DROP TABLE IF EXISTS registration_stats');
    await pgPool.query('DROP TABLE IF EXISTS persistent_menu_stats');

    // Create table if not exists
    await pgPool.query('CREATE TABLE if not exists registration_stats (mobile VARCHAR(15), bot_id TEXT, device_id TEXT, time_stamp TIMESTAMP, PRIMARY KEY (mobile, bot_id))');
    await pgPool.query('CREATE TABLE if not exists persistent_menu_stats (mobile VARCHAR(15), bot_id TEXT, click_type TEXT, time_stamp TIMESTAMP, PRIMARY KEY (mobile, time_stamp))');
    
    await pgPool.query('COMMIT');
  } catch (error) {
    await pgPool.query('ROLLBACK');
    logger.error({ message: 'Error seeding stats tables', error });
  }
}

module.exports = {
  seedStatsTables,
};
