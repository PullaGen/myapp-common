var mongoose = require('mongoose');
var config = require('./config/config.js');
var mongoUrl = config.mongo.url + config.mongo.db_name;

module.exports=function(){

	var db = mongoose.connection;

	mongoose.connect(mongoUrl);

	db.on('error', function(err) {
		console.log('Mongoose connection error: ' + err);
	});

	db.on('connected', function() {
		console.log("Connected to DB Suuceesfully");
	});

	// When the connection is disconnected
	db.on('disconnected', function () {
	  console.log('Mongoose connection disconnected');
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
	  db.close(function () {
	    console.log('Mongoose connection disconnected through app termination');
	    process.exit(0);
	  });
	});
}
