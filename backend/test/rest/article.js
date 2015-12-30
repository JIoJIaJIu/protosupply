var assert = require('assert');
var request = require('supertest');
var config = require('config');
var express = require('express');

var url = "http://localhost:10100"

describe('Article routes', function () {
    describe('Success', function () {
        it('/', function (done) {
            request(url)
                .get('/')
                .expect(200)
                .expect(function (res) {
                    var articles = res.body;
                    assert.equal(articles[0].id, 1);
                })
                .end(done);
        });

        it('', function () {
        });
    });

/*
    describe('Failure', function () {
    });
    */
});
