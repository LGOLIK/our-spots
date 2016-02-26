'use strict';

require('dotenv').config();

var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var userRoutes = require( path.join(__dirname, '/routes/users'));

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/users', userRoutes)

// check that home is up
app.get('/', (req, res) => res.render('home'));



app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
