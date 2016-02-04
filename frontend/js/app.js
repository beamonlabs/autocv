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
      url:"/edit/:email",
      templateUrl: "templates/editperson.html",
      controller: "EditCtrl"
    })
    .state('add', {
      url:"/add",
      templateUrl: "templates/editperson.html",
      controller: "EditCtrl"
    })
});

//People List Controller
autocv.controller('PeopleCtrl', function($scope, $http, $state) {
  $scope.people = [];
  $http.get('/api/people/')
  .success(function(data) {
    $scope.people = data;
  }).error(function(msg, code) {
    console.log(msg);
  });

  $scope.deletePerson = function(email) {
    $http.delete('/api/people/' + email).success(function(data) {
    }).error(function(msg, code) {
      console.log(msg);
    });
  }

  $scope.editPerson = function(email) {
    $state.go("edit", {"email": email });
  }
});

autocv.controller('EditCtrl', function($scope, $http, $state, $stateParams, tagService) {
  $scope.person = {};

  if($stateParams.email !== 'undefined') {
    $http.get('api/people/' + $stateParams.email)
    .success(function(data) {
      $scope.person = data;
    }).error(function(msg, code) {
      console.log(msg);
    });
  }

  $scope.tagName = '';

  $scope.submit = function() {
      //Do nothing?
  };

  $scope.addTag = function(tagName) {
    if(tagName.length > 1) {
      var tag = tagService.saveIfNew(tagName, function(tagName) {
        console.log(tagName + ' saved successfully!')
      });
      if(!_.contains($scope.person.Tags, tag)) {
        $scope.person.Tags.push(tag);
        $scope.tagName = '';
      }
    }
  };

  $scope.keyUp = function(event) {
    if(event.keyCode === 13) {
      $scope.addTag($scope.tagName);
      $scope.tagName = '';
    }
  };

  $scope.removeTag = function(tagToRemove) {
    $scope.person.Tags = _.reject($scope.person.Tags, function(tag) {
      return tag.Name == tagToRemove.Name;
    });
  };

  $scope.tags = function() {
    return _.difference(tagService.allTagNames(), _.map($scope.person.Tags, function(tag) {
      return tag.Name;
    }));
  };

  $scope.save = function() {
    $http.post('api/people/', $scope.person).success(function(msg, code) {
      $state.go('home');
    }).error(function(msg, code) {
      console.log(msg);
    })
  }
});

autocv.factory('tagService',['$http', function($http) {
  var instance = {};
  instance.tags = [];

  $http.get('/api/tags/').success(function(data) {
    instance.tags = data;
  }).error(function(msg, code) {
    alert('error getting tags');
  });

  instance.allTagNames = function() {
    return _.map(instance.tags, function(tag) {
      return tag.Name;
    })
  };

  instance.filteredTags = function(filter) {
    if(filter.length < 3) {
      return [];
    }
    return _.filter(instance.allTagNames(), filter);
  };

  instance.tagExists = function(tagName) {
    return _.contains(instance.allTagNames(), tagName);
  };

  instance.saveIfNew = function(tagName, success) {
    var tag = { Name: tagName };
    if(!instance.tagExists(tagName)) {
      $http.post('/api/tags/', tag)
      .success(function(msg,code) {
          instance.tags.push(tag);
        if(success !== 'undefined') {
          success(tagName);
        }
      })
      .error(function(msg, code) {
        alert('couldnt save tag');
      })
    };
    return tag;
  }

  return instance;
}]);
