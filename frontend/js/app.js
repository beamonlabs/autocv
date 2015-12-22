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
    .state('edit', {
      url:"/edit/:id",
      templateUrl: "templates/editperson.html",
      controller: "EditCtrl"
    })
});

//People List Controller
autocv.controller('PeopleCtrl', function($scope, $http, $state) {
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

  $scope.editPerson = function(id) {
    $state.go("edit", {"id": id });
  }
});

autocv.controller('EditCtrl', function($scope, $http, $state, $stateParams) {
  $scope.person = {};
  $http.get('api/people/' + $stateParams.id).success(function(data) {
    $scope.person = data;
  }).error(function(msg, code) {
    console.log(msg);
  })
});
