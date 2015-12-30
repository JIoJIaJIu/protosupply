var config = require('config');
var express = require('express');
var fs = require('fs');
var _ = require('lodash');

var ServerError = require('./error');
var CtrlService = require('../controllers/base.js');
var utils = require('./utils');

var FILE = 'route.json';

function Router () {
    this._router = express.Router();
    var content;
    var settings;

    try {
        content = fs.readFileSync(FILE);
    } catch (e) {
        throw new ServerError(utils.concat('Error during initialization Router\n', e),
            config.errors.WRONG_FD, {
                internalError: e
            });
    }

    try {
        settings = JSON.parse(content);
    } catch (e) {
        throw new ServerError(utils.concat('Error during parse JSON settings\n', e),
            config.errors.WRONG_JSON, {
                internalError: e
            });
    }

    this._init(settings);
}

Router.prototype = {
    _init: function Router__init (settings) {
        var self = this;

        _.forIn(settings, function (settings, method) {
            switch (method) {
                case 'GET':
                case 'POST':
                case 'DELETE':
                    var routeFn = self._router[method.toLowerCase()]
                    _.forIn(settings, function (controllerName, route) {
                        var controller = CtrlService.get(controllerName);
                        routeFn.call(self._router, route, controller);
                    });
                    break;
                default:
                    throw new ServerError(utils.concat('Unknow HTTP method', method),
                        config.errors.UNSUPPORTED_HTTP_METHOD);
            }
        });
    }
}

module.exports = Router;
