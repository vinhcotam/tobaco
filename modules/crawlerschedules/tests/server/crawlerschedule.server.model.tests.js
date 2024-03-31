'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawlerschedule = mongoose.model('Crawlerschedule');

/**
 * Globals
 */
var user,
  crawlerschedule;

/**
 * Unit tests
 */
describe('Crawlerschedule Model Unit Tests:', function () {
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
      crawlerschedule = new Crawlerschedule({
        name: 'Crawlerschedule Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return crawlerschedule.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      crawlerschedule.name = '';

      return crawlerschedule.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Crawlerschedule.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
