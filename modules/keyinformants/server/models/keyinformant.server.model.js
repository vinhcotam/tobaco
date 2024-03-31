'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Keyinformant Schema
 */
var KeyinformantSchema = new Schema({
  keyinfor_name: {
    type: String,
    default: '',
    required: 'Please fill Full name',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Phone Number',
    trim: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic'
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Email',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Address',
    trim: true
  },
  unit: {
    type: String,
    default: '',
    required: 'Please fill Unit',
    trim: true
  },
  description: {
    type: String,
    default: '',
    //required: 'Please fill Description',
    trim: true
  },
  middle_fullname: {
    type: String,
    default: '',
    //required: 'Please fill Full name',
    trim: true
  },
  middle_phone: {
    type: String,
    default: '',
    //required: 'Please fill Phone Number',
    trim: true
  },
  middle_email: {
    type: String,
    default: '',
    //required: 'Please fill Email',
    trim: true
  },
  middle_unit: {
    type: String,
    default: '',
    //required: 'Please fill Unit',
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

mongoose.model('Keyinformant', KeyinformantSchema);
