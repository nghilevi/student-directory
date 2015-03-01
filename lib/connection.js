/*
Establish a database connection and register our Mongoose models. We’ve
also added a SIGINT handler that will shut down the Mongo connection and the
Node process when the user presses Control+C
*/

var mongoose = require('mongoose');
var dbUrl = 'mongodb://director:1235@ds049631.mongolab.com:49631/student-directory';

mongoose.connect(dbUrl);

// Close the Mongoose connection on Control+C
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected');
		process.exit(0);
	});
});

require('../models/student');
require('../models/team');