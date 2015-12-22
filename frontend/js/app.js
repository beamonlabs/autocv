var autocv = angular.module('autocv', ['ui.router']);

//Route Config
autocv.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "templates/peoplelist.html",
      controller: "PeopleCtrl"
    })
});

//People List Controller
autocv.controller('PeopleCtrl', function($scope, $http) {
  $scope.people = [];
  $http.get('/api/people/').success(function(data) {
    $scope.people = data;
  }).error(function(msg, code) {
    console.log(msg);
  });

  $scope.deletePerson = function(id) {
    $http.delete('/api/people/' + id).success(function(data) {
    }).error(function(msg, code) {
      console.log(msg);
    });
  }
});
