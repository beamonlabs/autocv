'use strict';

angular.module('autocv')
  .controller('MatchCtrl', function($scope, $http, $state, ngToast, MatchService) {
    $scope.skillsWithTeachers = [];
    $scope.skillsWithoutTeachers = [];

    MatchService.getMatchData()
      .then(
        function(result) {
          $scope.skillsWithTeachers = result.stas;
          $scope.skillsWithoutTeachers = result.sas;
        },
        function(message) {
          ngToast.warning(message);
        });

  });
