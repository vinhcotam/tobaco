'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Socialcrawlerconfig = mongoose.model('Socialcrawlerconfig');

/**
 * Globals
 */
var user,
  socialcrawlerconfig;

/**
 * Unit tests
 */
describe('Socialcrawlerconfig Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      socialcrawlerconfig = new Socialcrawlerconfig({
        name: 'Socialcrawlerconfig Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return socialcrawlerconfig.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      socialcrawlerconfig.name = '';

      return socialcrawlerconfig.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Socialcrawlerconfig.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
