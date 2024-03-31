'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newsgroup Schema
 */
var NewsgroupSchema = new Schema({
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Newsgroup name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Newsgroup description',
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

mongoose.model('Newsgroup', NewsgroupSchema);
