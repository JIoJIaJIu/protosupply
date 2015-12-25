var config = require('config');
var ServerError = require('../modules/error');

function Article (data) {
    this.id = 1;
    this._createTitle(data.title);
    this._createText(data.text);
    this.title = data.title;
    this.text = data.text;
}

Article.prototype = {
    _createTitle: function (title) {
        if (!title) {
            throw new ServerError('No needed field: title', config.errors.VALIDATION, {
                field: 'title'
            });
        }

        this.title = title;
    },

    _createText: function (text) {
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
}

ArticleManager.prototype = {
    create: function ArticleManager_create () {
    },

    get: function ArticleManager_get (id, cb) {
        this._connection.get("article", "id", id, function (err, row) {
            if (err) {
                cb(err);
                return;
            }

            var article = new Article(row);
            cb(null, article);
        });
    },

    list: function ArticleManager_list (cb) {
    },

    remove: function ArticleManager_remove () {
    },

    update: function ArticleManager_update () {
    }
}

module.exports = {
    Article: Article,
    ArticleManager: ArticleManager
}
