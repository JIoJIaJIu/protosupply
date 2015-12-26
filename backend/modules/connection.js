var config = require('config');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var ServerError = require('./error');
var utils = require('./utils');

function Connection () {
    this._buffer = null;
    this._data = null;
    this._filePath = null;

    this._readFromSource();
}

Connection.prototype = {
    /**
     * @param {String} command: 'GET', 'POST', 'DROP'
     * @param {Object} params
     * @param {Function} callback
     */
    execute: function Connection_execute (command, params, cb) {
        switch (command) {
            case 'GET': {
                this._get(params, cb)
                break;
            }
            case 'POST': {
                this._post(params, cb);
                break;
            }
            case 'DROP': {
                this._drop(params, cb);
                break;
            }
            default:
                throw new ServerError(utils.concat('No such command', command), config.errors.WRONG_ARG, {
                    argument: command
                });
        }
    },

    commit: function Connection_commit () {
        try {
            fs.writeFileSync(this._filePath, JSON.stringify(this._data))
            this._readFromSource();
        } catch (e) {
            throw new ServerError(utils.concat('Error during commit\n', e), config.errors.DB_COMMIT, {
                internalError: e
            });
        }
    },

    _drop: function Connection__drop (params, cb) {
        var type = params.type;
        var datas = this._data[type];
        var id = params.query.id;

        var object = _.find(datas, 'id', id);
        if (object) {
            this._data[type] = _.pull(datas, object);
            cb(null);
        } else {
            var err = new ServerError(utils.concat('No such resource with id', id),
                config.errors.NO_RESOURCE, {
                    id: id 
                });
            cb(err);
        }
    },

    _get: function Connection__get (params, cb) {
        var type = params.type;
        var datas = this._data[type];

        // query selecting
        if (params.query) {
            var object = _.find(datas, 'id', params.query.id);
            cb(null, object);
        // list
        } else {
            cb(null, datas);
        }
    },

    _post: function Connection__post (params, cb) {
        var type = params.type;
        var datas = this._data[type] || [];

        datas.push(params.object.toJSON());
        this._data[type] = datas;
        cb(null);
    },

    _readFromSource: function Connection__readFromSource () {
        var fileName = config.connection.file;
        this._filePath = path.resolve(fileName);

        try {
            this._buffer = fs.readFileSync(this._filePath);
        } catch (e) {
            throw new ServerError(utils.concat('Couldn\'t open file', fileName), config.errors.WRONG_FD, {
                name: fileName,
                internalError: e
            });
        }

        try {
            this._data = JSON.parse(this._buffer.toString());
        } catch (e) {
            throw new ServerError(utils.concat('Couldn\'t parse JSON\n', e), config.errors.WRONG_JSON, {
                internalError: e
            });
        }
    }
}

module.exports = Connection;
