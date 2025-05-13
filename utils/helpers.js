const strings = require('../swiftchat/strings');

const validateMcq = (userMessage, maxAnswer, userMedium) => {
  const regex = /^[\d]+$/;
  if (!regex.test(userMessage)) {
    const validationMessage = strings[userMedium].validateMcq(maxAnswer);
    return { isValid: false, validationMessage };
  }
  const userAnswer = parseInt(userMessage, 10);
  if (userAnswer > maxAnswer || userAnswer < 1) {
    const validationMessage = strings[userMedium].validateMcq(maxAnswer);
    return { isValid: false, validationMessage };
  }
  return { isValid: true };
};

const validateName = async (userMessage, userMedium) => {
  const regex = /^[\sa-zA-Z]+$/;
  if (!regex.test(userMessage)) {
    const validationMessage = strings[userMedium].validateName;
    return {
      isValid: false,
      validationMessage,
    };
  }
  return {
    isValid: true,
  };
};

const getQuestionOptionsArray = (options) =>
  options.map((option) => ({
    type: 'solid',
    body: `${option}`,
    reply: `${option}`,
  }));

const constructError = (err) => {
  const error = {
    message: err.message,
  };
  if (err.name) error.name = err.name;
  if (err.config) {
    error.request = {
      url: err.config.url,
      method: err.config.method,
    };
    if (err.config.method == 'get') {
      error.request.data = err.config.params;
    } else if (err.config.method == 'post') {
      error.request.data = err.config.data;
    }
  }
  if (err.response) {
    error.response = {
      status: err.response.status,
    };
    if (err.response.data) {
      error.response.data = err.response.data;
    }
  }
  return error;
};

module.exports = {
  validateMcq,
  validateName,
  getQuestionOptionsArray,
  constructError,
};
