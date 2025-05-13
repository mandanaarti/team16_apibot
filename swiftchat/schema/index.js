const Joi = require('joi');;

module.exports = {
  klusterWebhook: Joi.object()
    .keys({
      from: Joi.string().required(),
      timestamp: Joi.string().required(),
      message_id: Joi.string().required(),
      conversation_id: Joi.string().required(),
      conversation_initiated_by: Joi.string().required(),
      type: Joi.string()
        .valid(
          'text',
          'button_response',
          'multi_select_button_response',
          'persistent_menu_response',
          'location'
        )
        .required(),
      text: Joi.when('type', {
        is: 'text',
        then: Joi.object({
          body: Joi.string().required(),
        }),
      }),
      button_response: Joi.when('type', {
        is: 'button_response',
        then: Joi.object({
          button_index: Joi.number().required(),
          body: Joi.string().required(),
        }),
      }),
      multi_select_button_response: Joi.when('type', {
        is: 'multi_select_button_response',
        then: Joi.array().items({
          button_index: Joi.number().required(),
          body: Joi.string().required(),
        }),
      }),
      persistent_menu_response: Joi.when('type', {
        is: 'persistent_menu_response',
        then: Joi.object({
          id: Joi.number().required(),
          body: Joi.string().required(),
        }),
      }),
      location: Joi.when('type', {
        is: 'location',
        then: Joi.object({
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
          type: Joi.string(),
        }),
      }),
    })
    .required(),
};
