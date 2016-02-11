angular.module('autocv').service('SkillServiceOld', function skillservice($http, $q) {
  var self = this;
  self.skills = [];
  var url = '/api/skills/';

  self.getskills = function() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: url
    }).
    success(function(data, status, headers, config) {
      if (data !== null) {
        self.skills = data;
      }
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  self.allskillNames = function() {
    return _.map(self.skills, function(skill) {
      return skill.Name;
    });
  };

  self.skillExists = function(skillName) {
    return _.some(self.allskillNames(), skillName);
  };

  self.saveskill = function(skill) {
    var deferred = $q.defer();
    self.getskills().then(function() {

      $http.post('/api/skills/', skill)
        .success(function(msg, code) {
          self.skills.push(skill);
        })
        .error(function() {
          deferred.reject('Could not save skill ' + skill.Name);
        });
      deferred.resolve(skill);
    }, function() {
      deferred.reject('Could not get list of skills');
    });
    return deferred.promise;
  };

  self.save = function(skillName, area) {

    var deferred = $q.defer();
    var skill = {
      Name: skillName
    };

    self.getskills().then(function() {
      if (!self.skillExists(skillName)) {
        $http.post('/api/skills/', skill)
          .success(function(msg, code) {
            self.skills.push(skill);
          })
          .error(function() {
            deferred.reject('Could not save skill ' + skill.Name);
          });
      }
      deferred.resolve(skill);
    }, function() {
      deferred.reject(skill, 'Could not get list of skills ' + skill.Name);
    });
    return deferred.promise;
  };

  self.getskills();

  return self;
});
