'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

exports.passportSignup = async function (req, res) {
  delete req.body.roles;
  // Init user and add missing fields
  try {
    var user = new User(req.body);
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ 'error': 'Singup failed!' });
  }
}

exports.passportSignin = async function (req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials!' });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ 'error': 'Login failed!!' });
  }
}
