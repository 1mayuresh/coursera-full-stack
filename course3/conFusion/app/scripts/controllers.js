
var app = angular.module('confusionApp');

app.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
    'use strict';

    $scope.tab = 1;
    $scope.dishes = menuFactory.getDishes();
    $scope.filtObj = { category: ""};

    $scope.select = function(tab) {
        $scope.tab = tab;

        if (tab === 2) {
            $scope.filtObj = { category: "appetizer"};
        } else if (tab === 3) {
            $scope.filtObj = { category: "mains"};
        } else if (tab === 4) {
            $scope.filtObj = { category: "dessert"};
        } else {
            $scope.filtObj = { category: ""};
        }
    };

    $scope.isSelected = function(tab) {
        return $scope.tab === tab;
    };

    $scope.showDetails = false;

    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };
}]);

app.controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    $scope.channels = [{ value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
    $scope.invalidChannelSelection = false;
}]);

app.controller('FeedbackController', ['$scope', function($scope) {
    $scope.sendFeedback = function() {
        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                agree:false, email:"" };
            $scope.feedback.mychannel="";

            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}]);

app.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
    $scope.dish = menuFactory.getDish(parseInt($stateParams.id, 10));
}]);

app.controller('DishCommentController', ['$scope', function($scope) {
    var blankComment = {
        rating: 5,
        comment:"",
        author: "",
        date: ""
    };

    $scope.comment = angular.copy(blankComment);

    $scope.submitComment = function () {
        $scope.comment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.comment);
        $scope.commentForm.$setPristine();
        $scope.comment = angular.copy(blankComment);
    };
}]);
