angular.module('autocv').service('SkillService', function skillservice($http, $q) {
  var url = '/api/skills/';

  var getSkills = function() {
    return $http.get(url);
  };

  var saveSkill = function(skill) {
    //Check if exists first, this is requirement for hygiene
    var deferred = $q.defer();
    getSkills().then(
      function(response) {
        var skills = response.data;
        var skillKey = _.toUpper(_.replace(skill.Name, ' ', ''));
        var existingSkill =_.find(skills, function(s) {
            return _.toUpper(_.replace(s.Name, ' ', '')) === skillKey;
        });
        if(typeof(existingSkill) === 'undefined') {
          deferred.resolve($http.post(url, skill));
        } else {
          deferred.resolve( { data:existingSkill });
        }
      }, function(response) {
        deferred.reject(response);
      });
    return deferred.promise;
  };

  return {
    getSkills: getSkills,
    saveSkill: saveSkill
  };

});
