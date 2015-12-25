var assert = require('assert');
var Article = require('../../models/article').Article;

describe('Article', function () {
    describe('Success', function () {
        var data = {
            title: 'Test article',
            text: 'Here is the text'
        }
        var article = new Article(data);

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
        it('no title', function () {
            try {
                var article = new Article({text: 'Text'});
                throw new ServerError();
            } catch (e) {
                assert.equal(e.params.field, 'title');
            }
        });

        it('no text', function () {
            try {
                var article = new Article({title: 'Title'});
                throw new ServerError();
            } catch (e) {
                assert.equal(e.params.field, 'text');
            }
        });
    });
    it('error on create', function () {
    });
});
