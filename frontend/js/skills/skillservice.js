angular.module('autocv').service('SkillService', function skillService($http, $q) {
  var url = '/api/skills/';

  var getSkills = function() {
    return $http.get(url);
  };

  var getSkillsWithWikiInfo = function() {
    var deferred = $q.defer();
    $http.get(url).then(function(response) {
      var skills = response.data;
      _.forEach(skills, function(skill) {
        WikipediaService.get(skill.Name)
        .then(function(desc) {
          skill.Description = desc;
        }, function(response) {
          //We don't care if wikipedia doesn't answer...
        })
      });
      deferred.resolve(skills);
    }, deferred.reject);
    return deferred.promise;
  };

  var addSkill = function(skill) {
    //Check if exists first, this is requirement for hygiene
    var deferred = $q.defer();
    getSkills().then(
      function(response) {
        var skills = response.data;
        var skillKey = _.toUpper(_.replace(skill.Name, ' ', ''));
        var existingSkill = _.find(skills, function(s) {
          return _.toUpper(_.replace(s.Name, ' ', '')) === skillKey;
        });
        if (typeof(existingSkill) === 'undefined') {
          deferred.resolve($http.post(url, skill));
        } else {
          deferred.resolve({
            data: existingSkill
          });
        }
      },
      function(response) {
        deferred.reject(response);
      });
    return deferred.promise;
  };

  var saveSkill = function(skill) {
    var deferred = $q.defer();
    if (typeof(skill.ID) === 'undefined' || skill.ID === null || skill.ID === 0) {
      deferred.reject({
        message: 'kan inte spara'
      });
    }
    deferred.resolve($http.post(url, skill));
    return deferred.promise;
  };

  return {
    getSkills: getSkills,
    addSkill: addSkill,
    saveSkill: saveSkill,
    getWikiSkills: getSkillsWithWikiInfo
  };

});
