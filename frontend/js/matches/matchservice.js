angular.module('autocv').service('MatchService', function matchService($http, $q, PeopleService, skillservice) {
  var self = this;
  var peopleUrl = '/api/people/';
  var skillUrl = '/api/skills/';

  self.people = [];

  self.findTeachersWithskill = function(skillName) {
    var teachers = _.filter(self.people, function(person) {
      return _.some(person.TeachingSkills, function(skill) {
        return skill.Name === skillName;
      });
    });
    return teachers;
  };

  self.findPeopleWantingskill = function(skillName) {
    var students = _.filter(self.people, function(person) {
      return _.some(person.WantedSkills, function(skill) {
        return skill.Name === skillName;
      });
    });
    return students;
  };

  self.skillsWithTeachers = function() {
    var skills = _.uniq(_.flatten(_.map(self.people, 'TeachingSkills')));
    return skills;
  };

  self.skillsThatNeedTeachers = function() {
    var skills = _.uniq(_.flatten(_.map(self.people, 'WantedSkills')));
    return skills;
  };

  self.skillsThatLackTeachers = function() {
    var diff = _.differenceWith(self.skillsThatNeedTeachers(), self.skillsWithTeachers(), function(need, has) {
      return need.Name === has.Name;
    });
    return diff;
  };

  self.mapSkillsTeachersAndStudents = function() {
    var stas = _.map(self.skillsWithTeachers(), function(skill) {
      var map = {
        skill: skill.Name,
        teachers: self.findTeachersWithskill(skill.Name),
        students: self.findPeopleWantingskill(skill.Name)
      };
      return map;
    });
    return stas;
  };

  self.mapSkillsAndStudents = function() {
    var stas = _.map(self.skillsThatLackTeachers(), function(skill) {
      var map = {
        skill: skill.Name,
        students: self.findPeopleWantingskill(skill.Name)
      };
      return map;
    });
    return stas;
  };

  self.getMatchData = function() {
    var deferred = $q.defer();
    PeopleService.getPeople().then(function(data) {
      self.people = data;
      var result = {
        stas: self.mapSkillsTeachersAndStudents(),
        sas: self.mapSkillsAndStudents()
      };
      deferred.resolve(result);
    }, function(status) {
      deferred.reject('Kunde inte ladda och matcha kompetenser!');
    });

    return deferred.promise;
  };

  return {
    getMatchData: self.getMatchData,
    findTeachersWithskill: self.findTeachersWithskill,
    findPeopleWantingskill: self.findPeopleWantingskill
  };
});
