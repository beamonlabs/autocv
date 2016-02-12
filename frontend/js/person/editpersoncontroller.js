'use strict';

angular.module('autocv').controller('EditPersonCtrl', function($scope, $http, $state, $stateParams, ngToast, PersonService, SkillService) {
  var self = this;
  $scope.person = {};
  $scope.skills = [];

  $scope.wantedSkills = [];
  $scope.teachingSkills = [];

  $scope.learnFilter = '';
  $scope.teachFilter = '';

  //Start loading data
  PersonService.getPerson($stateParams.email)
    .then(function(data) {
      $scope.person = data;
      $scope.wantedSkills = $scope.person.WantedSkills;
      $scope.teachingSkills = $scope.person.TeachingSkills;
    }, function(message) {
      ngToast.warning(message);
    });

    SkillService.getSkills().then(function(response) {
      $scope.skills = response.data;
    }, function(response) {
      ngToast.warning('Kunde inte ladda kompetenser ' + response.status);
    });

  //End loading data

  //List skills and stuff
  $scope.availableSkills = function() {
    var availableSkills = _.differenceBy($scope.skills, _.union($scope.teachingSkills, $scope.wantedSkills), 'ID');
    return availableSkills;
  };

  //Stop listing skills

  $scope.submit = function() {
    //Do nothing?
  };

  $scope.addskillToArea = function(skill, area) {
      if (area === 'teach') {
        $scope.teachingSkills.push(skill);
        ngToast.create(skill.Name + ' tillagt till det du kan lära ut!');
      }
      if (area === 'learn') {
        $scope.wantedSkills.push(skill);
        ngToast.create(skill.Name + ' tillagt till det du vill lära dig!');
      }
  };

  //Add a new skill to the DB
  $scope.addskill = function(skillName, area) {
    if (skillName.length > 1) {
      SkillService.saveSkill({
          Name: skillName
        })
        .then(function(response) {
          //Response contains saved skill with new ID and everything
          $scope.skills.push(response.data);
          $scope.addskillToArea(response.data, area);
        }, function(response) {
          ngToast.warning('Kunde inte lägga till ' + skillName);
        });
    }
    $scope.skillName = '';
  };

  $scope.keyUpTeach = function(event) {
    if (event.keyCode === 13) {
      $scope.addskill($scope.teachFilter, 'teach');
      $scope.teachFilter = '';
    }
  };

  $scope.keyUpLearn = function(event) {
    if (event.keyCode === 13) {
      $scope.addskill($scope.learnFilter, 'learn');
      $scope.learnFilter = '';
    }
  };

  $scope.removeskillFromArea = function(skillToRemove, area) {
    if (area === 'teach') {
      $scope.person.TeachingSkills = _.reject($scope.person.TeachingSkills, function(skill) {
        return skill.ID == skillToRemove.ID;
      });
    }
    if (area === 'learn') {
      $scope.person.WantedSkills = _.reject($scope.person.WantedSkills, function(skill) {
        return skill.ID == skillToRemove.ID;
      });
    }
  };

  $scope.removeskill = function(skillToRemove, area) {
    $scope.removeskillFromArea(skillToRemove, area);
  };

  $scope.save = function() {
    PersonService.save($scope.person).then(function(response) {
      $scope.person = response.data;
      $state.go('home');
    }, function(response) {
      ngToast.warning('Kunde inte spara ' + $scope.person.Name);
    });
  };
});
