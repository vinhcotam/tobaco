'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Keyinformant = mongoose.model('Keyinformant');

/**
 * Globals
 */
var user,
  keyinformant;

/**
 * Unit tests
 */
describe('Keyinformant Model Unit Tests:', function () {
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
      keyinformant = new Keyinformant({
        name: 'Keyinformant Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return keyinformant.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      keyinformant.name = '';

      return keyinformant.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Keyinformant.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
