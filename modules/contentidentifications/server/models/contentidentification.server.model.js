'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contentidentification Schema
 */
var ContentidentificationSchema = new Schema({
  key: {
    type: String,
    default: '',
    required: 'Please fill key, let identification block content',
    trim: true
  },
  type: {
    type: String,
    default: '',
    required: 'Please fill type (id, class or special tag)',
    trim: true
  },
  website: {
    type: Schema.ObjectId,
    ref: 'Website'
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

mongoose.model('Contentidentification', ContentidentificationSchema);
