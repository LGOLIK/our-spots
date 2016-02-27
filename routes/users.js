var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

users.route('/')
  .post(db.createUser, (req, res) => {
    res.redirect('/restaurants');
  })

// render the register user page
users.get('/new', (req, res) => res.render('register'));

// render the login user page
users.get('/login', (req, res) => res.render('login'));

// log the user in
users.post('/login', db.loginUser, (req, res) => {
    req.session.user = res.rows

    // when you redirect you must force a save due to asynchronisity
    // https://github.com/expressjs/session/issues/167 **
    // "modern web browsers ignore the body of the response and so start loading
    // the destination page well before we finished sending the response to the client."

    req.session.save(function() {
      res.redirect('/restaurants')
    })
})

// users restaurants seen
users.get('/:id/restaurants/seen', (req, res) => {
  res.render('user-restaurants-seen', { user: req.session.user })
})

// user open restaurants
users.get('/:id/restaurants/unseen', (req, res) => {
  res.render('user-restaurants-unseen', { user: req.session.user })
})

module.exports = users;