var config = require('config');
var _ = require('lodash');

var ServerError = require('../modules/error');
var utils = require('../modules/utils');

function Article (id, data) {
    if (!id) {
        throw new ServerError('No needed field: id', config.errors.VALIDATION, {
            field: 'id'
        });
    }

    if (!data) {
        throw new ServerError('No needed 2nd argument', config.errors.MISSING_ARGS);
    }

    this._createTitle(data.title);
    this._createText(data.text);
    this.id = id;
    this.datetime = new Date();
}

Article.prototype = {
    toJSON: function Article_toJSON () {
        return {
            id: this.id,
            title: this.title,
            text: this.text,
            datetime: this.datetime
        };
    },

    _createTitle: function Article__createTitle (title) {
        if (!title) {
            throw new ServerError('No needed field: title', config.errors.VALIDATION, {
                field: 'title'
            });
        }

        this.title = title;
    },

    _createText: function Article__createText (text) {
        if (!text) {
            throw new ServerError('No needed field: text', config.errors.VALIDATION, {
                field: 'text'
            });
        }

        this.text = text;
    }
}

function ArticleManager (connection) {
    this._connection = connection;
    this._lastIndex = null;
}

ArticleManager.prototype = {
    add: function ArticleManager_add (data, cb) {
        var self = this;
        // Reading all articles, initiation
        if (!this._lastIndex) {
            this._sync(function () {
                self.add(data, cb);
            });
            return;
        }

        var id = this._lastIndex + 1;
        var article = new Article(id, data);

        var params = {
            type: 'article',
            object: article
        }

        this._connection.execute('POST', params, function (err) {
            if (err) {
                cb(err);
                return;
            }

            self._connection.commit();
            cb(null);
        });
    },

    get: function ArticleManager_get (id, cb) {
        var params = {
            query: {
                id: id,
            },
            type: 'article'
        }

        this._connection.execute('GET', params, function (err, data) {
            if (err) {
                cb(err);
                return;
            }

            if (!data) {
                err = new ServerError(utils.concat('No such article resource with id', id),
                    config.errors.NO_RESOURCE, {
                        type: 'article',
                        id: id
                    });
                cb(err);
                return;
            }

            var article = new Article(id, data);
            cb(null, article);
        });
    },

    list: function ArticleManager_list (cb) {
        var self = this;
        this._connection.execute('GET', {type: 'article'}, function (err, data) {
            if (err) {
                cb(err);
                return;
            }

            if (!data) {
                cb(null, []);
                return;
            }

            var articles = _.map(data, function (data) {
                return new Article(data.id, data);
            });

            cb(null, articles);
        });
    },

    remove: function ArticleManager_remove (id, cb) {
        var self = this;
        var params = {
            type: 'article',
            query: {
                id: id
            }
        };

        this._connection.execute('DROP', params, function (err) {
            if (err) {
                cb(err);
                return;
            }

            self._connection.commit();
            self._sync(cb);
        });
    },

    update: function ArticleManager_update () {
    },

    /**
     * Sync index of articles with storage
     */
    _sync: function ArticleManager__sync (cb) {
        var self = this;

        this.list(function (err, articles) {
            if (err)
                throw err;

            self._lastIndex = self._getLastIndex(articles);
            cb();
        });
    },

    _getLastIndex: function ArticleManager__getLastIndex (articles) {
        var index = 1;
        var last = _.last(_.sortBy(articles, 'id'));
        if (last)
            index = last.id;

        return index;
    }
}

module.exports = {
    Article: Article,
    ArticleManager: ArticleManager
}
