'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  materializedPlugin = require('mongoose-materialized'),
  Schema = mongoose.Schema;


/**
 * Languagevariable Schema
 */
var CommentSchema = new Schema({
  content: {
    type: String,
    default: '',
    trim: true
  },
  reaction: {
    type: Object,
    defaul: {}
  },
  news_urls: {
    type: String,
    default: '',
    trim: true
  },
  news_id: {
    type: Schema.ObjectId
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});
CommentSchema.plugin(materializedPlugin);

mongoose.model('Comment', CommentSchema);
