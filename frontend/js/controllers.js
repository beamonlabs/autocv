'use strict';

angular.module('autocv').controller('PeopleCtrl', function($scope, $http, $state) {
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
})

.controller('TagsCtrl', function($scope, $http, $state, TagService) {
  $scope.tags = [];
})

.controller('MatchCtrl', function($scope, $http, $state, TagService) {
  $scope.someData = {};
})

.controller('EditCtrl', function($scope, $http, $state, $stateParams, ngToast, TagService) {
  $scope.person = {Tags: []};

  if(typeof($stateParams.email) !== 'undefined') {
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
      TagService.saveIfNew(tagName)
        .then(function(tag) {
            ngToast.create(tag.Name + ' added to your skills!');
            if(!_.contains($scope.person.Tags, tag)) {
                $scope.person.Tags.push(tag);
                $scope.tagName = '';
            }
        }, function(tag, message) {
            ngToast.warning(message + ' ' + tag.Name);
        });

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
    return _.difference(TagService.allTagNames(), _.map($scope.person.Tags, function(tag) {
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
