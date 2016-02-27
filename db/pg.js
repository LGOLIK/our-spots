'use strict';

var pg = require('pg');
var express = require('express');
var bcrypt = require('bcrypt');
// there are a lot of options with encrypting passwords. this will set for 10
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');
var config = "postgres://" + process.env.DB_USER + ":" +
  process.env.DB_PASSWORD + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;

// function to show all restaurants
function showRestaurants(req, res, next) {
  pg.connect(config, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // render the list of restaurants that the user hasn't already tagged
    var query = client.query(`SELECT r.*
      FROM restaurants as r
      LEFT JOIN rests_users_join AS j
      ON r.rest_id = j.rest_id
      WHERE j.user_id != ${req.session.user.user_id} OR j.user_id IS NULL
      ORDER BY cuisine;`, function(err, results) {
        done();
        if (err) {
          return console.error('Error with query', err);
        }
        res.rows = results.rows;
        next();
      }); // end of query
  }); // end of pg connect
};  // end of show restaurants

function showRestsUnseen(req, res, next) {
  pg.connect(config, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // render the list of restaurants that the user hasn't already tagged
    var query = client.query(`SELECT *
      FROM restaurants as r
      LEFT JOIN rests_users_join AS j
      ON r.rest_id = j.rest_id
      WHERE j.user_id = ${req.session.user.user_id} AND j.visited = FALSE
      ORDER BY cuisine;`, function(err, results) {
        done();
        if (err) {
          return console.error('Error with query', err);
        }
        res.rows = results.rows;
        next();
      }); // end of query
  }); // end of pg connect
}

// function to add restaurant to user list
function addUserRestaurant(req, res, next) {
  pg.connect(config, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // insert the rest id from the link, the user_id from the session, and FALSE for visited into the join table
    client.query('INSERT INTO rests_users_join VALUES ($1, $2, $3)', [req.params.id, req.session.user.user_id, 'FALSE'], (err, results) => {
      done();

      if (err) {
        console.error('Error with query', err);
      }

      res.rows = results.rows;
      next();
    }); // end of query
  }); // end of pg connect
} // end of add user restaurants

function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  // find user by email entered at log in
  pg.connect(config, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      res.status(500).json({ success: false, data: err});
    }

    var query = client.query("SELECT * FROM users WHERE email LIKE ($1);",
      [email], function(err, result) {
        done()
        if(err) {
          return console.error('error, running query', err);
        }

        if (result.rows.length == 0) {
          res.status(204).json({success: false, data: 'no account matches that password'})
        } else if (bcrypt.compareSync(password, result.rows[0].password)) {
          res.rows = result.rows[0]
          next()
        }
    });
  });
} // end of log in user

function createSecure(first, last, email, password, callback) {
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(first, last, email, hash);
    })
  })
}

function createUser(req, res, next) {
  createSecure(req.body.first, req.body.last, req.body.email, req.body.password, saveUser);

  function saveUser(first, last, email, hash) {
    pg.connect(config, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      var query = client.query('INSERT INTO users( first, last, email, password ) VALUES ($1, $2, $3, $4);', [first, last, email, hash], function(err, result) {
        done();
        if (err) {
          return console.log('error running query', err);
        }
        next();
      })
    })
  }
} // end of create user function

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.showRestaurants = showRestaurants;
module.exports.showRestsUnseen = showRestsUnseen;
module.exports.addUserRestaurant = addUserRestaurant;
