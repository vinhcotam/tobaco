'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Labelingbylabelstudio Schema
 */
var LabelingbylabelstudioSchema = new Schema({
  completion: {
    type: String,
    trim: true,
    get: function (data) {
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    },
    set: function (data) {
      return JSON.stringify(data);
    }
  },
  newsdaily: {
    type: Schema.ObjectId,
    ref: 'Newsdaily'
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

mongoose.model('Labelingbylabelstudio', LabelingbylabelstudioSchema);
