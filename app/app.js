'use strict';

angular.module('angularApp', [
    'ngResource',
    'ngRoute',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/mainView.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });