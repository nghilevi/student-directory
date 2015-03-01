'use strict';
var app = angular.module('app', ['ngRoute', 'ngResource']).constant('config', {
	nationalities: ['American','Finnish','Japanese','German','Vietnamese','Chinese']
});

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'home.html'
	})
	.when('/employees', {
		templateUrl: 'employees.html',
		controller: 'EmployeesCtrl'
	})
	.when('/employees/:employeeId', {
		templateUrl: 'employee.html',
		controller: 'EmployeeCtrl'
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
app.factory('EmployeeService', ['$resource', function($resource) { //FTW
	return $resource('/employees/:employeeId', {}, {
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
app.controller('EmployeesCtrl', ['$scope','$location','EmployeeService',
	function($scope,$location,service) {
		$scope.template={
			name: 'search.html',
        	url: '../search.html'
        }
        $scope.go = function (employeeId) {
		  $location.path('/employees/'+employeeId);
		};
		service.query(function(data, headers) {
			//console.log(data);
			$scope.employees = data;
		}, _handleError);
	}
]);

app.controller('EmployeeCtrl', ['$scope', '$routeParams','EmployeeService', 'TeamService', '$q', 'config', '$route',
	function($scope, $routeParams, employee, team, $q, config,$route) {
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
		employee.get({
			employeeId: $routeParams.employeeId
		}).$promise, team.query().$promise
		]).then(function(values) {
			$scope.teams = values[1];
			$scope.employee = values[0];
			$scope.employee.team = getTeam($scope.teams,$scope.employee.team._id);
		}).catch(_handleError);

		$scope.editing = false;
		// To prevent multiple references to the same array, give us a new copy of it.
		$scope.nationalities = config.nationalities.slice(0);
		$scope.edit = function() {
			$scope.editing = !$scope.editing;
		};

		$scope.save = function() {

			employee.update({
				employeeId: $routeParams.employeeId
			}, $scope.employee, function() {
				$scope.editing = !$scope.editing;
				console.log('Done saving!');
			});
			
		};

		$scope.cancel = function () {
			$route.reload();
		}

	}
]);

app.controller('AddNewCtrl', ['$scope','EmployeeService', 'TeamService', '$q', 'config', '$route',
	function($scope, employee, team, $q, config,$route) {

		//default info
		$scope.employee={
			id: "####",
			name: {
				first:"First Name",
				last:"Last Name"
			},
			address: "",
			nationality: ""
		};

		$scope.editing = false;
		// To prevent multiple references to the same array, give us a new copy of it.
		$scope.nationalities = config.nationalities.slice(0);
		$scope.edit = function() {
			$scope.editing = !$scope.editing;
		};

		$scope.save = function() {

			employee.update({
				employeeId: $scope.employee.id
			}, $scope.employee, function() {
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
		$scope.go = function (employeeId) {
		  $location.path('/employees/'+employeeId);
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