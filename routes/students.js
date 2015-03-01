var express = require('express');
var mongoose = require('mongoose');
var student = mongoose.model('student');
var Team = mongoose.model('Team');
var router = express.Router();

router.get('/students', function(req, res, next) {
	student.find().sort('name.last').exec(function(error, results) {
		if (error) {
			return next(error);
		}
		// Respond with valid data
		res.json(results);
	});
});

router.get('/students/:studentId', function(req, res, next) {
	student.findOne({
		id: req.params.studentId
	}).populate('team').exec(function (error, results) { //WTF populate
		if (error) {
			return next(error);
		}
		// If valid user was not found, send 404
		if (!results) {
			res.send(404);
		}

		// Respond with valid data
		res.json(results);
	});
});

router.put('/students/:studentId', function (req, res, next) {
	// Remove this or mongoose will throw an error
	// because we would be trying to update the mongo ID
	delete req.body._id;
	req.body.team = req.body.team._id;
	student.update({
		id: req.params.studentId
	}, req.body, function (err, numberAffected, response) { //WTF res.body
		if (err) {
			return next(err);
		}
		res.send(200);
	});
});

module.exports = router;