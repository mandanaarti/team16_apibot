const crypto = require('crypto');
const moment = require('moment');
const logger = require('./logger');
const { environment, statsApiConfig, klusterConfig } = require('../config');
const pgPool = require('./pg');

const insertRegisteredUser = async (userMobile) => {
  if (environment === 'development' || statsApiConfig.enableStats != 1) {
    logger.info(userMobile);
    return logger.info('Not Inserting insertRegisteredUser in Development');
  }
  try {
    const query = `INSERT INTO registration_stats (mobile, bot_id, device_id, time_stamp) VALUES ($1, $2, $3, $4)`;
    const values = [userMobile, klusterConfig.botId, crypto.createHash('md5').update(userMobile).digest('hex'), moment(new Date()).format('YYYY-MM-DD HH:mm:ss')];
    await pgPool.query(query, values);
    logger.info('Insert registered user to db ok');
  } catch (err) {
    logger.error('Error In Inserting data in User Registration Stat', {
      userMobile, error: err,
    });
  }
};

/**
 *
 *
 * @param {{mobile: string, click_type: string}} data
 */
const insertPersistentMenuStats = async (data) => {
  if (environment === 'development' || statsApiConfig.enableStats != 1) {
    logger.info(data);
    return logger.info('Not Inserting Persistent Menu stats in Development');
  }
  try {
    const query = `INSERT INTO persistent_menu_stats (mobile, bot_id, click_type, time_stamp) VALUES ($1, $2, $3, $4)`;
    const values = [data.mobile, klusterConfig.botId, data.click_type, moment().format('YYYY-MM-DD HH:mm:ss')];
    await pgPool.query(query, values);
    logger.info('Insert persistent menu stats to db ok');
  } catch (err) {
    logger.error('Error In Inserting data in Persistent Menu Stat', {
      ...data,
      error: err,
    });
  }
};

module.exports = {
  insertRegisteredUser,
  insertPersistentMenuStats,
};