'use strict';

const model = require('../../model');
const { Text } = require('../../utils/message-types');
const logger = require('../../utils/logger');
const entryPoint = require('../../registration/service/entry-point');
const { insertPersistentMenuStats } = require('../../utils/stats-api');

const homeMenu = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
}) => {
  const responseMessage = [];
  insertPersistentMenuStats({ click_type: 'Home Menu', mobile: userMobile });
  await model.updateUserContext(userMobile, {
    stepName: 'entryPoint',
    stepData: { questionOptions: [true] },
  });
  const homeMenuString = await model.getString(`ST008`, userMedium);
  responseMessage.push(new Text(homeMenuString));

  model.sendMessage(waNumber, userMobile, responseMessage).catch((err) =>
    logger.error('Send Message Failure ', {
      waNumber,
      userMobile,
      responseMessage,
      err: model.constructError(err),
    })
  );
  return await entryPoint({
    waNumber,
    userMobile,
    userContext,
    userMedium,
    userMessage: '1',
    isReturn: true,
  });
};

module.exports = homeMenu;
