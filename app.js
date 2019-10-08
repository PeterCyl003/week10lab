const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routers/actor');
const movies = require('./routers/movie');
const path=require("path");

const app = express();
app.use("/",express.static(path.join(__dirname,"dist/actorsDBSystem")));

app.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});
//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/age', actors.increateAge);
app.put('/actors/:id', actors.updateOne);
app.put('/actores/:actId/:movId', actors.removeMovieFromMovies);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
app.delete('/actors/deleteItsMovies/:id', actors.deleteOneAndItsMovies);
//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.get('/movies/:year1/:year2', movies.getBetweenYear1AndYear2);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:movId/:actId', movies.removeActorFromActors);
app.delete('/movies/:id', movies.deleteOne);
app.delete('/moviesY/:year', movies.deleteAllBeforeAYear);
app.post('/movies/:id/actors', movies.addActor);