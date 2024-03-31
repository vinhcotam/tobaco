'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Assignedtopic Schema
 */
var AssignedtopicSchema = new Schema({
  /*name: {
    type: String,
    default: '',
    required: 'Please fill Assignedtopic name',
    trim: true
  },*/
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  assigned_user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  working_status: {
    type: Number,
    default: 0
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

mongoose.model('Assignedtopic', AssignedtopicSchema);
