var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find().populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json({ "msg": "movie removed" });
        });
    },
    deleteAllBeforeAYear:function (req, res) {//need change to make it works
        Movie.deleteMany({year:{$lt:req.params.year}},function(err){
            if (err) return res.status(400).json(err);
            res.json({ "msg": "movie removed" });
        })
    },
    removeActorFromActors: function (req, res) {
        Movie.findById(req.params.movId).exec(function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            console.log("original:", movie)
            for (let i = 0; i < movie.actors.length; i++) {
                if (movie.actors[i] == req.params.actId) {
                    movie.actors.splice(i, 1)
                }
            }

            console.log("new:", movie)
            Movie.findOneAndUpdate({ _id: req.params.movId }, movie, function (err, newMovie) {
                if (err) return res.status(400).json(err);
                if (!newMovie) return res.status(404).json();
                res.json(newMovie);
            });
        })
    },
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    getBetweenYear1AndYear2: function (req, res) {
        // console.log(req.params)
        Movie.find({
            $and: [
                { year: { $lte: req.params.year1 } },
                { year: { $gte: req.params.year2 } }]
        }).populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            // console.log(movies)

            res.json(movies);
        });
    }
};