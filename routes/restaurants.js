'use strict';

var express = require('express');
var rests = express.Router();
var users = require('./users');
var db = require('../db/pg');

var notImplemented = (req, res) => {
  res.send(req.method + ' is not implemented');
};

// restaurants landing page after log in
rests.get('/', db.showRestaurants, db.getUserRestaurants, (req, res) => {
  res.render('pages/restaurants', {
    user: req.session.user,
    restaurants: res.restaurants,
    userRests: res.userRestaurants[0]
  });
})

// add a new restaurant
rests.post('/', notImplemented);

// new restaurant form
rests.get('/new', notImplemented);

// users restaurants seen
rests.get('/my/seen', (req, res) => {
  res.render('pages/restaurants-seen', { user: req.session.user })
})

// user open restaurants
rests.get('/my/unseen', db.showRestsUnseen, (req, res) => {
  res.render('pages/restaurants-unseen', {
    user: req.session.user,
    data: res.rows
  })
})


// view a restaurant
rests.get('/:id', notImplemented)

// add restaurants to user view, and redirect back to the restaurants view
rests.post('/:id', db.addUserRestaurant, (req, res) => {
  res.redirect('./');
})

module.exports = rests;
