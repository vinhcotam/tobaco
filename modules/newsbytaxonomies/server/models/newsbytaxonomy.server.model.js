'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newsbytaxonomy Schema
 */
var NewsbytaxonomySchema = new Schema({
  // name: {
  //  type: String,
  //  default: '',
  //  required: 'Please fill Newsbytaxonomy name',
  //  trim: true
  // },
  taxonomy: {
    type: Schema.ObjectId,
    ref: 'Taxonomy'
  },
  labelingtool: {
    type: Schema.ObjectId,
    ref: 'Labelingbylabelstudio'
  },
  keylabelstudio: {
    type: String,
    trim: true
  },
  newsdaily: {
    type: Schema.ObjectId,
    ref: 'Newsdaily'
  },
  newsprivate: {
    type: Schema.ObjectId,
    ref: 'Newsprivate'
  },
  typenews: {
    type: Number
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

mongoose.model('Newsbytaxonomy', NewsbytaxonomySchema);
