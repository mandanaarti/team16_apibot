/* eslint-disable strict */
/* eslint-disable max-len */
'use strict';

const entryPoint = require('./entry-point');
const awaitMedium = require('./await-medium');
const awaitNext = require('./await-next');
const awaitName = require('./await-name');
const awaitViewMessageTypes = require('./await-view-message-types');

const steps = {
  entryPoint,
  awaitMedium,
  awaitNext,
  awaitName,
  awaitViewMessageTypes,
};

const processMessage = async (
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
  isReturn
) => {
  try {
    const currentStep = steps[userContext.stepName];
    return await currentStep({
      waNumber,
      userMobile,
      userMessage,
      userContext,
      userMedium,
      isReturn,
    });
  } catch (e) {
    throw e;
  }
};

module.exports = {
  processMessage,
};
