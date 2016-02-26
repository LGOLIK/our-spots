'use strict';

var pg = require('pg');
var bcrypt = require('bcrypt');
// there are a lot of options with encrypting passwords. this will set for 10
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');

var config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
};

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
