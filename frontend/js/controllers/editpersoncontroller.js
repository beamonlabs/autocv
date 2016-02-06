'use strict';

angular.module('autocv').controller('EditCtrl', function($scope, $http, $state, $stateParams, ngToast, TagService, PeopleService) {
  $scope.tagName = '';
  $scope.person = {
    Tags: [],
    WantedSkills: [],
    TeachingSkills: []
  };

  if (typeof($stateParams.email) !== 'undefined') {
    $http.get('api/people/' + $stateParams.email)
      .success(function(data) {
        $scope.person = data;
      }).error(function(msg, code) {
        ngToast.warning('Could not load ' + $stateParams.email);
      });
  }

  $scope.submit = function() {
    //Do nothing?
  };

  $scope.addTag = function(tagName, area) {
    if (tagName.length > 1) {
      TagService.save(tagName)
        .then(function(tag) {
          ngToast.create(tag.Name + ' added to your skills!');
          if (!_.contains($scope.person.Tags, tag)) {
            $scope.person.Tags.push(tag);
            $scope.tagName = '';
          }
        }, function(tag, message) {
          ngToast.warning(message + ' ' + tag.Name);
        });

    }
  };

  $scope.keyUp = function(event, area) {
    if (event.keyCode === 13) {
      $scope.addTag($scope.tagName, area);
      $scope.tagName = '';
    }
  };

  $scope.removeTag = function(tagToRemove, area) {
    if (area === 'teach') {
      $scope.person.TeachingSkills = _.reject($scope.person.TeachingSkills, function(tag) {
        return tag.Name == tagToRemove.Name;
      });
    }
    if (area === 'learn') {
      $scope.person.WantedSkills = _.reject($scope.person.WantedSkills, function(tag) {
        return tag.Name == tagToRemove.Name;
      });
    }
  };

  $scope.teachTags = function() {
    return _.difference(TagService.allTagNames(), _.map($scope.person.TeachingSkills, function(tag) {
      return tag.Name;
    }));
  };

  $scope.learnTags = function() {
    return _.difference(TagService.allTagNames(), _.map($scope.person.WantedSkills, function(tag) {
      return tag.Name;
    }));
  };

  return _.difference(TagService.allTagNames(), _.map($scope.person.Tags, function(tag) {
    return tag.Name;
  }));
  $scope.tags = function() {};

  $scope.save = function() {
    $http.post('api/people/', $scope.person).success(function(msg, code) {
      $state.go('home');
    }).error(function(msg, code) {
      ngToast.warning('Could not save ' + $scope.person.Name);
    });
  };
});
