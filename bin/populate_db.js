var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');

var data = {
	employees: 
	[
		{
			id: '1000003',
			name: {
				first: 'Colin',
				last: 'Ihrig'
			},
			image: 'images/employees/1000003.png',
			address: 'Siikajoentie 13 91980 LUMIJOKI',
			nationality: 'Finnish'
		},
		{
			id: '1000021',
			name: {
				first: 'Adam',
				last: 'Bretz'
			},
			address: 'Norra Larsmovägen 30 70210 KUOPIO',
			nationality: 'Japanese'
		},
		{
			id: '1000022',
			name: {
				first: 'Matt',
				last: 'Liegey'
			},
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '1000025',
			name: {
				first: 'Aleksey',
				last: 'Smolenchuk'
			},
			image: 'images/employees/1000025.png' /* invalid image */,
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '1000030',
			name: {
				first: 'Sarah',
				last: 'Gay'
			},
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '1000031',
			name: {
				first: 'Dave',
				last: 'Beshero'
			},
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		}
	],
	teams: [
		{
			name: 'Finance'
		},
		{
			name: 'Business Information Technology'
		},
		{
			name: 'Graphic Design'
		},
		{
			name: 'Computer Science'
		}
	]
};

var deleteEmployees = function(callback) {
	console.info('Deleting employees');
	Employee.remove({}, function(error, response) {
		if (error) {
			console.error('Error deleting employees: ' + error);
		}
		console.info('Done deleting employees');
		callback();
	});
};

var addEmployees = function(callback) {
	console.info('Adding employees');
	Employee.create(data.employees, function (error) {
		if (error) {
			console.error('Error: ' + error);
		}
		console.info('Done adding employees');
		callback();
	});
};

var deleteTeams = function(callback) {
	console.info('Deleting teams');
	Team.remove({}, function(error, response) {
		if (error) {
			console.error('Error deleting teams: ' + error);
		}
		console.info('Done deleting teams');
		callback();
	});
};

var addTeams = function(callback) {
	console.info('Adding teams');
	Team.create(data.teams, function (error, team) {
		if (error) {
			console.error('Error: ' + error);
		} else {
			data.team_id = team._id;
		}
		console.info('Done adding teams');
		callback();
	});
};

var updateEmployeeTeams = function (callback) {
	console.info('Updating employee teams');
	var team = data.teams[1];// Set everyone to be on the same team 1 to start
	Employee.update({}, 
		{
			team: data.team_id
		}, {
			multi: true
		}, function (error, numberAffected, response) {
			if (error) {
				console.error('Error updating employe team: ' + error);
			}
			console.info('Done updating employee teams');
			callback();
		}
	);
};

//http://stackoverflow.com/questions/15969082/node-js-async-series-is-that-how-it-is-supposed-to-work
//http://www.sebastianseilund.com/nodejs-async-in-practice
async.series( 
	[
		deleteEmployees,
		deleteTeams,
		addEmployees,
		addTeams,
		updateEmployeeTeams
	], 
	function(error, results) {
		if (error) {
			console.error('Error: ' + error);
		}
		mongoose.connection.close();
		console.log('Done!');
	}
);