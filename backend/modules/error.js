var config = require('config');

function ServerError (message, code, params) {
    this.message = message || 'Empty error';
    this.code = code || config.errors.EMPTY;
    this.params = params || {};
}

ServerError.prototype = new Error();

module.exports = ServerError;
