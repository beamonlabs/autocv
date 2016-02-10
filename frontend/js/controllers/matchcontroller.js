'use strict';

angular.module('autocv')
  .controller('MatchCtrl', function($scope, $http, $state, ngToast, MatchService) {
    $scope.tagsWithTeachers = [];
    $scope.tagsWithoutTeachers = [];

    MatchService.getMatchData()
      .then(
        function(result) {
          $scope.tagsWithTeachers = result.stas;
          $scope.tagsWithoutTeachers = result.sas;
        },
        function(message) {
          ngToast.warning(message);
        });

  });
