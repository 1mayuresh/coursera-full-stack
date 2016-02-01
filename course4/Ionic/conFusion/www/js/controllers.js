var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
});


/**
 * MenuController
 */
app.controller('MenuController', ['$scope', 'menuFactory', 'baseURL', function ($scope, menuFactory, baseURL) {
    'use strict';

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtObj = {category: ""};
    $scope.showMenu = false;
    $scope.message = 'Loading...';

    $scope.dishes = menuFactory.getDishes().query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $scope.showMenu = false;
        }
    );

    $scope.select = function (tab) {
        $scope.tab = tab;

        if (tab === 2) {
            // we only want to filter the category, so use an object instead of filtText
            $scope.filtObj = {category: "appetizer"};
        } else if (tab === 3) {
            $scope.filtObj = {category: "mains"};
        } else if (tab === 4) {
            $scope.filtObj = {category: "dessert"};
        } else {
            $scope.filtObj = {category: ""};
        }
    };

    $scope.isSelected = function (tab) {
        return $scope.tab === tab;
    };

    $scope.showDetails = false;

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
}]);

/**
 * ContactController
 */
app.controller('ContactController', ['$scope', function ($scope) {
    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    $scope.channels = [
        {
            value: "tel",
            label: "Tel."
        },
        {
            value: "Email",
            label: "Email"
        }
    ];
    $scope.invalidChannelSelection = false;
}]);

/**
 * FeedbackController
 */
app.controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {
    var blankFeedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    $scope.sendFeedback = function () {
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
app.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function ($scope, $stateParams, menuFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = 'Loading ...';

    $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $scope.showDish = false;
            }
        );
}]);

/**
 * DishCommentController
 */
app.controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {
    var blankComment = {
        rating: 5,
        comment: "",
        author: "",
        date: ""
    };

    $scope.comment = angular.copy(blankComment);

    $scope.submitComment = function () {
        $scope.comment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.comment);
        menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
        $scope.commentForm.$setPristine();
        $scope.comment = angular.copy(blankComment);
    };
}]);


app.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({id:3});
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = menuFactory.getDishes().get({id:0})
        .$promise.then(
            function(response){
                $scope.dish = response;
                $scope.showDish = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    $scope.promotion = menuFactory.getPromotion().get({id:0});
}]);

/**
 * IndexController
 */
/*
app.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, $baseURL) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.showPromotion = false;
    $scope.showLeader = false;
    $scope.message = 'Loading ...';
    $scope.messagePromotion = 'Loading ...';
    $scope.messageLeader = 'Loading ...';

    $scope.dish = menuFactory.getDishes().get({id: 0})
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $scope.showDish = false;
            }
        );

    $scope.promotion = menuFactory.getPromotions().get({id: 0})
        .$promise.then(
            function (response) {
                $scope.promotion = response;
                $scope.showPromotion = true;
            },
            function (response) {
                $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
                $scope.showPromotion = false;
            }
        );

    $scope.leader = corporateFactory.getLeaders().get({id: 3})
        .$promise.then(
            function (response) {
                $scope.leader = response;
                $scope.showLeader = true;
            },
            function (response) {
                $scope.messageLeader = "Error: " + response.status + " " + response.statusText;
                $scope.showLeader = false;
            }
        );
}]);
*/
/**
 * AboutController
 */
app.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.showLeaders = false;

    $scope.leaders = corporateFactory.query(
        function (response) {
            $scope.leaders = response;
            $scope.showLeaders = true;
        },
        function (response) {
            $scope.message = "Could not load data (error " + response.status + " " + response.statusText + ")";
            $scope.showLeaders = false;
        }
    );
}]);
