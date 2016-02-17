angular.module('autocv').service('PeopleService', function peopleService($http, $q) {
  var url = '/api/people/';


  var fixPeople = function(people) {
    _.forEach(people, function(person) {
      if(person.WantedSkills === null) {
        person.WantedSkills = [];
      }
      if(person.TeachingSkills === null) {
        person.TeachingSkills = [];
      }
    });
  }

  var getPeople = function() {
    var deferred = $q.defer();
    $http.get(url).then(function(response) {
      fixPeople(response.data);
      deferred.resolve(response);
    }, function(response) {
      deferred.resolve(response);
    });
    return deferred.promise;
  };

  return {
    getPeople: getPeople,
  };
});
