'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Webcategory Schema
 */
var WebcategorySchema = new Schema({
  website: {
    type: Schema.ObjectId,
    ref: 'Website'
  },
  description: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  crawler_config: {
    type: Schema.ObjectId,
    ref: 'Crawlerconfig'
  },
  user_name: {
    type: String,
    required: true
  },
  source_cate: {
    type: String,
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

mongoose.model('Webcategory', WebcategorySchema);
