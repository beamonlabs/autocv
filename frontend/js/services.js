angular.module('autocv').service('TagService', function tagService($http, $q) {
    var self = this;
    self.tags = [];
    var url = '/api/tags/';

    self.getTagsDeferred = function() {
    	var deferred = $q.defer();
		$http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {	
                if(data !== null) {
                    self.tags = data;
                }
                deferred.resolve(data);
            }).
            error(function(data, status, headers, config) {
                deferred.reject(status);
            });        
		return deferred.promise;
    };

    self.allTagNames = function() {
        return _.map(self.tags, function(tag) {
        return tag.Name;
        })
    };

    self.filteredTags = function(filter) {
        if(filter.length < 3) {
        return [];
        }
        return _.filter(self.allTagNames(), filter);
    };

    self.tagExists = function(tagName) {
        return _.contains(self.allTagNames(), tagName);
    };

    self.saveIfNew = function(tagName) {
        
        var deferred = $q.defer();
        var tag = { Name: tagName };
        self.getTagsDeferred().then(function() {
            if(!self.tagExists(tagName)) {
                $http.post('/api/tags/', tag)
                    .success(function(msg,code) {
                        self.tags.push(tag);
                })
                .error(function() {
                    deferred.reject(tag, 'Could not save tag');
                })
            };
            deferred.resolve(tag);
        }, function() {
            deferred.reject(tag, 'Could not get list of tags');
        });
        return deferred.promise;
    };
    
    self.getTagsDeferred();
    
    return self;
});
