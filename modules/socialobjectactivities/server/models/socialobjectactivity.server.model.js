'use strict';

const moment = require('moment')
const date_activity = moment().format('MM/DD/YYYY')

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Socialobjectactivity Schema
 */
var SocialobjectactivitySchema = new Schema({
  object: {
    type: Schema.ObjectId,
    ref: 'Monitoringobject'
  },
  date_activity: {
    type: String,
    required: true
  },
  subject_name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  action_type: {
    type: Number,
    required: true
  },
  content_vi: {
    type: String,
    required: true
  },
  activity_liked: {
    type: Number,
    required: true
  },
  activity_shared: {
    type: Number,
    required: true
  },
  activity_comment: {
    type: Number,
    required: true
  },
  activity_url: {
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

mongoose.model('Socialobjectactivity', SocialobjectactivitySchema);
