'use strict';

angular.module('angularApp').controller('MainController', function($scope, noopService){
	
	$scope.someText = noopService.getSomeText();

});

