var config = require('config');
var utils = require('./utils');

function ServerError (message, code, params) {
    this.message = message || 'Empty error';
    this.code = code || config.errors.EMPTY;
    this.params = params || {};

    this.toString = function ServerError_toString () {
        return this.message;
    }

    this.stack = ((new Error(this.message)).stack);
}

ServerError.prototype = Error.prototype;

module.exports = ServerError;
