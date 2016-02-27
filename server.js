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

// routes
var userRoutes = require( path.join(__dirname, '/routes/users'));
var restaurantRoutes = require('./routes/restaurants');

var app = express();

var notImplemented = (req, res) => {
  res.send(req.method + ' is not implemented');
};

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

// home route - log in screen
app.get('/', (req, res) => {
  res.render('pages/home')
})



app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
