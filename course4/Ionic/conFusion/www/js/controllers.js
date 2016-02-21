var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');

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
        $localStorage.storeObject('userinfo', $scope.loginData);

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

    $scope.registration = {};

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };

    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();
        };

        var pickerOptions = {
            maximumImagesCount: 10,
            width: 100,
            height: 100,
            quality: 80
        };

        $scope.loadPictures = function() {
            $cordovaImagePicker.getPictures(pickerOptions)
                .then(function (results) {
                    if (results.length > 0) {
                        $scope.registration.imgSrc = results[0];
                    }
                }, function (error) {
                    // error getting photos
                });
        }
    });
});

/**
 * MenuController
 */
app.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    'use strict';

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    // we only want to filter the category, so use an object instead of filtText
    $scope.filtObj = { category: "" };

    $scope.addFavorite = function(index) {
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dishes[index].name
            }).then(
                function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                }
            );

            $cordovaToast
                .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });
        });
    };

    $scope.dishes = dishes;

    $scope.select = function (tab) {
        $scope.tab = tab;

        if (tab === 2) {

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
app.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.baseURL = baseURL;
    $scope.dish = dish;

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

        $ionicPlatform.ready(function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            }).then(
                function () {
                    console.log('Added Favorite ' + $scope.dish.name);
                },
                function () {
                    console.log('Failed to add Notification ');
                }
            );

            $cordovaToast
                .show('Added Favorite ' + $scope.dish.name, 'long', 'center')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });
        });
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
        menuFactory.update({id: $scope.dish.id}, $scope.dish);
        $scope.commentForm.$setPristine();
        $scope.comment = angular.copy(blankComment);
        $scope.closeCommentModal();
    };
}]);

/**
 * IndexController
 */
app.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL', function($scope, dish, promotion, leader, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;
    $scope.dish = dish;
    $scope.promotion = promotion;
}]);

/**
 * AboutController
 */
app.controller('AboutController', ['$scope', 'leaders', 'baseURL', function ($scope, leaders, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = leaders;
}]);

/**
 * FavoritesController
 */
app.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicPlatform, $cordovaVibration) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    $scope.dishes = dishes;
    $scope.favorites = favorites;

    // As the view and the controller are cached by Ionic automatically
    // we must ensure manually that the favorites are updated every time
    // the template is rendered
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.favorites = favoriteFactory.getFavorites();
    });

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (result) {
            if (result) {
                favoriteFactory.deleteFromFavorites(index);
                $scope.favorites = favoriteFactory.getFavorites();
                $ionicPlatform.ready(function() {
                    $cordovaVibration.vibrate(100);
                });
            }
        });

        $scope.shouldShowDelete = false;
    };
}]);

/**
 * Filters dishes according to the id's given in the favorites array.
 */
app.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id) {
                    out.push(dishes[j]);
                }
            }
        }

        return out;
    }
});
