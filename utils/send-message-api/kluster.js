'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const Agent = require('agentkeepalive').HttpsAgent;
const logger = require('../logger');
const { klusterConfig } = require('../../config');
const { transformMessage } = require('../message-transform');

const keepAliveAgent = new Agent(klusterConfig.httpConfig);
const axiosInstance = axios.create({
  httpsAgent: keepAliveAgent,
  timeout: 300 * 1000,
});
axiosRetry(axiosInstance, {
  retries: 3,
  retryCondition: axiosRetry.isRetryableError,
  retryDelay: axiosRetry.exponentialDelay,
});

const sendMessageApi = async (waNumber, user, message, type, caption, mime) => {
  const url = `${klusterConfig.apiUrl}/bots/${klusterConfig.botId}/messages`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${klusterConfig.apiToken}`,
  };
  const responseMessage = transformMessage(message);
  let data = {
    to: user,
  };
  data = Object.assign(data, responseMessage);
  const response = await axiosInstance({
    method: 'post',
    url,
    data,
    headers,
  });
  if (response.status !== 200 && response.status !== 201) {
    logger.error({
      userMobile: user,
      message: 'Error - Swift Send Message API',
      responseCode: response.status,
      requestBody: data,
    });
  } else {
    logger.info({
      userMobile: user,
      message: 'Swift Send Message API',
      responseCode: response.status,
      requestBody: data,
    });
  }
};

module.exports = {
  sendMessageApi,
};
