var assert = require('assert');
var request = require('supertest');
var config = require('config');
var express = require('express');
var exec = require('child_process').exec;

var host = config.HOSTNAME + ':' + config.PORT; 

describe('Article routes', function () {
    before(function (done) {
        exec('cp -f article.test.json _article.test.json', function (a, b, c) {
            done();
        });
    });

    describe('Success', function () {
        it('GET /articles', function (done) {
            request(host)
                .get('/articles')
                .expect(200)
                .expect(function (res) {
                    var articles = res.body;
                    assert.equal(articles[0].id, 1);
                })
                .end(done);
        });

        it('GET /articles/1', function (done) {
            request(host)
                .get('/articles/1')
                .expect(200)
                .expect(function (res) {
                    var article = res.body;
                    assert.equal(article.id, 1);
                })
                .end(done);
        });

        it('POST /articles', function (done) {
            var article = {
                title: 'My test article',
                text: 'To be or not to be'
            }

            request(host)
                .post('/articles')
                .send(article)
                .expect(200)
                .end(done);
        });

        it('DELETE /articles/3', function (done) {
            request(host)
                .delete('/articles/3')
                .expect(200)
                .end(done);
        });
    });

    describe('Failure', function () {
        it('GET /articles/100', function (done) {
            request(host)
                .get('/articles/100')
                .expect(404)
                .end(done);
        });
    });
});
