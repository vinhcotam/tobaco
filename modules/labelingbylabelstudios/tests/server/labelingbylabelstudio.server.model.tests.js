'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Labelingbylabelstudio = mongoose.model('Labelingbylabelstudio');

/**
 * Globals
 */
var user,
  labelingbylabelstudio;

/**
 * Unit tests
 */
describe('Labelingbylabelstudio Model Unit Tests:', function () {
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
      labelingbylabelstudio = new Labelingbylabelstudio({
        name: 'Labelingbylabelstudio Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return labelingbylabelstudio.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      labelingbylabelstudio.name = '';

      return labelingbylabelstudio.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Labelingbylabelstudio.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
