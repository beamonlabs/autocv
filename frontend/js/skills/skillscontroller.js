'use strict';

angular.module('autocv').controller('skillsCtrl', function($scope, $http, $state, ngToast, SkillService, MatchService) {

  $scope.skills = [];
  
  skillservice.getskills().then(function(data) {
    _.forEach(data, function(skill) {

      _.assign (skill, {
        editing: false,
        teachers: MatchService.findTeachersWithskill(skill.Name).length,
        students: MatchService.findPeopleWantingskill(skill.Name).length
      });
    });
    $scope.skills = data;
  }, function(status) {
    ngToast.warning('Kunde inte hämta kompetenser ' + status);
  });

  $scope.edit = function(skill) {
    skill.editing = !skill.editing;
  };

  $scope.save = function(skill) {
    skillservice.saveskill(skill).then(function(skill) {
      ngToast.create(skill.Name + ' was saved');
      skill.editing = false;
    },function(msg) {
      ngToast.warning(msg);
      //Keep editing mode, let user try again or cancel
    });
  };

$scope.getTemplate = function(skill) {
  if(skill.editing) {
    return 'skillEdit';
  }
  return 'skillView';
};


});
