var assert = require('assert');
var config = require('config');
var _ = require('lodash');

var Article = require('../../models/article').Article;
var ArticleManager = require('../../models/article').ArticleManager;
var Connection = require('../../modules/connection');

describe('Article', function () {
    describe('Success', function () {
        var data = {
            title: 'Test article',
            text: 'Here is the text'
        }
        var article = new Article(1, data);

        it('id', function () {
            assert.equal(article.id, 1);
        });

        it('title', function () {
            assert.equal(article.title, data.title);
        });

        it('text', function () {
            assert.equal(article.text, data.text);
        });
    });

    describe('Failure', function () {
        it('no id', function () {
            try {
                var article = new Article(null, {});
                throw new ServerError();
            } catch (e) {
                assert.equal(e.params.field, 'id');
            }
        });

        it('no 2nd argument', function () {
            try {
                var article = new Article(1);
                throw new ServerError();
            } catch (e) {
                assert.equal(e.code, config.errors.MISSING_ARGS);
            }
        });

        it('no title', function () {
            try {
                var article = new Article(1, {text: 'Text'});
                throw new ServerError();
            } catch (e) {
                assert.equal(e.params.field, 'title');
            }
        });

        it('no text', function () {
            try {
                var article = new Article(1, {title: 'Title'});
                throw new ServerError();
            } catch (e) {
                assert.equal(e.params.field, 'text');
            }
        });
    });
});

describe('ArticleManager', function () {
    var connection = new Connection();
    var manager = new ArticleManager(connection);

    describe('Success', function () {
        it('get article', function (done) {
            manager.get(1, function (err, article) {
                assert.ok(!err);
                assert.equal(article.id, 1);
                done();
            });
        });

        it('list articles', function (done) {
            manager.list(function (err, articles) {
                assert.ok(!err);
                assert.equal(articles.length, 2);
                assert.equal(articles[0].id, 1);
                assert.equal(articles[1].id, 2);
                done();
            });
        });

        it('create article', function (done) {
            var data = {
                title: 'I\'m a bird',
                text: 'Look at me'
            }
            manager.add(data, function (err) {
                assert.ok(!err);
                done();
            });
        });

        it('get last after create', function (done) {
            manager.get(3, function (err, article) {
                assert.ok(!err);
                assert.equal(article.id, 3);
                done();
            });
        });

        it('remove article', function (done) {
            manager.remove(3, function (err) {
                assert.ok(!err);
                done();
            });
        });

        it('get last after remove', function (done) {
            manager.list(function (err, articles) {
                assert.ok(!err);
                articles = _.sortBy(articles, 'id');
                assert.equal(_.last(articles).id, 2);
                done();
            });
        });
    });

    describe('Failure', function () {
        it('get article', function (done) {
            manager.get(33, function (err) {
                assert.ok(err);
                assert.equal(err.code, config.errors.NO_RESOURCE);
                done();
            });
        });

        it('remove article', function (done) {
            manager.remove(3, function (err) {
                assert.ok(err);
                assert.equal(err.code, config.errors.NO_RESOURCE);
                done();
            });
        });
    });
});
