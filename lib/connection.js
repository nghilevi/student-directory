/*
Establish a database connection and register our Mongoose models. We’ve
also added a SIGINT handler that will shut down the Mongo connection and the
Node process when the user presses Control+C
*/

var mongoose = require('mongoose');
var dbUrl = 'mongodb://hrm:hrm123@ds049161.mongolab.com:49161/hr-management';

mongoose.connect(dbUrl);

// Close the Mongoose connection on Control+C
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected');
		process.exit(0);
	});
});

require('../models/employee');
require('../models/team');