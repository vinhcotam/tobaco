'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crawlerconfig Schema
 */
var CrawlerconfigSchema = new Schema({
  config_name: {
    type: String,
    default: '',
    required: 'Please fill Crawlerconfig name',
    trim: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  website: [{
    type: Schema.ObjectId,
    ref: 'Website'
  }],
  crawlerdriver: {
    type: Schema.ObjectId,
    ref: 'Crawlerdriver'
  },
  parameters: [{
    websites: [{ type: Schema.ObjectId, ref: 'Website' }],
    keywords: [{ type: Schema.ObjectId, ref: 'Keyword' }],
    startdate: {
      type: Date,
      default: Date.now
    },
    todate: {
      type: Date,
      default: Date.now
    }
  }],
  
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Crawlerconfig', CrawlerconfigSchema);
