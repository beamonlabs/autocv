var autocv = angular.module('autocv', ['ui.router','ngToast']);

autocv.factory('tagService',['$http', function($http) {
  var instance = {};
  instance.tags = [];

  $http.get('/api/tags/').success(function(data) {
    instance.tags = data;
  }).error(function(msg, code) {
    alert('error getting tags');
  });

  instance.allTagNames = function() {
    return _.map(instance.tags, function(tag) {
      return tag.Name;
    })
  };

  instance.filteredTags = function(filter) {
    if(filter.length < 3) {
      return [];
    }
    return _.filter(instance.allTagNames(), filter);
  };

  instance.tagExists = function(tagName) {
    return _.contains(instance.allTagNames(), tagName);
  };

  instance.saveIfNew = function(tagName, success) {
    var tag = { Name: tagName };
    if(!instance.tagExists(tagName)) {
      $http.post('/api/tags/', tag)
      .success(function(msg,code) {
          instance.tags.push(tag);
        if(success !== 'undefined') {
          success(tagName);
        }
      })
      .error(function(msg, code) {
        alert('couldnt save tag');
      })
    };
    return tag;
  }

  return instance;
}]);
