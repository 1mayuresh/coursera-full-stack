
var app = angular.module('confusionApp');

/**
 * MenuController
 */
app.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
    'use strict';

    $scope.tab = 1;
    $scope.filtObj = { category: ""};
    $scope.showMenu = false;
    $scope.message = 'Loading...';

    $scope.dishes = menuFactory.getDishes().query(
        function(response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $scope.showMenu = false;
        }
    );

    $scope.select = function(tab) {
        $scope.tab = tab;

        if (tab === 2) {
            // we only want to filter the category, so use an object instead of filtText
            $scope.filtObj = { category: "appetizer" };
        } else if (tab === 3) {
            $scope.filtObj = { category: "mains" };
        } else if (tab === 4) {
            $scope.filtObj = { category: "dessert" };
        } else {
            $scope.filtObj = { category: "" };
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

/**
 * ContactController
 */
app.controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    $scope.channels = [
        {
            value:"tel",
            label:"Tel."
        },
        {
            value:"Email",
            label:"Email"
        }
    ];
    $scope.invalidChannelSelection = false;
}]);

/**
 * FeedbackController
 */
app.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
    var blankFeedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    $scope.sendFeedback = function() {
        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect feedback');
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.sendFeedback($scope.feedback);
            $scope.feedback = angular.copy(blankFeedback);
            $scope.feedbackForm.$setPristine();
        }
    };
}]);

/**
 * DishDetailController
 */
app.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
    $scope.showDish = false;
    $scope.message = 'Loading ...';

    $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
        .$promise.then(
            function(response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $scope.showDish = false;
            }
        );
}]);

/**
 * DishCommentController
 */
app.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
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
        menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
        $scope.commentModal.$setPristine();
        $scope.comment = angular.copy(blankComment);
    };
}]);

/**
 * IndexController
 */
app.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
    $scope.showDish = false;
    $scope.showPromotion = false;
    $scope.showLeader = false;
    $scope.messageDish = 'Loading ...';
    $scope.messagePromotion = 'Loading ...';
    $scope.messageLeader = 'Loading ...';

    $scope.featuredDish = menuFactory.getDishes().get({id: 0})
        .$promise.then(
            function(response) {
                $scope.featuredDish = response;
                $scope.showDish = true;
            },
            function(response) {
                $scope.messageDish = "Error: " + response.status + " " + response.statusText;
                $scope.showDish = false;
            }
        );

    $scope.promotion = menuFactory.getPromotions().get({id: 0})
        .$promise.then(
            function(response) {
                $scope.promotion = response;
                $scope.showPromotion = true;
            },
            function(response) {
                $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
                $scope.showPromotion = false;
            }
        );

    $scope.leader = corporateFactory.getLeaders().get({id: 3})
        .$promise.then(
            function(response) {
                $scope.leader = response;
                $scope.showLeader = true;
            },
            function(response) {
                $scope.messageLeader = "Error: " + response.status + " " + response.statusText;
                $scope.showLeader = false;
            }
        );
}]);

/**
 * AboutController
 */
app.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
    $scope.showLeaders = false;

    $scope.leaders = corporateFactory.getLeaders().query(
        function(response) {
            $scope.leaders = response;
            $scope.showLeaders = true;
        },
        function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $scope.showLeaders = false;
        }
    );
}]);
