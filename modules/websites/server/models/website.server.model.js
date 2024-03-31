'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Website Schema
 */
var WebsiteSchema = new Schema({
  topic: [{
    type: Schema.ObjectId,
    ref: 'Topic'
  }],
  website_name: {
    type: String,
    default: '',
    required: 'Please fill Website name',
    trim: true
  },
  webcate: {
    type: Schema.ObjectId,
    ref: 'Webcategory'
  },
  source_type: {
    type: String,
    trim: true,
    default: 'news'
  },
  source_address: {
    type: String,
    trim: true
  },
  source_url: {
    type: String,
    required: 'Please fill url',
    trim: true
  },
  source_rating: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  source_profile: {
    type: String,
    required: false,
    trim: true
  },
  page_search: {
    type: String,
    required: false,
    trim: true
  },
  default_language: {
    type: String,
    required: false,
    trim: true
  },
  collected: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
  // ,
  // topic: {
  //   type: [{
  //     type: Schema.ObjectId,
  //     ref: 'Topic'
  //   }]
  // }
});

mongoose.model('Website', WebsiteSchema);
