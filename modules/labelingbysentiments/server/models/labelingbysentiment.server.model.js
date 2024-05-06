'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Labelingbysentiment Schema
 */
var LabelingbysentimentSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  start: {
    type: Number
  },
  end: {
    type: Number
  },
  text: {
    type: String,
  },
  keylabelstudio: {
    type: String,
    trim: true
  },
  commentsentiment: {
    type: Schema.ObjectId,
    ref: 'Commentbysentiment'
  },
  labelingtool: {
    type: Schema.ObjectId,
    ref: 'Labelingbylabelstudio'
  },
  comment: {
    type: Schema.ObjectId,
    ref: 'Comment'
  },
  sentiments: {
    type: Schema.ObjectId,
    //ref: 'Languagevariables'
    ref: 'Sentiments'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {strict: false});

mongoose.model('Labelingbysentiment', LabelingbysentimentSchema);
