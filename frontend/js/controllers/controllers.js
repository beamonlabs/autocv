'use strict';

angular.module('autocv').controller('PeopleCtrl',
  function($scope, $http, $state, ngToast, PeopleService) {
    $scope.people = [];

    PeopleService.getPeople()
      .then(function(data) {
        $scope.people = data;
      }, function(status) {
        ngToast.warning('Could not load folks :' + status);
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
  })

.controller('TagsCtrl', function($scope, $http, $state, TagService) {
  $scope.tags = [];
});
