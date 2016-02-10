angular.module('autocv').service('PeopleService', function peopleService($http, $q, TagService) {
  var self = this;
  var url = '/api/people/';

  var migratePerson = function(person) {
    if (typeof(person.Tags) === 'undefined' || person.Tags === null) {
      person.Tags = [];
    }
    if (typeof(person.WantedSkills) === 'undefined' || person.WantedSkills === null || _.indexOf(person.WantedSkills, "") !== -1) {
      person.WantedSkills = [];
    }

    if (typeof(person.TeachingSkills) === 'undefined' || person.TeachingSkills === null || _.indexOf(person.TeachingSkills, "") !== -1) {
      person.TeachingSkills = [];
    }
  };

  var getPerson = function(email) {
    var deferred = $q.defer();

    //check if email is undefined, then just return empty person object
    if (typeof(email) === 'undefined') {
      var person = {
        Tags: [],
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

  var getPeople = function() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: url
    }).
    success(function(data, status, headers, config) {
      if (data !== null) {
        deferred.resolve(data);
      } else {
        deferred.resolve([]);
      }

    }).
    error(function(data, status, headers, config) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  var save = function(person) {

    var deferred = $q.defer();
    $http.post(url, person)
      .success(function(msg, code) {
        deferred.resolve(person, 'Save successful');
      })
      .error(function() {
        deferred.reject(person, 'Could not save Person');
      });
    return deferred.promise;
  };


  return {
    getPerson: getPerson,
    getPeople: getPeople,
    save: save
  };
});
