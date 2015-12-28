var app = angular.module('confusionApp');

app.constant('baseURL', 'http://localhost:3000/');

/**
 * Menu Factorys
 */
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

/**
 * Corporate Factory
 */
app.factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    var corporateFactory = {};

    corporateFactory.getLeaders = function() {
        return $resource(baseURL + 'leadership/:id');
    };

    return corporateFactory;
}]);

/**
 * Feedback Factory
 */
app.factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    var feedbackFactory = {};

    feedbackFactory.sendFeedback = function(feedback) {
        return $resource(baseURL + 'feedback').save(feedback);
    };

    return feedbackFactory;
}]);
