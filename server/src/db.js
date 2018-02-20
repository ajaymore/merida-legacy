var MongoClient = require('mongodb').MongoClient;

var state = {};
var connection = null;

exports.connect = function(url, dbName, done) {
  if (state[dbName]) return done();

  MongoClient.connect(url, function(err, client) {
    connection = client;
    if (err) return done(err);
    state[dbName] = client.db(dbName);
    done();
  });
};

exports.get = function(dbName) {
  return state[dbName];
};

exports.close = function(done) {
  if (connection) {
    connection.close(function(err, result) {
      state = {};
      done(err);
    });
  }
};
