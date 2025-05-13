module.exports = {
  validateMcq: (maxAnswer) =>
    `Kindly answer with a number between *1* and *${maxAnswer}*.`,
  unregisterMessage: 'User resetted succesfully.',
  redisLockMessage:
    'Please wait while we are processing your previous message.',
  studentValidationLockMessage:
    'Please Wait while we are fetching your summary report.',
  typeExceptionMessage: `This is not a valid input type. Please use another input method.`,
  invalidLocationMessage: `Invalid Input! Location must contain valid latitude and longitude.`,
};
