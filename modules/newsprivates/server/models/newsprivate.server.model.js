'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newsprivate Schema
 */
var NewsprivateSchema = new Schema({
  targeted_issue: {
    type: String,
    default: '',
    required: 'Please fill Newsprivate file',
    trim: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  keyinformant: {
    type: Schema.ObjectId,
    ref: 'Keyinformant'
  },
  taxonomy: {
    type: Schema.ObjectId,
    ref: 'Taxonomy'
  },
  confidentiality: {
    type: Number,
    default: 1,
    trim: true
  },
  filename: {
    type: String,
    default: '',
    trim: true
  },
  filepath: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: ''
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

mongoose.model('Newsprivate', NewsprivateSchema);
