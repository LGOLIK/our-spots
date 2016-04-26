'use strict';

const express = require('express');
const rests = express.Router();
const users = require('./users');
const db = require('../db/pg');
const request = require('request');
const Yelp = require('yelp');

const yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

const notImplemented = (req, res) => {
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

// Yelp API results
rests.get('/searchresults', (req, res) => {
  return yelp.search({
    term: 'gramercy tavern',
    location: 'New York, NY',
    category_filter: 'restaurants,bars'
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    console.error(err);
  });
});

// add a new restaurant to the communal list
rests.post('/', notImplemented);

// new restaurant form - clicking on search brings up the yelp results
rests.get('/new', (req, res) => {
  res.render('pages/new', {
    user: req.session.user
  })
});

// users restaurants seen
rests.get('/my/seen', db.showUserRests, (req, res) => {
  res.render('pages/restaurants-seen', {
    user: req.session.user,
    data: res.rows
  })
})

// user open restaurants
rests.get('/my/unseen', db.showUserRests, (req, res) => {
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

// update a user's restaurant status
rests.put('/:id', db.updateUserRest, (req, res) => {
  res.status(303).redirect('./my/unseen');
})

// remove a restaurant from the user's list
rests.delete('/:id', db.deleteUserRest, (req, res) => {
  res.status(303).redirect('./my/unseen');
})


module.exports = rests;
