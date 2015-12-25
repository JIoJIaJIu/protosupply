var config = require('config');
var path = require('path');

var ServerError = require('./error');
var utils = require('./utils');

function Connection () {
    var fileName = config.connection.file;
    var filePath = path.resolve(fileName);

    try {
        this._fd = fs.openSync(filePath, 'r');
    } catch (e) {
        throw new ServerError(utils.concat('Couldn\'t open file', fileName), config.errors.WRONG_FD, {
            name: fileName,
            internalError: e
        });
    }
}

Connection.prototype = {
    /**
     * @param {String} command: 'GET', 'POST'
     * @param {Object} params
     * @param {Function} callback
     */
    execute: function Connection_execute (command, params, cb) {
        switch (command) {
            case 'GET': {
                this._get(params, cb)
                break;
            }
            default:
                throw new ServerError(utils.concat('No such command', command), config.errors.WRONG_ARG, {
                    argument: command
                });
        }
    },

    _get: function Connection__get () {
    }
}

module.exports = Connection;
