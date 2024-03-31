'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Keyword Schema
 */
var KeywordSchema = new Schema({
  keyword_name: {
    type: String,
    default: '',
    required: 'Please fill Keyword name',
    trim: true
  },
  keyword_exactly: {
    type: String,
    default: '',
    trim: true
  },
  keyword_operators: {
    type: String,
    default: '',
    trim: true
  },
  keyword_alias: {
    type: String,
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

mongoose.model('Keyword', KeywordSchema);
