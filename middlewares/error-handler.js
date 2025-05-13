'use strict';

const httpStatus = require('http-status');
const { ClientError } = require('../utils/errors');

module.exports = async (err, req, res, next) => {
  if (err instanceof ClientError) {
    if (err.message == null) return res.sendStatus(err.statusCode);
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  return next(err);
};
