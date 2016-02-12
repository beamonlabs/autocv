'use strict';

var autocv = angular.module('autocv', ['ui.router', 'ngToast', 'SkillFilters'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "js/people/peoplelist.html",
        controller: "ListPeopleCtrl"
      })
      .state('edit', {
        url: "/edit/:email",
        templateUrl: "js/person/editperson.html",
        controller: "EditPersonCtrl"
      })
      .state('add', {
        url: "/add",
        templateUrl: "js/person/editperson.html",
        controller: "EditPersonCtrl"
      })
      .state('skills', {
        url: "/skills",
        templateUrl: "js/skills/skillList.html",
        controller: "skillsCtrl"
      })
      .state('match', {
        url: "/match",
        templateUrl: "js/matches/match.html",
        controller: "MatchCtrl"
      });
  });
