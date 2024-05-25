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
  // sentiment_ai: {
  //   type: String,
  //   default: '',
  // },
  sentiment_ai: {
    type: Schema.ObjectId
  },
  score_ai: {
    type: String,
    default: 1
  },
  sentiment_researcher: {
    type: Schema.ObjectId
  },
  researcher_score: {
    type: String,
    default: 1
  },
  news_id: {
    type: Schema.ObjectId,
    ref: 'Newsdaily'
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
