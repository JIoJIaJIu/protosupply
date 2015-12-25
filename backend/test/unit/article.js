var assert = require('assert');
var config = require('config');
var Article = require('../../models/article').Article;

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
    it('error on create', function () {
    });
});
