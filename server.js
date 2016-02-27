'use strict';

require('dotenv').config();

var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var pg = require('pg');
var connectionString = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var userRoutes = require( path.join(__dirname, '/routes/users'));

var app = express();

app.use(morgan('dev'));

var notImplemented = (req, res) => {
  res.send(req.method + ' is not implemented');
};

// user session login info
app.use(session({
  store: new pgSession({
    pg : pg,
    conString : connectionString,
    tableName : 'session'
  }),
  secret: 'sooosecrett', // something we maybe want to save with dotenv *hint hint*
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/users', userRoutes);

// home route - nothing really happens here
app.get('/', (req, res) => {
  res.render('home')
})

// restaurants landing page after log in
app.get('/restaurants', (req, res) => {
  res.render('restaurants', { user: req.session.user });
})

// add a new restaurant
app.post('/restaurants', notImplemented);

// new restaurant form
app.get('/restaurants/new', notImplemented);





app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
