/* eslint-disable max-len */
const homeMenu = require('./home-menu');
const changeMedium = require('./change-medium');

const steps = [
  homeMenu,
  changeMedium,
];

const processMessage = async (
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium
) => {
  try {
    const userAnswer = parseInt(userMessage, 10);
    if (userAnswer < steps.length) {
      const currentStep = steps[userAnswer];
      await currentStep({
        waNumber,
        userMobile,
        userMessage,
        userContext,
        userMedium,
      });
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  processMessage,
};
