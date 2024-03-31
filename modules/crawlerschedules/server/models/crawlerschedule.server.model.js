'use strict';

const moment = require('moment')

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crawlerschedule Schema
 */
var CrawlerscheduleSchema = new Schema({
  crawler_config: {
    type: Schema.ObjectId,
    ref: 'Crawlerconfig'
  },
  frequency: {
    type: Number,
    default: '',
    required: true,
    trim: true,
  },
  last_run_date:{
    type: String,
    required: true
  },
  next_run_date:{
    type: String,
    required: true
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

mongoose.model('Crawlerschedule', CrawlerscheduleSchema);


const last_run_date = moment().format('MM/DD/YYYY')
const next_run_date = moment().format('MM/DD/YYYY')
