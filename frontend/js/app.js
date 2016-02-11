'use strict';

var autocv = angular.module('autocv', ['ui.router', 'ngToast', 'SkillFilters'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "templates/peoplelist.html",
        controller: "ListPeopleCtrl"
      })
      .state('edit', {
        url: "/edit/:email",
        templateUrl: "templates/editperson.html",
        controller: "EditPersonCtrl"
      })
      .state('add', {
        url: "/add",
        templateUrl: "templates/editperson.html",
        controller: "EditPersonCtrl"
      })
      .state('skills', {
        url: "/skills",
        templateUrl: "templates/skillList.html",
        controller: "skillsCtrl"
      })
      .state('match', {
        url: "/match",
        templateUrl: "templates/match.html",
        controller: "MatchCtrl"
      });
  });
