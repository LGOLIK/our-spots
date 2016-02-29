'use strict';

var express = require('express');
var rests = express.Router();
var users = require('./users');
var db = require('../db/pg');

var notImplemented = (req, res) => {
  res.send(req.method + ' is not implemented');
};

/* restaurants landing page after log in
 this page renders with both the full list of restaurants,
 as well as an array of restaurants set to the user and
 shows the restaurants not in the user's list */
rests.get('/', db.showRestaurants, (req, res) => {
  res.render('pages/restaurants', {
    user: req.session.user,
    restaurants: res.rows
  });
})

// add a new restaurant to the communal list
rests.post('/', notImplemented);

// new restaurant form
rests.get('/new', notImplemented);

// users restaurants seen
rests.get('/my/seen', (req, res) => {
  res.render('pages/restaurants-seen', { user: req.session.user })
})

// user open restaurants
rests.get('/my/unseen', db.showUserRests, (req, res) => {
  res.render('pages/restaurants-unseen', {
    user: req.session.user,
    data: res.rows
  })
  console.log(res.rows[0]);
})


// view a restaurant
rests.get('/:id', notImplemented)

// add restaurants to user view, and redirect back to the restaurants view
rests.post('/:id', db.addUserRestaurant, (req, res) => {
  res.redirect('./');
})

// update a user's restaurant status
rests.put('/:id', db.updateUserRest, (req, res) => {
  res.status(303).redirect('./my/unseen');
})

// remove a restaurant from the user's list
rests.delete('/:id', db.deleteUserRest, (req, res) => {
  res.status(303).redirect('./my/unseen');
})


module.exports = rests;
