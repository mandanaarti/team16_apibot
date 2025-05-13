'use strict';

const Joi = require('@hapi/joi');
const moment = require('moment');

const textMessage = Joi.object().keys({
  body: Joi.string().max(4096).required(),
}).required();

const imageMessage = Joi.object().keys({
  id: Joi.string().length(21).required(),
  body: Joi.string().max(4096),
  content_type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
}).required();

const buttonResponseMessage = Joi.object().keys({
  button_index: Joi.number().integer().required(),
  body: Joi.string().max(4096).required(),
}).required();

const persistentMenuResponseMessage = Joi.object().keys({
  body: Joi.string().max(100).required(),
  id: Joi.number().integer().required(),
}).required();

const multiSelectButtonResponseMessage = Joi.array().min(1).items(
  Joi.object().keys({
    button_index: Joi.number().integer().required(),
    body: Joi.string().max(100).required(),
  }),
).required();

const documentMessage = Joi.object().keys({
  id: Joi.string().length(21).required(),
  name: Joi.string().max(100).required(),
  body: Joi.string().max(100).required(),
  content_type: Joi.string().valid('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document').required(),
}).required();

const videoMessage = Joi.object().keys({
  id: Joi.string().length(21).required(),
  title: Joi.string().max(100),
  content_type: Joi.string().valid('video/mp4', 'video/3gpp', 'video/quicktime').required(),
}).required();

const audioMessage = Joi.object().keys({
  id: Joi.string().length(21).required(),
  title: Joi.string().max(100).required(),
  body: Joi.string().max(4096),
  content_type: Joi.string().valid('audio/mpeg', 'audio/ogg').required(),
}).required();

const dateMessage = Joi.object().keys({
  day: Joi.number().integer().required(),
  month: Joi.number().integer().required(),
  year: Joi.number().integer().required(),
}).required().custom((value, helpers) => {
  const { day, month, year } = value;
  if (!moment(`${day}.${month}.${year}`, 'D.M.YYYY', true).isValid()) {
    return helpers.message({
      custom: 'Invalid date provided.',
    });
  }
});

const locationMessage = Joi.object().keys({
  type: Joi.string().valid('CURRENT', 'CUSTOM').required(),
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  name: Joi.string().min(2).max(100),
  address: Joi.string().min(2).max(200),
}).required();

const cartMessage = Joi.array().min(1).items(
  Joi.object().keys({
    product_id: Joi.string().min(1).max(36).required(),
    catalog_id: Joi.string().length(24).required(),
    quantity: Joi.number().integer().min(1).max(12)
      .strict()
      .required(),
    customizations: Joi.array().min(1).items(
      Joi.object().keys({
        id: Joi.string().min(1).max(36).required(),
        value: Joi.array().min(1).items(
          Joi.string().min(1).max(36).required(),
        )
          .required(),
      }).required(),
    ),
  }).required(),
)
  .required();

const cartMessagenotification = Joi.array().items(
  Joi.object().keys({
    product_id: Joi.string().min(1).max(36).required(),
    catalog_id: Joi.string().length(24).required(),
    quantity: Joi.number().integer().min(1).max(12)
      .strict()
      .required(),
    customizations: Joi.array().min(1).items(
      Joi.object().keys({
        id: Joi.string().min(1).max(36).required(),
        value: Joi.array().min(1).items(
          Joi.string().min(1).max(36).required(),
        )
          .required(),
      }).required(),
    ),
  }),
)
  .required();

const userSession = Joi.object().keys({
  payload: Joi.string().max(1024).allow(null).required(),
}).required();

const ratingNotification = Joi.object().keys({
  type: Joi.string().valid('thumb', 'star').required(),
  thumb: Joi.when('type', {
    is: 'thumb',
    then: Joi.object().keys({
      value: Joi.string().valid('LIKE', 'DISLIKE').required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  star: Joi.when('type', {
    is: 'star',
    then: Joi.object().keys({
      value: Joi.number().integer().strict().min(1)
        .max(5)
        .required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  review: Joi.string().min(1).max(200),
}).required();

const mediaListMessage = Joi.array().min(2).max(20).unique()
  .items(
    Joi.object().keys({
      type: Joi.string().valid('image', 'video').required(),
      image: Joi.when('type', {
        is: 'image',
        then: imageMessage,
        otherwise: Joi.forbidden(),
      }),
      video: Joi.when('type', {
        is: 'video',
        then: videoMessage,
        otherwise: Joi.forbidden(),
      }),
    }),
  )
  .required();

const facialRecognitionMessage = Joi.object().keys({
  type: Joi.string().valid('image').required(),
  image_id_list: Joi.when('type', {
    is: 'image',
    then: Joi.array().min(1).max(10).unique()
      .items(Joi.string().length(21).required())
      .required(),
    otherwise: Joi.forbidden(),
  }),
  geo_tagged: Joi.boolean().strict().required(),
}).required();

module.exports = {
  timestamp: Joi.string().required(),
  type: Joi.string().valid(
    'text',
    'button_response',
    'multi_select_button_response',
    'persistent_menu_response',
    'image',
    'document',
    'video',
    'audio',
    'date',
    'location',
    'cart',
    'cart_update',
    'user_session',
    'message_rated',
    'media_list',
    'facial_recognition',
  ).required(),
  text: Joi.when('type', {
    is: 'text',
    then: textMessage,
    otherwise: Joi.forbidden(),
  }),
  image: Joi.when('type', {
    is: 'image',
    then: imageMessage,
    otherwise: Joi.forbidden(),
  }),
  document: Joi.when('type', {
    is: 'document',
    then: documentMessage,
    otherwise: Joi.forbidden(),
  }),
  video: Joi.when('type', {
    is: 'video',
    then: videoMessage,
    otherwise: Joi.forbidden(),
  }),
  button_response: Joi.when('type', {
    is: 'button_response',
    then: buttonResponseMessage,
    otherwise: Joi.forbidden(),
  }),
  multi_select_button_response: Joi.when('type', {
    is: 'multi_select_button_response',
    then: multiSelectButtonResponseMessage,
    otherwise: Joi.forbidden(),
  }),
  persistent_menu_response: Joi.when('type', {
    is: 'persistent_menu_response',
    then: persistentMenuResponseMessage,
    otherwise: Joi.forbidden(),
  }),
  audio: Joi.when('type', {
    is: 'audio',
    then: audioMessage,
    otherwise: Joi.forbidden(),
  }),
  date: Joi.when('type', {
    is: 'date',
    then: dateMessage,
    otherwise: Joi.forbidden(),
  }),
  location: Joi.when('type', {
    is: 'location',
    then: locationMessage,
    otherwise: Joi.forbidden(),
  }),
  cart: Joi.when('type', {
    is: 'cart',
    then: cartMessage,
    otherwise: Joi.forbidden(),
  }),
  cart_update: Joi.when('type', {
    is: 'cart_update',
    then: cartMessagenotification,
    otherwise: Joi.forbidden(),
  }),
  user_session: Joi.when('type', {
    is: 'user_session',
    then: userSession,
    otherwise: Joi.forbidden(),
  }),
  rating: Joi.when('type', {
    is: 'message_rated',
    then: ratingNotification,
    otherwise: Joi.forbidden(),
  }),
  media_list: Joi.when('type', {
    is: 'media_list',
    then: mediaListMessage,
    otherwise: Joi.forbidden(),
  }),
  facial_recognition: Joi.when('type', {
    is: 'facial_recognition',
    then: facialRecognitionMessage,
    otherwise: Joi.forbidden(),
  }),
};
