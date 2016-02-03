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
    .state('add', {
      url:"/add",
      templateUrl: "templates/editperson.html",
      controller: "AddCtrl"
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
    $scope.person.Tags = [{Id: "1", Name: "Microsoft.NET"},{Id:"2", Name: "C#"},{Id:"3", Name:"Scrum"}];
  }).error(function(msg, code) {
    console.log(msg);
  });

  $scope.tags = [];

  $http.get('/api/tags/').success(function(data) {
    $scope.tags = data;
  }).error(function(msg, code) {
    console.log(msg);
  });

  $scope.removeTag = function(id) {
    console.log("remove id " + id);
  };

  $scope.save = function() {
    $http.post('api/people/', $scope.person).success(function(msg, code) {
      $state.go('home');
    }).error(function(msg, code) {
      console.log(msg);
    })
  }
});

autocv.controller('AddCtrl', function($scope, $http, $state, $stateParams) {
  $scope.person = {};
  $scope.save = function() {
    if($scope.person.Id === 'undefined') {
      $scope.person.Id = '';
    }
    $http.post('api/people/', $scope.person).success(function(msg, code) {
      $state.go('home');
    }).error(function(msg, code) {
      console.log(msg);
    })
  }
});
