'use strict';

var express = require('express');
var rests = express.Router();
var users = require('./users')

var notImplemented = (req, res) => {
  res.send(req.method + ' is not implemented');
};

// restaurants landing page after log in
rests.get('/', (req, res) => {
  res.render('pages/restaurants', { user: req.session.user });
})

// add a new restaurant
rests.post('/', notImplemented);

// new restaurant form
rests.get('/new', notImplemented);

module.exports = rests;
