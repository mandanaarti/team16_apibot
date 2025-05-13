'use strict';

class ClientError extends Error {
  constructor(statusCode, message = null) {
    super();
    this.message = message;
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = {
  ClientError,
};
