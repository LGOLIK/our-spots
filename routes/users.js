var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

users.route('/')
  .post(db.createUser, (req, res) => {
    res.redirect('/');
  })

// render the register user page
users.get('/new', (req, res) => res.render('register'));

// render the login user page
users.get('/login', (req, res) => res.render('login'));



module.exports = users;
