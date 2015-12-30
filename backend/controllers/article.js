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
            if (err) {
                res.status(500).send();
                return;
            }

            res.json(articles);
        });
    }

    function articleCtrl (req, res, next) {
        var id = parseInt(req.params.id, 10);
        manager.get(id, function (err, article) {
            if (err)
                throw err;

            res.json(article);
        });
    }

    function addArticleCtrl (req, res, next) {
        var article = req.body;
        manager.add(article, function (err, id) {
            if (err)
                throw err;
            res.json({id: id});
        });
    }

    function removeArticleCtrl (req, res, next) {
        var id = parseInt(req.params.id);
        manager.remove(id, function (err) {
            if (err)
                throw err;

            res.send();
        });
    }

    return {
        "Article#add": addArticleCtrl,
        "Article#list": allArticlesCtrl,
        "Article#item": articleCtrl,
        "Article#remove": removeArticleCtrl
    }
}

