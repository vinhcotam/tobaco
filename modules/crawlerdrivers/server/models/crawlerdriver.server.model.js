'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crawlerdriver Schema
 */
var CrawlerdriverSchema = new Schema({
  crawlerdriver_name: {
    type: String,
    default: '',
    required: 'Please fill Crawlerdriver name',
    trim: true
  },
  crawlerdriver_path: {
    type: String,
    default: '',
    trim: true
  },
  crawlerdriver_class: {
    type: String,
    default: '',
    trim: true
  },
  crawlerdriver_description: {
    type: String,
    default: '',
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

mongoose.model('Crawlerdriver', CrawlerdriverSchema);
