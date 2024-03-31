'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contentidentification = mongoose.model('Contentidentification');

/**
 * Globals
 */
var user,
  contentidentification;

/**
 * Unit tests
 */
describe('Contentidentification Model Unit Tests:', function () {
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
      contentidentification = new Contentidentification({
        name: 'Contentidentification Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return contentidentification.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      contentidentification.name = '';

      return contentidentification.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Contentidentification.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
