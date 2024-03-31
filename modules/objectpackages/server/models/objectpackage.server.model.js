'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Objectpackage Schema
 */
var ObjectpackageSchema = new Schema({
  package_name: {
    type: String,
    default: '',
    required: 'Please fill Objectpackage name',
    trim: true
  },
  package_note: {
    type: String,
    default: '',
    trim: true
  },
  monitoringobject: {
    type: Schema.ObjectId,
    ref: 'Monitoringobject'
  },
  socialcrawlerconfig: {
    type: Schema.ObjectId,
    ref: 'Socialcrawlerconfig'
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Objectpackage', ObjectpackageSchema);
