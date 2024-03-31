'use strict';

const moment = require('moment')
const data_execute = moment().format('MM/DD/YYYY')
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crawlerhistory Schema
 */
var CrawlerhistorySchema = new Schema({
  // name: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Crawlerhistory name',
  //   trim: true
  // },
  data_execute:{
    type: String,
    default:'',
    required: true
  },
  crawler_schedule:{
    type: Schema.ObjectId,
    ref: 'Crawlerschedule'
  },
  frequency: {
    type: Number,
    default: '',
    required: true,
    trim: true,
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

mongoose.model('Crawlerhistory', CrawlerhistorySchema);
