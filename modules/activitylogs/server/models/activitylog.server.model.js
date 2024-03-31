'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Activitylog Schema
 */
var ActivitylogSchema = new Schema({
  activity: {
    type: Schema.ObjectId,
    ref: 'Socialobjectactivity'
  },
  log_type :{
    type: Number,
    required: true
  },
  profile: {
    type: Schema.ObjectId,
    ref: 'Objectprofile'
  },
  log_content: {
    type: Number,
    required: true
  },
  activity_log: {
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

mongoose.model('Activitylog', ActivitylogSchema);
