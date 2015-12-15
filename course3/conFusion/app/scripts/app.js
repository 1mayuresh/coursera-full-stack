
var app = angular.module('confusionApp', []);

app.controller('MenuController', ['$scope', function($scope) {
    'use strict';

    $scope.tab = 1;

    $scope.dishes = [
        {
            name: 'Uthapizza',
            image: 'images/uthapizza.png',
            category: 'mains',
            label: 'Hot',
            price: '4.99',
            description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
            comment: ''
        },
        {
            name: 'Zucchipakoda',
            image: 'images/zucchipakoda.png',
            category: 'appetizer',
            label: '',
            price: '1.99',
            description: 'Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce',
            comment: ''
        },
        {
            name: 'Vadonut',
            image: 'images/vadonut.png',
            category: 'appetizer',
            label: 'New',
            price: '1.99',
            description: 'A quintessential ConFusion experience, is it a vada or is it a donut?',
            comment: ''
        },
        {
            name: 'ElaiCheese Cake',
            image: 'images/elaicheesecake.png',
            category: 'dessert',
            label: '',
            price: '2.99',
            description: 'A delectable, semi-sweet New York Style Cheese Cake, with Graham cracker crust and spiced with Indian cardamoms',
            comment: ''
        }
    ];

    $scope.filtText = '';
    $scope.filtObj = { category: ""};

    $scope.select = function(tab) {
        $scope.tab = tab;

        if (tab === 2) {
            $scope.filtText = "appetizer";
            $scope.filtObj = { category: "appetizer"};
        } else if (tab === 3) {
            $scope.filtText = "mains";
            $scope.filtObj = { category: "mains"};
        } else if (tab === 4) {
            $scope.filtText = "dessert";
            $scope.filtObj = { category: "dessert"};
        } else {
            $scope.filtText = "";
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
