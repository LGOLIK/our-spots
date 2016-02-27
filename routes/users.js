'use strict';

var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

users.route('/')
  .post(db.createUser, (req, res) => {
    res.redirect('/restaurants');
  })

// render the register user page
users.get('/new', (req, res) => res.render('pages/register'));

// render the login user page
users.get('/login', (req, res) => res.render('pages/login'));

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

// logout the user
users.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    return res.redirect('/');
  })
})

module.exports = users;
