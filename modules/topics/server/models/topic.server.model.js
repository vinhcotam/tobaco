'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
  topic_name: {
    type: String,
    default: '',
    required: 'Please fill Topic name',
    trim: true
  },
  topic_description: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Topic', TopicSchema);
