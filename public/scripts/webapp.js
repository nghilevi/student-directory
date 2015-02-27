/*ngRoute gives us access to the $routeProvider dependency. $routeProvider
is the object we’ll use to set up client-side routing*/

var app = angular.module('app', ['ngRoute', 'ngResource']);

/*Angular modules, such as app , can have many configuration blocks via .config and .run*/
//.config blocks the perfect place to store code that runs once before the application starts
//we want to fully configure $routeProvider before the application starts.
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/view', {
		templateUrl: 'view.html',
		controller: 'view'
	})
	.when('/edit/:employeeId', {
		templateUrl: 'edit.html',
		controller: 'edit'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

app.factory('EmployeeService', ['$resource', function($resource) {
	return $resource('/employees/:employeeId', {}, {
		list: {
			isArray: true
		},
		get: {
			isArray: false
		}
	});
}]);

app.controller('view', ['$scope', 'EmployeeService',function($scope, EmployeeService) {
	$scope.employees = [];
	$scope.firstName = $scope.lastName = '';
	EmployeeService.list(function (data) {
		$scope.employees = data;
		console.log(data);
	});
}]);

app.controller('edit', ['$scope', 'EmployeeService','$routeParams',function($scope, EmployeeService, $routeParams) {
	$scope.employee = {};
	EmployeeService.get({
		employeeId: $routeParams.employeeId
	}, function (data) {
		$scope.employee = data;
	});
}]);