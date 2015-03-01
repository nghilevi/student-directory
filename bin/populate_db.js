var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');
var student = mongoose.model('student');
var Team = mongoose.model('Team');

idArr=['001','002','003','004','005','006','007','008','009','0010','0011','0012'];
var data = {
	students: 
	[
		{
			id: idArr[0],
			name: {
				first: 'Colin',
				last: 'Ihrig'
			},
			image: 'images/students/001.png',
			address: 'Siikajoentie 13 91980 LUMIJOKI',
			nationality: 'Finnish'
		},
		{
			id: idArr[1],
			name: {
				first: 'Elon',
				last: 'Musk'
			},
			image: 'images/students/002.png',
			address: 'Norra Larsmovägen 30 70210 KUOPIO',
			nationality: 'Japanese'
		},
		{
			id: idArr[2],
			name: {
				first: 'Matt',
				last: 'Liegey'
			},
			image: 'images/students/003.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'German'
		},
		{
			id: idArr[3],
			name: {
				first: 'Aleksey',
				last: 'Smolenchuk'
			},
			image: 'images/students/004.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'German'
		},
		{
			id: idArr[4],
			name: {
				first: 'Ada',
				last: 'Lovelace'
			},
			image: 'images/students/005.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'German'
		},
		{
			id: idArr[5],
			name: {
				first: 'Adam',
				last: 'Sandler'
			},
			image: 'images/students/006.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: idArr[6],
			name: {
				first: 'Tom',
				last: 'Cruise'
			},
			image: 'images/students/007.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: idArr[7],
			name: {
				first: 'Obama',
				last: 'Barack'
			},
			image: 'images/students/008.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: idArr[8],
			name: {
				first: 'Marissa',
				last: 'Mayer'
			},
			image: 'images/students/009.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'American'
		},
		{
			id: idArr[9],
			name: {
				first: 'Linus',
				last: 'Torvalds'
			},
			image: 'images/students/010.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Finnish'
		}
		,
		{
			id: idArr[10],
			name: {
				first: 'Kent',
				last: 'Beck'
			},
			image: 'images/students/011.png',
			address: 'Osmajoentie 98 79100 LEPPÄVIRTA ',
			nationality: 'Finnish'
		}
		,
		{
			id: idArr[11],
			name: {
				first: 'Douglas',
				last: 'Crockford'
			},
			image: 'images/students/012.png',
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

var deletestudents = function(callback) {
	console.info('Deleting students');
	student.remove({}, function(error, response) {
		if (error) {
			console.error('Error deleting students: ' + error);
		}
		console.info('Done deleting students');
		callback();
	});
};

var addstudents = function(callback) {
	console.info('Adding students');
	student.create(data.students, function (error) {
		if (error) {
			console.error('Error: ' + error);
		}
		console.info('Done adding students');
		callback();
	});
};

var deleteTeams = function(callback) {
	console.info('Deleting teams');
	student.remove({}, function(error, response) {
		if (error) {
			console.error('Error deleting teams: ' + error);
		}
		console.info('Done deleting teams');
		callback();
	});
};

var addTeams = function(callback) {
	console.info('Adding teams');
	student.create(data.teams, function (error, team) {
		if (error) {
			console.error('Error: ' + error);
		} else {
			data.team_id = team._id;
		}
		console.info('Done adding teams');
		callback();
	});
};

var updatestudentTeams = function (callback) {
	console.info('Updating student teams');
	var team = data.teams[0];
	// Set everyone to be on the same team to start
	student.update({}, 
		{
			team: data.team_id
		}, {
			multi: true
		}, function (error, numberAffected, response) {
			if (error) {
				console.error('Error updating student team: ' + error);
			}
			console.info('Done updating student teams');
			callback();
		}
	);
};

//http://stackoverflow.com/questions/15969082/node-js-async-series-is-that-how-it-is-supposed-to-work
//http://www.sebastianseilund.com/nodejs-async-in-practice
async.series( 
	[
		deletestudents,
		deleteTeams,
		addstudents,
		addTeams,
		updatestudentTeams
	], 
	function(error, results) {
		if (error) {
			console.error('Error: ' + error);
		}
		mongoose.connection.close();
		console.log('Done!');
	}
);