'use strict';

const moment = require('moment')
const date_created = moment().format('MM/DD/YYYY')
const date_updated = moment().format('MM/DD/YYYY')

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Monitoringtype Schema
 */
var MonitoringtypeSchema = new Schema({
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  type_name: {
    type: String,
    default: '',
    required: 'Please fill Monitoringtype name',
    trim: true
  },
  type_code: {
    type: String,
    default: '',
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

mongoose.model('Monitoringtype', MonitoringtypeSchema);
