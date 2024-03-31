'use strict';

const moment = require('moment');
const date_created = moment().format('MM/DD/YYYY');
const date_updated = moment().format('MM/DD/YYYY');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Objectprofile Schema
 */
var ObjectprofileSchema = new Schema({
  object: {
    type: Schema.ObjectId,
    ref: 'Monitoringobject'
  },
  profile: {
    type: Number,
    required: true
  },
  profile_code: {
    type: String,
    trim: true
  },
  profile_url: {
    type: String,
    required: true
  },
  profile_name: {
    type: String,
    required: true
  },
  date_created: {
    type: String,
    required: true
  },
  date_updated: {
    type: String,
    required: true
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

mongoose.model('Objectprofile', ObjectprofileSchema);
