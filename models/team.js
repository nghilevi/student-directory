var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	members: {
		type: [Schema.Types.Mixed]
	}
});

function _attachMembers (student, result, callback) {
	student.find({
		team: result._id
	}, function (error, students) {
		if (error) {
			return callback(error);
		}
		result.members = students;
		callback(null, result);
	});
}

// listen for find and findOne
TeamSchema.plugin(postFind, {
	find: function (result, callback) {
			var student = mongoose.model('student');

			async.each(result, function (item, callback) {
				_attachMembers(student, item, callback);
			}, function (error) {
				if (error) {
					return callback(error);
				}
				callback(null, result)
			}
			);
	},
	findOne: function (result, callback) {
		var student = mongoose.model('student');
		_attachMembers(student, result, callback);
	}
});

module.exports = mongoose.model('Team', TeamSchema);