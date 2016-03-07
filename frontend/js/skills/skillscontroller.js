'use strict';

angular.module('autocv').controller('SkillsCtrl', function($scope, $http, $state, ngToast, SkillService) {

  $scope.skills = [];

  SkillService.getSkills().then(function(response) {
    _.forEach(response.data, function(skill) {

      _.assign(skill, {
        editing: false,
        // teachers: MatchService.findTeachersWithskill(skill.Name).length,
        // students: MatchService.findPeopleWantingskill(skill.Name).length
      });
    });
    $scope.skills = response.data;
  }, function(respons) {
    ngToast.warning('Kunde inte hämta kompetenser ' + response.status);
  });

  $scope.edit = function(skill) {
    skill.editing = !skill.editing;
  };

  $scope.save = function(skill) {
    SkillService.saveSkill(skill).then(function(response) {
      ngToast.create(response.data.Name + ' was saved');
      skill.editing = false;
    }, function(response) {
      ngToast.warning(response.message);
      //Keep editing mode, let user try again or cancel
    });
  };

  $scope.getTemplate = function(skill) {
    if (skill.editing) {
      return 'skillEdit';
    }
    return 'skillView';
  };
});
