'use strict';

const Joi = require('joi');
const httpStatus = require('http-status');

module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      return res.status(httpStatus.BAD_REQUEST).json({ message });
    }
    return next();
  };
};
