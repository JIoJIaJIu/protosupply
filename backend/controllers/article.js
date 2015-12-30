var ArticleManager = require('../models/article').ArticleManager;

/**
 * @param {Object} settings
 *   - @key {Object} connection, instance of Connection
 * @return {Object} alias controllers
 */
module.exports = function (settings) {
    var connection = settings.connection;
    if (!connection)
        throw new ServerError('No connection in settings during controller initialization',
            config.errors.MISSING_PARAM);

    var manager = new ArticleManager(connection);

    function allArticlesCtrl (req, res, next) {
        manager.list(function (err, articles) {
            //TODO:
            if (err)
                return ''

            res.json(articles);
        });
    }

    function articleCtrl () {
    }

    return {
        "Article#list": allArticlesCtrl,
        "Article#item": articleCtrl
    }
}

