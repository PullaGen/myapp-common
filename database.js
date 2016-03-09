var mongoose = require('mongoose');

var db;
var callback;
exports.makeDBConnection = function(dbURL, cb)
{
	db = mongoose.connection;
	mongoose.connect(dbURL);	
	callback = cb;
};

db.on('error', function(err) {
	console.log('Database connection error: ' + err);	
});

db.on('connected', function() {
	console.log("Connected to DB Suuceesfully");
	callback(db);
});

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Database connection disconnected'); 
});