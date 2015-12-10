
var app = angular.module('confusionApp', []);

app.controller('menuController', function() {
    'use strict';

    var self = this;
    this.tab = 1;

    this.dishes = [
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

    this.filtText = '';
    this.filtObj = { category: ""};

    this.select = function(tab) {
        this.tab = tab;

        if (tab === 2) {
            this.filtText = "appetizer";
            this.filtObj = { category: "appetizer"};
        } else if (tab === 3) {
            this.filtText = "mains";
            this.filtObj = { category: "mains"};
        } else if (tab === 4) {
            this.filtText = "dessert";
            this.filtObj = { category: "dessert"};
        } else {
            this.filtText = "";
            this.filtObj = { category: ""};
        }
    };

    this.isSelected = function(tab) {
        return this.tab === tab;
    };

});
