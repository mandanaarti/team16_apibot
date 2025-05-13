const kluster = require('./kluster');
const { botConfig } = require('../../config');

const sendMessageApi = async (waNumber, user, message, type, caption, mime) => {
  switch (botConfig.waProvider) {
    case 'KLUSTER':
      await kluster.sendMessageApi(
        waNumber,
        user,
        message,
        type,
        caption,
        mime
      );
      break;
    default:
      break;
  }
};

module.exports = {
  sendMessageApi,
};
