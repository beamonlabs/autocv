angular.module('autocv').service('PeopleService', function peopleService($http, $q) {
  var self = this;
  var url = '/api/people/';

  self.getPeople = function() {
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

  self.save = function(person) {

    var deferred = $q.defer();
    $http.post(url, person)
      .success(function(msg, code) {
        deferred.resolve(person, 'Save successful');
      })
      .error(function() {
        deferred.reject(person, 'Could not save tag');
      });
    return deferred.promise;
  };

  return self;
});
