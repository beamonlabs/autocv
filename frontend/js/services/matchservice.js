angular.module('autocv').service('MatchService', function matchService($http, $q, PeopleService, TagService) {
  var self = this;
  var peopleUrl = '/api/people/';
  var tagUrl = '/api/tags/';

  self.people = [];

  // TagService.getTags().then(function(data) {
  //   self.tags = data;
  // }, function(status) {
  //   //Wut?
  // });

  self.findTeachersWithTag = function(tagName) {
    var teachers = _.filter(self.people, function(person) {
      return _.some(person.TeachingSkills, function(tag) {
        return tag.Name === tagName;
      });
    });
    return teachers;
  };

  self.findPeopleWantingTag = function(tagName) {
    var students = _.filter(self.people, function(person) {
      return _.some(person.WantedSkills, function(tag) {
        return tag.Name === tagName;
      });
    });
    return students;
  };

  self.tagsWithTeachers = function() {
    var tags = _.uniq(_.flatten(_.map(self.people, 'TeachingSkills')));
    return tags;
  };

  self.tagsThatNeedTeachers = function() {
    var tags = _.uniq(_.flatten(_.map(self.people, 'WantedSkills')));
    return tags;
  };

  self.tagsThatLackTeachers = function() {
    var diff = _.differenceWith(self.tagsThatNeedTeachers(), self.tagsWithTeachers(), function(need, has) {
      return need.Name === has.Name;
    });
    return diff;
  };

  self.mapSkillsTeachersAndStudents = function() {
    var stas = _.map(self.tagsWithTeachers(), function(tag) {
      var map = {
        tag: tag.Name,
        teachers: self.findTeachersWithTag(tag.Name),
        students: self.findPeopleWantingTag(tag.Name)
      };
      return map;
    });
    return stas;
  };

  self.mapSkillsAndStudents = function() {
    var stas = _.map(self.tagsThatLackTeachers(), function(tag) {
      var map = {
        tag: tag.Name,
        students: self.findPeopleWantingTag(tag.Name)
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
    findTeachersWithTag: self.findTeachersWithTag,
    findPeopleWantingTag: self.findPeopleWantingTag
  };
});
