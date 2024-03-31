'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newsdaily Schema
 */
var NewsdailySchema = new Schema({
  name: {
    type: String,
    default: '',
    // required: 'Please fill Newsdaily name',
    trim: true
  },
  website: {
    type: Schema.ObjectId,
    ref: 'Website'
  },
  webcate: {
    type: Schema.ObjectId,
    ref: 'Webcategory'
  },
  source_type: {
    type: String,
    trim: true
  },
  source_cate: {
    type: String,
    trim: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  crawlerconfig: {
    type: Schema.ObjectId,
    ref: 'Crawlerconfig'
  },
  news_url: {
    type: String,
    trim: true
  },
  news_title: {
    type: String,
    trim: true
  },
  news_summary: {
    type: String,
    trim: true
  },
  news_author: {
    type: String,
    trim: true
  },
  news_source: {
    type: String,
    trim: true
  },
  news_content: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  keywords: {
    type: String,
    trim: true
  },
  ner_location: {
    type: String,
    trim: true
  },
  ner_objects: {
    type: String,
    trim: true
  },
  npl_content: {
    type: String,
    trim: true
  },
  group_news: {// old - single topic
    type: Number,
    default: 0
  },
  news_group: {// new - multi topics
    type: Schema.ObjectId,
    ref: 'Newsgroup'
  },
  created: {
    type: Date,
    default: Date.now
  },
  posted: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Newsdaily', NewsdailySchema);
