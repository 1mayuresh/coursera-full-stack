var app = angular.module('confusionApp');

app.constant('baseURL', 'http://localhost:3000/');

app.service('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    'use strict';

    this.getDishes = function() {
        return $resource(baseURL + 'dishes/:id', null, {
            'update': {
                method: 'PUT'
            }
        });
    };

    this.getPromotions = function() {
        return $resource(baseURL + 'promotions/:id');
    };
}]);

app.factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    var corpfac = {};

    corpfac.getLeaders = function() {
        return $resource(baseURL + 'leadership/:id');
    };

    return corpfac;
}]);

app.factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    var feedbackFactory = {};

    feedbackFactory.sendFeedback = function() {
        return $resource(baseURL + 'feedback');
    };

    return feedbackFactory;
}])
