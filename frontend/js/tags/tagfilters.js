'use strict';

angular.module('tagfilters', [])
.filter('chunk', function() {
  return _.memoize(_.chunk);
  });
