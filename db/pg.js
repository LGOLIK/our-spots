'use strict';

require('dotenv').config();

var pg = require('pg');
var express = require('express');
var bcrypt = require('bcrypt');
// there are a lot of options with encrypting passwords. this will set for 10
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');

// config path
var config = process.env.DATABASE_URL;
// if (process.env.NODE_ENV === 'production') {
//   var config = process.env.DATABASE_URL;
// } else {
//   var config = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;
// }

// function to show all restaurants
function showRestaurants(req, res, next) {
  pg.connect(config, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // render the list of restaurants not already in the user's list
    var query = client.query(`SELECT r.*
      FROM restaurants r
      WHERE NOT EXISTS
        (SELECT j.* FROM rests_users_join j
         WHERE j.user_id = $1 AND r.rest_id = j.rest_id);`, [req.session.user.user_id], function(err, results) {
          done();
          if (err) {
            return console.error('Error with query', err);
          }
          res.rows = results.rows;
          next();
        }); // end of query
  }); // end of pg connect
};  // end of show restaurants

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

// function to update a user restaurant from unseen to seen
function updateUserRest(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // change the visited status on the restaurant to TRUE
    var query = client.query(`UPDATE rests_users_join
      SET visited=TRUE
      WHERE rest_id=$1 AND user_id=$2;`, [req.params.id, req.session.user.user_id], (err, results) => {
        done();
        if (err) {
          return console.error('Error with query', err);
        }
        next();
      }); // end of query
  }); // end of pg connect
} // end of updateUserRest

// function to remove a restaurant from the user's list
function deleteUserRest(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // remove the specified user-restaurant combination from the join table
    var query = client.query(`DELETE from rests_users_join
      WHERE rest_id=$1 AND user_id=$2;`, [req.params.id, req.session.user.user_id], (err, results) => {
        done();
        if (err) {
          return console.error('Error with query', err);
        }
        next();
      }); // end of query
  }); // end of pg connect
} // end of deleteUserRest

// function to show the user's restaurants
function showUserRests(req, res, next) {
  pg.connect(config, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    // show the list of restaurants for the user where the visited attribute is false
    var query = client.query(`SELECT r.*, j.visited
      FROM restaurants as r
      LEFT JOIN rests_users_join AS j
      ON r.rest_id = j.rest_id
      WHERE j.user_id = $1
      ORDER BY cuisine;`, [req.session.user.user_id], function(err, results) {
        done();
        if (err) {
          return console.error('Error with query', err);
        }
        res.rows = results.rows;
        next();
      }); // end of query
  }); // end of pg connect
} // end of showRestsUnseen

// function to show the restaurants a user has been to
function showRestsSeen(req, res, next) {

}

function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  pg.connect(config, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      res.status(500).json({ success: false, data: err});
    }

    // find user by email entered at log in
    var query = client.query('SELECT * FROM users WHERE email LIKE ($1);',
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
  }); // end of pg connect
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

// export it out
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.showRestaurants = showRestaurants;
module.exports.showUserRests = showUserRests;
module.exports.addUserRestaurant = addUserRestaurant;
module.exports.updateUserRest = updateUserRest;
module.exports.deleteUserRest = deleteUserRest;
