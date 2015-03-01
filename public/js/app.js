'use strict';
var app = angular.module('app', ['ngRoute', 'ngResource']).constant('config', {
	nationalities: ['American','Finnish','Japanese','German','Vietnamese','Chinese'],
	departments:['Finance','Business Information Technology','Graphic Design','Computer Science']
});

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'home.html'
	})
	.when('/students', {
		templateUrl: 'students.html',
		controller: 'studentsCtrl'
	})
	.when('/students/:studentId', {
		templateUrl: 'student.html',
		controller: 'studentCtrl'
	})
	.when('/teams', {
		templateUrl: 'teams.html',
		controller: 'TeamsCtrl'
	})
	.when('/teams/:teamId', {
		templateUrl: 'team.html',
		controller: 'TeamCtrl'
	})
	.when('/add_new', {
		templateUrl: 'add_new.html',
		controller: 'AddNewCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

//SERVICES
app.factory('studentService', ['$resource', function($resource) { //FTW
	return $resource('/students/:studentId', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);

app.factory('TeamService', ['$resource', function($resource) {
	return $resource('/teams/:teamId');
}]);

//DIRECTIVES
app.directive('imageFallback', function() {
	return {
		link: function(scope, elem, attrs) {
			//https://docs.angularjs.org/api/ng/function/angular.element
			elem.bind('error', function() {
				//this == HTMLImageElement or <img>
				angular.element(this).attr('src', attrs.imageFallback);
			});
		}
	};
}).directive('editInLine', function ($compile) { //FTW
	var exports = {};
	function link (scope, element, attrs) {
		var template = '<div class="in-line-container">';
		var newElement;
		var displayValue;
		var options;
		switch (attrs.editType) {
			case 'select':
				displayValue = attrs.displayValue ? 'displayValue' : 'value';
				options = attrs.editOption;
				options = options.replace(attrs.editList, 'editList');
				template += '<div class="in-line-value" ng-hide="editing">{{' + displayValue + '}}</div>';
				template += '<select class="in-line-input form-control"ng-show="editing" ng-model="value" ng-options="'+ options +'"></select>';
				break;
			case 'number':
				template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
				template += '<input class="in-line-input form-control"ng-show="editing" type="number" ng-model="value" step="any"min="0" max="99999" />'
				break;
			default:
				template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
				template += '<input class="in-line-input form-control"ng-show="editing" type="text" ng-model="value" />';
		}

		// Close the outer div
		template += '</div>';
		newElement = $compile(template)(scope);
		element.replaceWith(newElement);
		scope.$on('$destroy', function () {
			newElement = undefined;
			element = undefined;
		});
	}

	exports.scope = {
		value: '=',
		editing: '=',
		editList: '=',
		displayValue: '='
	};

	exports.restrict = 'E';
	exports.link = link;
	return exports;
});

//Directive to help navigation bar active on click
app.directive('bsNavbar', ['$location', function ($location) {
  return {
    restrict: 'A',
    link: function postLink(scope, element) {
      scope.$watch(function () {
        return $location.path();
      }, function (path) {
        angular.forEach(element.children(), (function (li) {
          var $li = angular.element(li),
            regex = new RegExp('^' + $li.attr('data-match-route') + '$', 'i'),
            isActive = regex.test(path);
          $li.toggleClass('active', isActive);
        }));
      });
    }
  };
}]);

//CONTROLLERS
app.controller('studentsCtrl', ['$scope','$location','studentService',
	function($scope,$location,service) {
		$scope.template={
			name: 'search.html',
        	url: '../search.html'
        }
        $scope.go = function (studentId) {
		  $location.path('/students/'+studentId);
		};
		service.query(function(data, headers) {
			//console.log(data);
			$scope.students = data;
		}, _handleError);
	}
]);

app.controller('studentCtrl', ['$scope', '$routeParams','studentService', 'TeamService', '$q', 'config', '$route',
	function($scope, $routeParams, student, team, $q, config,$route) {
		$scope.address = {};
		function getTeam (teams, teamId) {
			for (var i = 0, l = teams.length; i < l; ++i) {
				var t = teams[i];
				if (t._id === teamId) {
					return t;
				}
			}
		}

		$q.all([
		student.get({
			studentId: $routeParams.studentId
		}).$promise, team.query().$promise
		]).then(function(values) {
			$scope.teams = values[1];
			$scope.student = values[0];
			$scope.student.team = getTeam($scope.teams,$scope.student.team._id);
		}).catch(_handleError);

		$scope.editing = false;
		// To prevent multiple references to the same array, give us a new copy of it.
		$scope.nationalities = config.nationalities.slice(0);
		$scope.edit = function() {
			$scope.editing = !$scope.editing;
		};

		$scope.save = function() {

			student.update({
				studentId: $routeParams.studentId
			}, $scope.student, function() {
				$scope.editing = !$scope.editing;
				console.log('Done saving!');
			});
			
		};

		$scope.cancel = function () {
			$route.reload();
		}

	}
]);

app.controller('AddNewCtrl', ['$scope','studentService', 'TeamService', '$q', 'config', '$route',
	function($scope, student, team, $q, config,$route) {
		//default info
		$scope.student={
			id: "####",
			name: {
				first:"First Name",
				last:"Last Name"
			},
			address: "",
			nationality: ""
		};

		$scope.editing = false; 
		$scope.nationalities = config.nationalities.slice(0);
		$scope.departments= config.departments.slice(0);
		$scope.edit = function() {
			$scope.editing = !$scope.editing;
		};

		$scope.save = function() {

			student.update({
				studentId: $scope.student.id
			}, $scope.student, function() {
				$scope.editing = !$scope.editing;
				console.log('Done saving!');
			});
			
		};

		$scope.cancel = function () {
			$route.reload();
		}

	}
]);

//MULTIPLE
app.controller('TeamsCtrl', ['$scope','$location', 'TeamService',
	function($scope, $location,service) {
		$scope.go = function (teamId) {
		  $location.path('/teams/'+teamId);
		};
		service.query(function (data) {
			$scope.teams = data;
		}, _handleError);
	}
]);

//SINGLE
app.controller('TeamCtrl', ['$scope','$location', '$routeParams', 'TeamService',
	function($scope,$location, $routeParams, service) {
		$scope.go = function (studentId) {
		  $location.path('/students/'+studentId);
		};
		service.get({
			teamId: $routeParams.teamId
		}, function(data, headers) {
			$scope.team = data;
		}, _handleError);
	}
]);

function _handleError(response) {
	// TODO: Do something here. Probably just redirect to error page
	console.log('%c ' + response, 'color:red');
}