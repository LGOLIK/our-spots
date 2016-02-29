'use strict';

require('dotenv').config();

var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var pg = require('pg');
// config path
var config = process.env.DATABASE_URL;
// if (process.env.NODE_ENV === 'production') {
//   var config = process.env.DATABASE_URL;
// } else {
//   var config = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;
// }
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

// set views and public path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public/') ) );

// user session login info
app.use(session({
  store: new pgSession({
    pg : pg,
    conString : config,
    tableName : 'session'
  }),
  secret: 'supersecret',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// home route - log in screen
app.get('/', (req, res) => {
  res.render('pages/home')
})

// routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
