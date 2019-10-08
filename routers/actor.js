const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Actor.find().populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                // console.log(actors[0].movies)
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json({ "msg": "delete actor" });
        });
    },
    deleteOneAndItsMovies: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            for (let i = 0; i < actor.movies.length; i++) {
                Movie.findOneAndRemove({ _id: actor.movies[i] }, function (err, movie) {
                    if (err) return res.status(400).json(err);
                })
            }
            res.json({ "msg": "delete actor and its movies" });
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    removeMovieFromMovies:function(req,res){
        Actor.findById(req.params.actId).exec(function(err,actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            console.log("original:",actor)
            for (let i = 0; i < actor.movies.length; i++) {
               if (actor.movies[i]==req.params.movId){
                   actor.movies.splice(i,1)
               }
            }

            // actor.save(function(err){})

            console.log("new:",actor)
            Actor.findOneAndUpdate({ _id: req.params.actId }, actor,function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
        })
    },
    increateAge:function(req,res){
        let now=new Date();
        let currentYear=(now.getFullYear());

        // res.json({"msg":(currentYear-50)})
        Actor.updateMany({
            "bYear":{
                $lte:currentYear-50
            }
        },{$inc:{
            "bYear":-4
        }},function(err,data){
            res.json(data)
        })
        // Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
        //     if (err) return res.status(400).json(err);
        //     if (!actor) return res.status(404).json();
        //     res.json(actor);
        // });
    }
};