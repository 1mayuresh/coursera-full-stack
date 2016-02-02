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

    $scope.reservation = {};

    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveform = modal;
    });

    $scope.closeReserve = function () {
        $scope.reserveform.hide();
    };

    $scope.reserve = function () {
        $scope.reserveform.show();
    };

    $scope.doReserve = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a reserve delay. Remove this and replace with your reserve
        // code
        $timeout(function () {
            $scope.closeReserve();
        }, 1000);
    };
});

/**
 * MenuController
 */
app.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
    'use strict';

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtObj = {category: ""};
    $scope.showMenu = false;
    $scope.message = 'Loading...';

    $scope.addFavorite = function(index) {
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
    };


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
app.controller('ContactController', ['$scope',  function ($scope) {
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
app.controller('DishDetailController', ['$scope', '$stateParams', '$ionicPopover', '$ionicModal', 'menuFactory', 'favoriteFactory', 'baseURL', function ($scope, $stateParams, $ionicPopover, $ionicModal, menuFactory, favoriteFactory, baseURL) {
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

    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.commentModal = modal;
    });

    $scope.showPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

    $scope.addFavorite = function(index) {
        favoriteFactory.addToFavorites(index);
        $scope.popover.hide();
    };

    $scope.closeCommentModal = function () {
        $scope.commentModal.hide();
    };

    $scope.openCommentModal = function () {
        $scope.commentModal.show();
        $scope.popover.hide();
    };

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
        $scope.comment = angular.copy(blankComment);
        $scope.closeCommentModal();
    };
}]);

/**
 * IndexController
 */
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

app.controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    });

    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = menuFactory.getDishes().query(
        function (response) {
            $scope.dishes = response;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        });

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }
}]
);


app.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }

        return out;
    }
});
