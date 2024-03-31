'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Socialcrawlerconfig Schema
 */
var SocialcrawlerconfigSchema = new Schema({
  /*object: {
    type: Schema.ObjectId,
    ref: 'Monitoringobject'
  },*/
  socialconfig_name: {
    type: String,
    required: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  crawler_driver: {
    type: Schema.ObjectId,
    ref: 'Crawlerdriver'
  },
  crawler_config: {
    type: Schema.ObjectId,
    ref: 'Crawlerconfig'
  },
  //user_name: {
  //  type: String,
  //  required: true
  //},
  user_login: {
    type: String,
    //required: true
  },
  password_login: {
    type: String,
    //required: true
  },
  subject_url: {
    type: String,
    //required: true
  },
  
  description: {
    type: String,
    //required: true
  },
  socialweb_url: {
    type: String,
    //required: true
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

mongoose.model('Socialcrawlerconfig', SocialcrawlerconfigSchema);
