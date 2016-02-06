'use strict';

angular.module('autocv').controller('EditCtrl', function($scope, $http, $state, $stateParams, ngToast, TagService, PeopleService) {
  var self = this;
  $scope.tagName = '';
  $scope.person = {
    Tags: [],
    WantedSkills: [],
    TeachingSkills: []
  };

  self.fixPerson = function(person) {
    if (typeof(person.Tags) === 'undefined' || person.Tags === null) {
      person.Tags = [];
    }
    if (typeof(person.WantedSkills) === 'undefined' || person.WantedSkills === null) {
      person.WantedSkills = [];
    }
    if (typeof(person.TeachingSkills) === 'undefined' || person.TeachingSkills === null) {
      person.TeachingSkills = [];
    }
  };

  if (typeof($stateParams.email) !== 'undefined') {
    $http.get('api/people/' + $stateParams.email)
      .success(function(data) {
        $scope.person = data;
        self.fixPerson($scope.person);
      }).error(function(msg, code) {
        ngToast.warning('Could not load ' + $stateParams.email);
      });
  }

  $scope.submit = function() {
    //Do nothing?
  };

  self.addTagToArea = function(tag, area) {
    if (area === 'teach') {
      if (!_.some($scope.person.TeachingSkills, tag)) {
        $scope.person.TeachingSkills.push(tag);
        ngToast.create(tag.Name + ' tillagt till det du kan lära ut!');
      }
    }
    if (area === 'learn') {
      if (!_.some($scope.person.WantedSkills, tag)) {
        $scope.person.WantedSkills.push(tag);
        ngToast.create(tag.Name + ' tillagt till det du vill lära dig!');
      }
    }
  };

  $scope.addTag = function(tagName, area) {
    if (tagName.length > 1) {
      TagService.save(tagName)
        .then(function(tag) {
          self.addTagToArea(tag, area);
        }, function(tag, message) {
          ngToast.warning(message + ' ' + tag.Name);
        });
    }
    $scope.tagName = '';
  };

  $scope.keyUp = function(event, area) {
    if (event.keyCode === 13) {
      $scope.addTag($scope.tagName, area);
      $scope.tagName = '';
    }
  };

  self.removeTagFromArea = function(tagToRemove, area) {
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

  $scope.removeTag = function(tagToRemove, area) {
    self.removeTagFromArea(tagToRemove, area);
  };

  $scope.availableTagNames = function() {
    return _.difference(TagService.allTagNames(), _.union(_.map($scope.person.TeachingSkills, function(tag) {
      return tag.Name;
    }), _.map($scope.person.WantedSkills, function(tag) {
      return tag.Name;
    })));
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
      ngToast.warning('Could not save ' + $scope.person.Name);
    });
  };
});
