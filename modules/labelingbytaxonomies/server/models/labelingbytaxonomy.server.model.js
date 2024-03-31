'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Labelingbytaxonomy Schema
 */
var LabelingbytaxonomySchema = new Schema({
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
  newstaxonomy: {
    type: Schema.ObjectId,
    ref: 'Newsbytaxonomy'
  },
  labelingtool: {
    type: Schema.ObjectId,
    ref: 'Labelingbylabelstudio'
  },
  newsdaily: {
    type: Schema.ObjectId,
    ref: 'Newsdaily'
  },
  languagevariables: {
    type: Schema.ObjectId,
    //ref: 'Languagevariables'
    ref: 'Languagevariable'
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

mongoose.model('Labelingbytaxonomy', LabelingbytaxonomySchema);
