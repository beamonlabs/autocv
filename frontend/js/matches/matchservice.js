angular.module('autocv').service('MatchService', function matchService($http, $q, PeopleService) {
  var peopleUrl = '/api/people/';
  var skillUrl = '/api/skills/';



  var findTeachersWithskill = function(people, id) {
    var teachers = _.filter(people, function(person) {
      return _.some(person.TeachingSkills, function(skill) {
        return skill.ID === id;
      });
    });
    return teachers;
  };

  var findPeopleWantingskill = function(people, id) {
    var students = _.filter(people, function(person) {
      return _.some(person.WantedSkills, function(skill) {
        return skill.ID === id;
      });
    });
    return students;
  };

  var skillsWithTeachers = function(people) {
    var skills = _.uniq(_.flatten(_.map(people, 'TeachingSkills')));
    return skills;
  };

  var skillsThatNeedTeachers = function(people) {
    var skills = _.uniq(_.flatten(_.map(people, 'WantedSkills')));
    return skills;
  };

  var skillsThatLackTeachers = function(people) {
    var diff = _.differenceWith(skillsThatNeedTeachers(people), skillsWithTeachers(people), function(need, has) {
      return need !== null && has !== null && need.ID === has.ID;
    });
    return diff;
  };

  var mapSkillsTeachersAndStudents = function(people) {
    var stas = _.map(skillsWithTeachers(people), function(skill) {
      if (skill !== null) {
        var map = {
          skill: skill,
          teachers: findTeachersWithskill(people, skill.ID),
          students: findPeopleWantingskill(people, skill.ID)
        };
        return map;
      }
    });
    return stas;
  };

  var mapSkillsAndStudents = function(people) {
    var stas = _.map(skillsThatLackTeachers(people), function(skill) {
      if (skill !== null) {
      var map = {
          skill: skill,
          students: findPeopleWantingskill(people, skill.ID)
        };
        return map;
      }
    });
    return stas;
  };

  var getMatchData = function() {
    var deferred = $q.defer();

    PeopleService.getPeople()
      .then(function(response) {
        var people = response.data;
        var result = {
          stas: mapSkillsTeachersAndStudents(people),
          sas: mapSkillsAndStudents(people)
        };
        deferred.resolve(result);
      }, function(response) {
        deferred.reject('Kunde inte ladda och matcha kompetenser!');
      });

    return deferred.promise;
  };

  return {
    getMatchData: getMatchData,
    findTeachersWithskill: findTeachersWithskill,
    findPeopleWantingskill: findPeopleWantingskill
  };
});
