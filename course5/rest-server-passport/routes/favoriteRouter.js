var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._doc._id })
            .populate('user dishes.dish')
            .exec(function(err, favorite) {
                if (err) throw err;
                res.json(favorite[0] && favorite[0].dishes ? favorite[0].dishes : []);
            });
    })

    .post(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._doc._id })
            .populate('user dishes')
            .exec(function(err, favorite) {
                if (err) { throw err; }

                var addDish = function(favorite) {
                    var alreadyIncluded = false;
                    console.log("Dishes");
                    console.log(favorite.dishes);
                    if (!favorite.dishes) {
                        console.log('No dishes');
                        return;
                    }

                    for (var i=0; i < favorite.dishes.length; i++) {
                        if (favorite.dishes[i]._id == req.body._id) {
                            console.log("Dish already included");
                            return;
                        }
                    }

                    req.body.dish = req.body._id;
                    favorite.dishes.push(req.body);
                    favorite.save(function (err, favorite) {
                        if (err) throw err;
                        console.log('Updated dishes!');
                    });

                    var response = { status: "Added favorite with id: " + req.body._id };
                    res.json(response);
                };

                if (favorite.length == 0) {
                    req.body.user = req.decoded._doc._id;
                    Favorites.create(req.body, function(err, favorite) {
                        if (err) throw err;
                        console.log('Favorite created!');
                        addDish(favorite);
                    });
                } else {
                    addDish(favorite[0]);
                }
            });
    })

    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._doc._id })
            .remove({}, function(err, resp) {
                if(err) throw err;
                res.json(resp);
            });
    });

favoriteRouter.route('/:dishId')

    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._doc._id })
            .populate('user dishes.dish')
            .exec(function(err, favorite) {
                if (err) throw err;

                console.log("Dishes");
                console.log(favorite.dishes);
                if (!favorite[0] || !favorite[0].dishes) {
                    res.json({status: "No favorites available"});
                    return;
                }

                var dishId = req.params.dishId;
                var deleted = false;

                for (var i=0; i < favorite[0].dishes.length; i++) {
                    if (favorite[0].dishes[i]._id == dishId) {
                        favorite[0].dishes.splice(i, 1);
                        favorite[0].save(function (err, favorite) {
                            if (err) throw err;
                            console.log('Deleted dish!');
                        });
                        deleted = true;
                    }
                }

                res.json(deleted ?
                    {status: "deleted dish from favorites: " + dishId } :
                    {status: "favorite dish not found with id " + dishId}
                );
            });
    });

module.exports = favoriteRouter;
