'use strict'

angular.module('autocv').service('PersonService', function peopleService($http, $q) {
  var url = '/api/people/';

var migratePerson = function(person) {
  if(typeof(person.TeachingSkills) === 'undefined' || person.TeachingSkills === null) {
    person.TeachingSkills = [];
  }
  if(typeof(person.WantedSkills) === 'undefined' || person.WantedSkills === null) {
    person.WantedSkills = [];
  }
};

  var getPerson = function(email) {
    var deferred = $q.defer();

    //check if email is undefined, then just return empty person object
    if (typeof(email) === 'undefined') {
      var person = {
        WantedSkills: [],
        TeachingSkills: []
      };
      deferred.resolve(person);
    } else {
      $http.get('api/people/' + email)
        .success(function(data) {
          migratePerson(data);
          deferred.resolve(data);
        }).error(function(msg) {
          deferred.reject('Kunde inte ladda ' + email);
        });
    }
    return deferred.promise;
  };

  var save = function(person) {
    return $http.post(url, person);
  };

return {
  getPerson: getPerson,
  save: save
}

});
