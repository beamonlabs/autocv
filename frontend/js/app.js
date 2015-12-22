var autocv = angular.module('autocv', ['ui.router']);

autocv.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state('home', {
      
    })
});
