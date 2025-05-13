/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
'use strict';

const Joi = require('@hapi/joi');
const model = require('../../model');
const { Text, Button } = require('../../utils/message-types');
const logger = require('../../utils/logger');

const {
  getMessagePayload,
  getCardMessage,
  getCardImageMessage,
  getCardVideoStreamMessage,
  getCardButton,
  getArticleButton,
  getArticleMessage,
  getArticleImageMessage,
  getActionMessage,
  getActionImageMessage,
  getCatalogListMessage,
  getProductListMessage,
  getCardAction,
  getArticleAction,
  getActionPhone,
  getAvailableMessageTypes,
} = require('../../utils/swiftchat-helpers');

const {
  invalidMessageText,
  invalidViewMoreMessageText,
  invalidWebMessageButtons,
  invalidWebViewMoreMessageButtons,
} = require('../../utils/message-samples');

const awaitViewMessageTypes = async ({
  waNumber,
  userMobile,
  userMessage,
  userContext,
  userMedium,
}) => {

  const environment = 'test';
  const availableMessageTypes = getAvailableMessageTypes();
  const responseMessage = [];
  try {
    userContext.stepName = 'awaitViewMessageTypes';
    userContext.stepData = { questionOptions: [true], firstTime: false };

    await model.updateUserContext(userMobile, userContext);
    if (userMessage in availableMessageTypes) {
      responseMessage.push(availableMessageTypes[`${userMessage}`]);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'no_reply') {
      return;
    }
    if (userMessage.startsWith('text ')) {
      responseMessage.push(new Text(userMessage.substring(5)));
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(card_button|card_button_without_payload) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_payload')) {
        message = await getCardButton('payload', userMessage.split(' ')[1]);
      } else message = await getCardButton(null, userMessage.split(' ')[1]);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(card_button_with_download|card_button_without_download) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_download')) {
        message = await getCardButton(null, userMessage.split(' ')[1], false);
      } else message = await getCardButton(null, userMessage.split(' ')[1], true);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'card'
    || userMessage === 'card_rating_star'
    || userMessage === 'card_rating_thumb'
    || userMessage === 'card_image'
    || userMessage === 'card_button'
    || userMessage === 'card_with_button_without_payload'
    || userMessage === 'card_with_phone_number'
    || userMessage === 'card_with_email'
    || userMessage === 'card_with_view_cart'
    || userMessage === 'card_video_stream') {
      switch (userMessage) {
        case 'card':
          responseMessage.push(await getCardMessage());
          break;
        case 'card_rating_star':
          responseMessage.push(await getCardMessage('star'));
          break;
        case 'card_rating_thumb':
          responseMessage.push(await getCardMessage('thumb'));
          break;
        case 'card_image':
          responseMessage.push(await getCardImageMessage());
          break;
        case 'card_button':
          responseMessage.push(await getCardButton());
          break;
        case 'card_with_button_without_payload':
          responseMessage.push(await getCardButton('payload'));
          break;
        case 'card_with_phone_number':
          responseMessage.push(await getCardAction({ payload: '+911231231231' }, 'phone_number'));
          break;
        case 'card_with_email':
          responseMessage.push(await getCardAction({ payload: 'featureBot@convegenius.com' }, 'email'));
          break;
        case 'card_with_view_cart':
          responseMessage.push(await getCardAction({}, 'view_cart'));
          break;
        case 'card_video_stream':
          responseMessage.push(await getCardVideoStreamMessage());
          break;
        default:
          break;
      }
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'catalog_list'
      || userMessage === 'catalog_list_image') {
      let message;
      if (userMessage === 'catalog_list') {
        message = await getCatalogListMessage(`web-${environment}`, 'text');
      } else if (userMessage === 'catalog_list_image') {
        message = await getCatalogListMessage(`web-${environment}`, 'image');
      }
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'product_list'
    || userMessage === 'single_product_list') {
      let message;
      if (userMessage === 'product_list') {
        message = await getProductListMessage(`web-${environment}`, 'multiple');
      } else if (userMessage === 'single_product_list') {
        message = await getProductListMessage(`web-${environment}`, 'single');
      }
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(article_button|article_button_without_payload) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_payload')) {
        message = await getArticleButton('payload', userMessage.split(' ')[1]);
      } else message = await getArticleButton(null, userMessage.split(' ')[1]);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(article_button_with_download|article_button_without_download) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_download')) {
        message = await getArticleButton(null, userMessage.split(' ')[1], false);
      } else message = await getArticleButton(null, userMessage.split(' ')[1], true);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(action|action_without_payload) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_payload')) {
        message = await getActionMessage('payload', userMessage.split(' ')[1]);
      } else message = await getActionMessage(null, userMessage.split(' ')[1]);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (!(Joi.string().regex(/^(action_with_download|action_without_download) (http|https):\/\/(?=www\.|)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&\/\/=]*)$/).validate(userMessage)).error) {
      let message;
      if (userMessage.includes('without_download')) {
        message = await getActionMessage(null, userMessage.split(' ')[1], false);
      } else message = await getActionMessage(null, userMessage.split(' ')[1], true);
      responseMessage.push(message);
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'action'
    || userMessage === 'action_image'
    || userMessage === 'action_image_rating_star'
    || userMessage === 'action_image_rating_thumb'
    || userMessage === 'action_without_payload'
    || userMessage === 'action_with_phone_number'
    || userMessage === 'action_with_email'
    || userMessage === 'action_with_view_cart') {
      switch (userMessage) {
        case 'action':
          responseMessage.push(await getActionMessage());
          break;
        case 'action_image':
          responseMessage.push(await getActionImageMessage());
          break;
        case 'action_image_rating_thumb':
          responseMessage.push(await getActionImageMessage('thumb'));
          break;
        case 'action_image_rating_star':
          responseMessage.push(await getActionImageMessage('star'));
          break;
        case 'action_without_payload':
          responseMessage.push(await getActionMessage('payload'));
          break;
        case 'action_with_phone_number':
          responseMessage.push(await getActionPhone({ payload: '+911231231231' }, 'phone_number'));
          break;
        case 'action_with_email':
          responseMessage.push(await getActionPhone({ payload: 'featureBot@convegenius.com' }, 'email'));
          break;
        case 'action_with_view_cart':
          responseMessage.push(await getActionPhone({}, 'view_cart'));
          break;
        default:
          break;
      }
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'article'
      || userMessage === 'article_rating_star'
      || userMessage === 'article_rating_thumb'
      || userMessage === 'article_image'
      || userMessage === 'article_button'
      || userMessage === 'article_without_header'
      || userMessage === 'article_without_tags'
      || userMessage === 'article_with_button_without_payload'
      || userMessage === 'article_with_phone_number'
      || userMessage === 'article_with_email'
      || userMessage === 'article_with_view_cart') {
      switch (userMessage) {
        case 'article':
          responseMessage.push(await getArticleMessage());
          break;
        case 'article_rating_star':
          responseMessage.push(await getArticleMessage('star'));
          break;
        case 'article_rating_thumb':
          responseMessage.push(await getArticleMessage('thumb'));
          break;
        case 'article_image':
          responseMessage.push(await getArticleImageMessage());
          break;
        case 'article_button':
          responseMessage.push(await getArticleButton());
          break;
        case 'article_without_header':
          responseMessage.push(await getArticleButton('header'));
          break;
        case 'article_without_tags':
          responseMessage.push(await getArticleButton('tags'));
          break;
        case 'article_with_button_without_payload':
          responseMessage.push(await getArticleButton('payload'));
          break;
        case 'article_with_phone_number':
          responseMessage.push(await getArticleAction({ payload: '+911231231231' }, 'phone_number'));
          break;
        case 'article_with_email':
          responseMessage.push(await getArticleAction({ payload: 'featureBot@convegenius.com' }, 'email'));
          break;
        case 'article_with_view_cart':
          responseMessage.push(await getArticleAction({}, 'view_cart'));
          break;
        default:
          break;
      }
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'upload_mp4_video'
        || userMessage === 'upload_3gp_video'
        || userMessage === 'upload_jpeg_image'
        || userMessage === 'upload_png_image'
        || userMessage === 'upload_gif_image'
        || userMessage === 'upload_docx_document'
        || userMessage === 'upload_pdf_document'
        || userMessage === 'upload_ogg_audio'
        || userMessage === 'upload_mpeg_audio'
    ) {
      responseMessage.push(await getMessagePayload(userMessage, environment));
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage.includes('Successfully', 0)) {
      responseMessage.push(new Text(userMessage));
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage.includes('Received', 0)) {
      responseMessage.push(new Text(userMessage));
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    if (userMessage === 'view_more') {
      responseMessage.push(new Button(new Text(invalidViewMoreMessageText), invalidWebViewMoreMessageButtons, true));
      model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
      return;
    }
    responseMessage.push(new Button(new Text(invalidMessageText), invalidWebMessageButtons, true));
    model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
    return;
  } catch (e) {
    logger.error(e);
    responseMessage.push(new Text('Something went wrong. Please try again.'));
    model.sendMessage(waNumber, userMobile, responseMessage).catch(err => logger.error('Send Message Failure ', err));
    throw e;
  }
};

module.exports = awaitViewMessageTypes;
