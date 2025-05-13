/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
'use strict';

const model = require('../../model');
const { validateMcq } = require('../../utils/helpers');
const { Text } = require('../../utils/message-types');
const logger = require('../../utils/logger');

const awaitMedium = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
  isReturn = false,
}) => {
  const responseMessage = [];

  let userAnswer = parseInt(userMessage, 10);
  const maxAnswer = userContext.stepData.questionOptions.length;
  const { isValid, validationMessage } = validateMcq(
    userAnswer,
    maxAnswer,
    userMedium
  );
  if (!isValid) {
    const validationMessageFinal = [new Text(validationMessage)];
    model
      .sendMessage(waNumber, userMobile, validationMessageFinal)
      .catch((err) =>
        logger.error('Send Message Failure ', {
          waNumber,
          userMobile,
          validationMessageFinal,
          err: model.constructError(err),
        })
      );
    return;
  }

  userMedium = userContext.stepData.questionOptions[userAnswer - 1];
  userContext.userMedium = userMedium;

  const enterNameString = await model.getString('ST006', userMedium);
  responseMessage.push(new Text(enterNameString));

  userContext.stepName = 'awaitName';
  userContext.stepData = { questionOptions: [true] };

  await model.updateUserContext(userMobile, userContext);
  model.sendMessage(waNumber, userMobile, responseMessage).catch((err) =>
    logger.error('Send Message Failure ', {
      waNumber,
      userMobile,
      responseMessage,
      err: model.constructError(err),
    })
  );
  return;
};

module.exports = awaitMedium;
