/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
'use strict';

const model = require('../../model');
const { validateMcq, getQuestionOptionsArray } = require('../../utils/helpers');
const { Text, Button } = require('../../utils/message-types');
const logger = require('../../utils/logger');

const awaitNext = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
  isReturn = false,
}) => {
  const responseMessage = [];
  const maxAnswer = userContext.stepData.questionOptions.length;
  const { isValid, validationMessage } = validateMcq(
    userMessage,
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

  const chooseMediumString = await model.getString('ST003', userMedium);
  const allMediums = await model.getConfig('mediumOptions');
  const promiseArray = [];
  for (const [medium, stringId] of Object.entries(allMediums)) {
    promiseArray.push(model.getString(stringId, medium));
  }
  const mediumStrings = await Promise.all(promiseArray);
  
  responseMessage.push(
    new Button(
      new Text(chooseMediumString),
      getQuestionOptionsArray(mediumStrings)
    )
  );

  userContext.stepName = 'awaitMedium';
  userContext.stepData = {
    questionOptions: Object.keys(allMediums),
  };

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

module.exports = awaitNext;
