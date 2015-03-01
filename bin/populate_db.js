var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');

idArr=['001','002','003','004','005','006','007','008','009','0010','0011','0012'];
var data = {
	employees: 
	[
		{
			id: '001',
			name: {
				first: 'Colin',
				last: 'Ihrig'
			},
			image: 'images/employees/001.png',
			address: 'Siikajoentie 13 91980 LUMIJOKI',
			nationality: 'Finnish'
		},
		{
			id: '002',
			name: {
				first: 'Elon',
				last: 'Musk'
			},
			image: 'images/employees/002.png',
			address: 'Norra Larsmovägen 30 70210 KUOPIO',
			nationality: 'Japanese'
		},
		{
			id: '003',
			name: {
				first: 'Matt',
				last: 'Liegey'
			},
			image: 'images/employees/003.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '004',
			name: {
				first: 'Aleksey',
				last: 'Smolenchuk'
			},
			image: 'images/employees/004.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '005',
			name: {
				first: 'Ada',
				last: 'Lovelace'
			},
			image: 'images/employees/005.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Germany'
		},
		{
			id: '006',
			name: {
				first: 'Adam',
				last: 'Sandler'
			},
			image: 'images/employees/006.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: '007',
			name: {
				first: 'Tom',
				last: 'Cruise'
			},
			image: 'images/employees/007.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: '008',
			name: {
				first: 'Obama',
				last: 'Barack'
			},
			image: 'images/employees/008.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: '009',
			name: {
				first: 'Marissa',
				last: 'Mayer'
			},
			image: 'images/employees/009.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: '010',
			name: {
				first: 'Linus',
				last: 'Torvalds'
			},
			image: 'images/employees/010.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Finnish'
		}
		,
		{
			id: '011',
			name: {
				first: 'Kent',
				last: 'Beck'
			},
			image: 'images/employees/011.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Finnish'
		}
		,
		{
			id: '012',
			name: {
				first: 'Douglas',
				last: 'Crockford'
			},
			image: 'images/employees/012.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Finnish'
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
	var team = data.teams[0];
	// Set everyone to be on the same team to start
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