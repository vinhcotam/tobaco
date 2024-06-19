'use strict';

const { Int32 } = require('mongodb');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sentiment Schema
 */
var SentimentSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sentiment name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  sentiment_score: {
    type: Number,
    default: 0
  },
  color: {
    type: String
  }
  ,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  
});

mongoose.model('Sentiment', SentimentSchema);
