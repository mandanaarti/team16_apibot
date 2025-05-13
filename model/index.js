'use strict';

const async = require('async');
const { promisify } = require('util');
const redis = require('../utils/redis');
const logger = require('../utils/logger');
const { redisConfig } = require('../config');
const { sendMessageApi } = require('../utils/send-message-api');
const pgPool = require('../utils/pg');
const humps = require('humps');

const redisKeyPrefix = redisConfig.prefix;
const setAsync = promisify(redis.set).bind(redis);
const getAsync = promisify(redis.get).bind(redis);
const delAsync = promisify(redis.del).bind(redis);

const createUser = async (userMobile, userContext) => {
  const userKey = `${redisKeyPrefix}_${userMobile}`;
  const query = `INSERT INTO users (mobile, context) VALUES ($1, $2)`;
  const values = [
    userMobile,
    JSON.stringify(userContext),
  ];
  await pgPool.query(query, values);
  await setAsync(userKey, JSON.stringify(userContext), 'PX', 60 * 1000 * 60);
};

const getUserContext = async (userMobile) => {
  const userKey = `${redisKeyPrefix}_${userMobile}`;
  const user = await getAsync(userKey);
  if (user) {
    return JSON.parse(user);
  }
  const query = 'SELECT context FROM users WHERE mobile = $1';
  const values = [userMobile];
  const result = await pgPool.query(query, values);
  const camelCasedRows = humps.camelizeKeys(result.rows);
  if (camelCasedRows.length > 0) return camelCasedRows[0].context;
  return null;
};

const updateUserContext = async (userMobile, userContext) => {
  const userKey = `${redisKeyPrefix}_${userMobile}`;
  await delAsync(userKey);
  const query = 'UPDATE users SET context = $1 WHERE mobile = $2';
  const values = [userContext, userMobile];
  const result = await pgPool.query(query, values);
  if (result.rowCount === 0) {
    return await createUser(userMobile, userContext);
  }
  await setAsync(userKey, JSON.stringify(userContext), 'PX', 60 * 1000 * 60);
};

const getMessageLock = async (userMobile, lockId) => {
  let redisKey = `${redisKeyPrefix}${userMobile}`;
  const isLockAvailable = await setAsync(
    redisKey,
    lockId,
    'NX',
    'PX',
    60 * 1000
  );
  if (isLockAvailable === null) return false;
  return true;
};

const releaseMessageLock = async (userMobile, lockId) => {
  let redisKey = `${redisKeyPrefix}${userMobile}`;
  const redisLockId = await getAsync(redisKey);
  if (redisLockId === lockId) await delAsync(redisKey);
  else
    throw new Error(
      `Invalid lock state: userMobile: ${userMobile}, lockId: ${lockId}`
    );
};

const isUserValidationLocked = async (userMobile) => {
  const redisLock = await getAsync(`${redisKeyPrefix}user_lock_${userMobile}`);
  if (redisLock === null) return false;
  return true;
};

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

const sendText = async (waNumber, userMobile, message) => {
  logger.debug(`Message: ${message.text}`);
  await sendMessageApi(waNumber, userMobile, message, 'text');
};

const sendImage = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Image link - ${message.url}`);
  await sendMessageApi(waNumber, userMobile, message, 'image');
};

const sendImageId = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Image link - ${message.url}`);
  await sendMessageApi(waNumber, userMobile, message, 'image');
};

const sendDocument = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Document link - ${message.url}`);
  logger.debug(`Message: Document text - ${message.text}`);
  await sendMessageApi(waNumber, userMobile, message, 'document');
};

const sendMedia = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Document link - ${message.url}`);
  logger.debug(`Message: Document text - ${message.text}`);
  logger.debug(`Message: Document body - ${message.body}`);
  await sendMessageApi(waNumber, userMobile, message, 'document');
};
const sendMediaById = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Document Id - ${message.id}`);
  logger.debug(`Message: Document name - ${message.name}`);
  logger.debug(`Message: Document body - ${message.body}`);
  await sendMessageApi(waNumber, userMobile, message, 'document');
};

const sendVideo = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Video link - ${message.url}`);
  logger.debug(`Message: Video text - ${message.text}`);
  await sendMessageApi(waNumber, userMobile, message, 'video');
};

const sendVideoId = async (waNumber, userMobile, message) => {
  logger.debug(`Message: Video link - ${message.id}`);
  logger.debug(`Message: Video text - ${message.text}`);
  await sendMessageApi(waNumber, userMobile, message, 'video');
};

const sendContact = async (waNumber, userMobile, message) => {
  logger.debug(
    `Message: Contact phone - ${JSON.stringify(message.contact.phone)}`
  );
  logger.debug(
    `Message: Contact name - ${JSON.stringify(message.contact.name)}`
  );
  logger.debug(
    `Message: Contact company - ${JSON.stringify(message.contact.company)}`
  );
  await sendMessageApi(waNumber, userMobile, message, 'contact');
};

const sendButton = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'button');
};

const sendMultiSelectButton = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'multi_select_button');
};

const sendCard = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'card');
};

const sendArticleButton = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'article_button');
};

const sendTemplate = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'template');
};

const sendRichInput = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'rich_input');
};

const sendImageText = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'image_text');
};

const sendVoiceNote = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'voice_note');
};

const sendAudio = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'audio');
};

const sendAction = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'action');
};

const sendLocation = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'location');
};

const sendArticle = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'article');
};

const sendAudioId = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'audio');
};

const sendScoreCard = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'scorecard');
};

const sendCatalogList = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'catalog_list');
};

const sendProductList = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'product_list');
};

const sendVideoStream = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'video_stream');
};

const sendDocumentId = async (waNumber, userMobile, message) => {
  await sendMessageApi(waNumber, userMobile, message, 'document');
};

const sendMessage = async (waNumber, userMobile, responseMessage) => {
  logger.debug(`-------Message-------\nTo: ${userMobile}`);
  await async.eachSeries(responseMessage, async (message) => {
    switch (message.type) {
      case 'TEXT':
        await sendText(waNumber, userMobile, message);
        break;
      case 'IMAGE':
        await sendImage(waNumber, userMobile, message);
        break;
      case 'IMAGE_ID':
        await sendImageId(waNumber, userMobile, message);
        break;
      case 'MEDIA':
        await sendMedia(waNumber, userMobile, message);
        break;
      case 'MEDIA_ID':
        await sendMediaById(waNumber, userMobile, message);
        break;
      case 'DOCUMENT':
        await sendDocument(waNumber, userMobile, message);
        break;
      case 'VIDEO':
        await sendVideo(waNumber, userMobile, message);
        break;
      case 'VIDEO_ID':
        await sendVideoId(waNumber, userMobile, message);
        break;
      case 'CONTACT':
        await sendContact(waNumber, userMobile, message);
        break;
      case 'BUTTON':
        await sendButton(waNumber, userMobile, message);
        break;
      case 'MULTISELECTBUTTON':
        await sendMultiSelectButton(waNumber, userMobile, message);
        break;
      case 'CARD':
        await sendCard(waNumber, userMobile, message);
        break;
      case 'ARTICLEBUTTON':
        await sendArticleButton(waNumber, userMobile, message);
        break;
      case 'TEMPLATE':
        await sendTemplate(waNumber, userMobile, message);
        break;
      case 'RICHINPUT':
        await sendRichInput(waNumber, userMobile, message);
        break;
      case 'IMAGE_TEXT':
        await sendImageText(waNumber, userMobile, message);
        break;
      case 'VOICE_NOTE':
        await sendVoiceNote(waNumber, userMobile, message);
        break;
      case 'AUDIO':
        await sendAudio(waNumber, userMobile, message);
        break;
      case 'CONTACTS':
        await sendContact(waNumber, userMobile, message);
        break;
      case 'ACTION':
        await sendAction(waNumber, userMobile, message);
        break;
      case 'LOCATION':
        await sendLocation(waNumber, userMobile, message);
        break;
      case 'ARTICLE':
        await sendArticle(waNumber, userMobile, message);
        break;
      case 'DOCUMENT_ID':
        await sendDocumentId(waNumber, userMobile, message);
        break;
      case 'AUDIO_ID':
        await sendAudioId(waNumber, userMobile, message);
        break;
      case 'SCORECARD':
        await sendScoreCard(waNumber, userMobile, message);
        break;
      case 'CATALOGLIST':
        await sendCatalogList(waNumber, userMobile, message);
        break;
      case 'PRODUCTLIST':
        await sendProductList(waNumber, userMobile, message);
        break;
      case 'VIDEOSTREAM':
        await sendVideoStream(waNumber, userMobile, message);
          break;
      default:
        break;
    }
  });
};

const fetchString = async (stringId, userMedium) => {
  const redisKey = `${redisKeyPrefix}-StringId-${stringId}-${userMedium}`;
  let data = await getAsync(redisKey);
  if (data) {
    return data;
  }
  const query = `SELECT string_data FROM strings WHERE string_id = $1 AND medium = $2`;
  const values = [stringId, userMedium];
  const result = await pgPool.query(query, values);
  const camelCasedRows = humps.camelizeKeys(result.rows);
  if (camelCasedRows.length > 0) {
    data = camelCasedRows[0].stringData;
    await setAsync(redisKey, data);
    return data;
  }
  logger.error({ message: `String is Not Present for string id ${stringId}` });
  return null;
};

const getString = async (stringId, userMedium, variables = null) => {
  let stringData = await fetchString(stringId, userMedium);

  if (variables != null) {
    for (const [key, value] of Object.entries(variables)) {
      if(value!=null) stringData = stringData.replaceAll(`<${key}>`, value);
    }
  }
  return stringData;
};

const getConfig = async (attributeName) => {
  const redisKey = `${redisKeyPrefix}-Config-${attributeName}`;
  let data = await getAsync(redisKey);
  if (data) {
    return JSON.parse(data);
  }
  const query = `SELECT value FROM config WHERE attribute_name = $1`;
  const values = [attributeName];
  const result = await pgPool.query(query, values);
  const camelCasedRows = humps.camelizeKeys(result.rows);
  if (camelCasedRows.length > 0) {
    data = camelCasedRows[0].value;
    await setAsync(redisKey, data);
    return JSON.parse(data);
  }
  return null;
};

module.exports = {
  createUser,
  getUserContext,
  updateUserContext,
  getMessageLock,
  releaseMessageLock,
  isUserValidationLocked,
  constructError,
  sendMessage,
  getString,
  getConfig,
};
