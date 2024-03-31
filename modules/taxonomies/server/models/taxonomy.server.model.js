'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  materializedPlugin = require('mongoose-materialized'),
  Schema = mongoose.Schema;
//var tree = require('mongoose-tree');
/**
 * Taxonomy Schema
 */
var TaxonomySchema = new Schema({
  taxonomy_name: {
    type: String,
    default: '',
    required: 'Please fill Taxonomy name',
    trim: true
  },
  taxonomy_description: {
    type: String,
    default: '',
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
//TaxonomySchema.plugin(tree);
TaxonomySchema.plugin(materializedPlugin);
mongoose.model('Taxonomy', TaxonomySchema);
