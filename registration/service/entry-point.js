const model = require('../../model');
const { Text, Button } = require('../../utils/message-types');
const { getQuestionOptionsArray } = require('../../utils/helpers');
const logger = require('../../utils/logger');
const entryPoint = async ({
  waNumber,
  userMobile,
  userContext,
  userMedium,
  userMessage,
  isReturn = false,
}) => {
  const responseMessage = [];
  const questionOptionsArray = [];
  const [welcomeString, continueString] = await Promise.all([
    model.getString(`ST001`, userMedium),
    model.getString(`ST002`, userMedium),
  ]);
  questionOptionsArray.push(continueString);
  responseMessage.push(
    new Button(
      new Text(welcomeString),
      getQuestionOptionsArray(questionOptionsArray)
    )
  );

  userContext.stepName = 'awaitNext';
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
};

module.exports = entryPoint;
