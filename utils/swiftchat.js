/* eslint-disable security/detect-object-injection */

'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const Agent = require('agentkeepalive').HttpsAgent;
const { klusterConfig } = require('../config');

const keepAliveAgent = new Agent(klusterConfig.httpConfig);
const axiosInstance = axios.create({ httpsAgent: keepAliveAgent, timeout: 300 * 1000 });
axiosRetry(axiosInstance, {
  retries: 3, retryCondition: axiosRetry.isRetryableError, retryDelay: axiosRetry.exponentialDelay,
});

const transformMessage = (message) => {
  let transformedMessage;
  switch (message.type) {
    case 'TEXT':
      transformedMessage = {
        type: 'text',
        text: { body: message.text },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'IMAGE':
      transformedMessage = {
        type: 'image',
        image: { url: encodeURI(decodeURI(message.url)) },
      };
      break;
    case 'IMAGE_TEXT':
      transformedMessage = {
        type: 'image',
        image: { body: message.text, url: encodeURI(decodeURI(message.url)) },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'IMAGE_ID':
      transformedMessage = {
        type: 'image',
        image: { body: message.text, id: message.id },
      };
      break;
    case 'VOICE_NOTE':
      transformedMessage = {
        type: 'audio',
        audio: { url: encodeURI(decodeURI(message.url)) },
      };
      break;
    case 'DELAY':
      transformedMessage = {
        type: 'delay',
        delay: { time: message.delay },
      };
      break;
    case 'DOCUMENT':
      transformedMessage = {
        type: 'document',
        document: {
          body: message.text,
          name: message.text,
          url: encodeURI(decodeURI(message.url)),
          ...('read_only' in message) && {
            read_only: message.read_only,
          },
        },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'DOCUMENT_ID':
      transformedMessage = {
        type: 'document',
        document: {
          body: message.text, name: message.text, id: message.id,
        },
      };
      break;
    case 'VIDEO':
      transformedMessage = {
        type: 'video',
        video: { title: message.text, url: encodeURI(decodeURI(message.url)) },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'AUDIO':
      transformedMessage = {
        type: 'audio',
        audio: { title: message.title, url: encodeURI(decodeURI(message.url)), body: message.body },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'AUDIO_ID':
      transformedMessage = {
        type: 'audio',
        audio: { title: message.title, id: message.id, body: message.body },
      };
      break;
    case 'VIDEO_ID':
      transformedMessage = {
        type: 'video',
        video: { title: message.text, id: message.id },
      };
      break;
    case 'CONTACTS':
      transformedMessage = {
        type: 'contacts',
        contacts: message.contacts,
      };
      break;
    case 'CARD':
      transformedMessage = {
        type: 'card',
        card: message.card,
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        }, 
      };
      break;
    case 'RICH_INPUT':
      transformedMessage = {
        type: 'rich_input',
        rich_input: message.richInput,
      };
      break;
    case 'ARTICLE':
      transformedMessage = {
        type: 'article',
        article: message.article,
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'TEMPLATE':
      transformedMessage = {
        type: 'template',
        template: message.template,
      };
      break;
    case 'MULTISELECTBUTTON':
      transformedMessage = {
        type: 'multi_select_button',
        multi_select_button: message.multiSelectButton,
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'LOCATION':
      transformedMessage = {
        type: 'location',
        location: message.location,
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'BUTTON':
      transformedMessage = {
        type: 'button',
        button: {
          body: transformMessage(message.body),
          buttons: message.buttons,
          ...('allow_custom_response' in message) && {
            allow_custom_response: message.allow_custom_response,
          },
          ...('ttl' in message) && {
            ttl: message.ttl,
          },
        },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'ACTION':
      transformedMessage = {
        type: 'action',
        action: { body: transformMessage(message.body), actions: message.actions },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    case 'SCORECARD':
      transformedMessage = {
        type: 'scorecard',
        scorecard: message.scorecard,
      };
      break;
    case 'CATALOGLIST':
      transformedMessage = {
        type: 'catalog_list',
        catalog_list: {
          body: message.body,
          catalogs: message.catalogs,
        },
      };
      break;
    case 'PRODUCTLIST':
      transformedMessage = {
        type: 'product_list',
        product_list: message.product_list,
      };
      break;
    case 'VIDEOSTREAM':
      transformedMessage = {
        type: 'video_stream',
        video_stream: {
          protocol: message.stream_payload.protocol,
          url: message.stream_payload.url,
          thumbnail: message.stream_payload.thumbnail,
          title: message.title,
        },
        ...('rating_type' in message) && {
          rating_type: message.rating_type,
        },
      };
      break;
    default: break;
  }
  return transformedMessage;
};

module.exports = {
  sendMessageApi,
};
