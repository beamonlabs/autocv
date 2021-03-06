'use strict';

angular.module('autocv').controller('ListPeopleCtrl',
  function($scope, $http, $state, ngToast, PeopleService) {
    $scope.people = [];

    PeopleService.getPeople()
      .then(function(response) {
        $scope.people = response.data;
      }, function(response) {
        ngToast.warning('Could not load folks :' + response.status);
      });

    $scope.deletePerson = function(email) {
      $http.delete('/api/people/' + email).success(function(data) {}).error(function(msg, code) {
        console.log(msg);
      });
    };

    $scope.editPerson = function(email) {
      $state.go("edit", {
        "email": email
      });
    };
  });
