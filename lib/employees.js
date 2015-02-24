var employeeDb = require('../database/employees');

exports.getEmployees = getEmployees;
exports.getEmployee = getEmployee;

function getEmployees (callback) {
	setTimeout(function () {
		callback(null, employeeDb);
	}, 500);
}

function getEmployee (employeeId, callback) {
	getEmployees(function (error, data) {
		if (error) {
			return callback(error);
		}
		var result = data.find(function(item) {
			return item.id === employeeId;
		});
		callback(null, result);
	});
}

if(!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}