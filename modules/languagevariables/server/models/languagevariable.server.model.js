'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Languagevariable Schema
 */
var LanguagevariableSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Languagevariable name',
    trim: true
  },
  value: {
    type: String,
    default: '',
    trim: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
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

mongoose.model('Languagevariable', LanguagevariableSchema);
