'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Monitoringobject Schema
 */

var MonitoringobjectSchema = new Schema({
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  socialcrawlerconfig: {
    type: Schema.ObjectId,
    ref: 'Socialcrawlerconfig'
  },
  monitoringtype: {
    type: Schema.ObjectId,
    ref: 'Monitoringtype'
  },
  object_name: {
    type: String,
    required: true
  },
  object_code: {
    type: String,
    trim: true
  },
  object_url: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  profile: {
    type: Schema.ObjectId,
    ref: 'Objectprofile'
  },
  object_id: { //id of objetc on social network
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  full_name: {
    type: String,
    trim: true
  },
  condition_filter: {
    type: String,
    trim: true
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

mongoose.model('Monitoringobject', MonitoringobjectSchema);
