angular.module('autocv').service('PeopleService', function peopleService($http, $q) {
  var url = '/api/people/';


  var getPeople = function() {
    return $http.get(url);
  };



  return {
    getPeople: getPeople,
  };
});
