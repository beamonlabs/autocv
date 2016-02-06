'use strict';

angular.module('autocv').controller('TagsCtrl', function($scope, $http, $state, ngToast, TagService, MatchService) {

  $scope.tags = [];

  TagService.getTags().then(function(data) {
    _.forEach(data, function(tag) {

      _.assign (tag, {
        editing: false,
        teachers: MatchService.findTeachersWithTag(tag.Name).length,
        students: MatchService.findPeopleWantingTag(tag.Name).length
      });
    });
    $scope.tags = data;
  }, function(status) {
    ngToast.warning('Kunde inte hämta kompetenser ' + status);
  });

  $scope.edit = function(tag) {
    tag.editing = !tag.editing;
  };

  $scope.save = function(tag) {
    TagService.saveTag(tag).then(function(tag) {
      ngToast.create(tag.Name + ' was saved');
      tag.editing = false;
    },function(msg) {
      ngToast.warning(msg);
      //Keep editing mode, let user try again or cancel
    });
  };

$scope.getTemplate = function(tag) {
  if(tag.editing) {
    return 'tagEdit';
  }
  return 'tagView';
};


});
