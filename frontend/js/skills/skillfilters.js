'use strict';

angular.module('SkillFilters', [])
.filter('chunk', function() {
  return _.memoize(_.chunk);
  });
