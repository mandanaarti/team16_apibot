'use strict';

const awaitNext = require('../../registration/service/await-next');
const { insertPersistentMenuStats } = require('../../utils/stats-api');

const changeMedium = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
}) => {
  insertPersistentMenuStats({ click_type: 'Change Medium', mobile: userMobile });
  return await awaitNext({
    waNumber,
    userMobile,
    userContext,
    userMedium,
    userMessage: '1',
    isReturn: true,
  });
};

module.exports = changeMedium;
