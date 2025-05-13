/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
'use strict';

const model = require('../../model');
const { validateName, getQuestionOptionsArray } = require('../../utils/helpers');
const { Text, Button } = require('../../utils/message-types');
const logger = require('../../utils/logger');

const awaitName = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
  isReturn = false,
}) => {
  const responseMessage = [];
  const { isValid, validationMessage } = await validateName(
    userMessage,
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

  const userName = userMessage.trim();
  userContext.profileData = { userName };
  const [thankYouString, continueString] = await Promise.all([
    model.getString('ST007', userMedium, { userName }),
    model.getString('ST002', userMedium),
  ]);

  responseMessage.push(
    new Button(
      new Text(thankYouString),
      getQuestionOptionsArray([continueString])
    )
  );

  userContext.stepName = 'awaitViewMessageTypes';
  userContext.stepData = { questionOptions: [true], firstTime: true };

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

module.exports = awaitName;
