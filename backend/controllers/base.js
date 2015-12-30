var config = require('config');
var _ = require('lodash');

var ArticleCtrl = require('./article');
var Connection = require('../modules/connection');
var ServerError = require('../modules/error');
var utils = require('../modules/utils');

function CtrlService () {
    var connection = new Connection();
    this._ctrls = {};
    _.extend(this._ctrls, ArticleCtrl({connection: connection}));
}

CtrlService.prototype = {
    get: function CtrlService_get(controllerName) {
        var controller = this._ctrls[controllerName];
        if (!controller)
            throw new ServerError(utils.concat("No such controller", controllerName),
                config.errors.UNKNOWN_CONTROLLER);

        return controller;
    }
}

module.exports = new CtrlService();
