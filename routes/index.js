var express = require('express');
const router = express.Router();

const lib = require("../lib.js");
const argv = require('yargs').argv;
let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //To do: to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //To do: to be input - done
let units = 'metric';
let weather_url = 'http://api.openweathermap.org/data/2.5/weather?q=';
//let weather_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
let forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?q=';
//let forecast_url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
const weather_request = require('request');
const forecast_request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("**GET**");
    res.render('index', {'body':'', forecast: ''});
   });

/* POST result page - weather now*/   
router.post('/weather', function(req, res, next){
    console.log("**POST**");
    let city = req.body.city;
    url = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    //console.log(url);

    console.log("**REQUEST1**");
    weather_request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            let weather = JSON.parse(body);
            let comments = null;

            //console.log(weather.coord);     //check if undefined

            if (weather.coord == undefined) {
                console.log("**RETURN BODY EMPTY**");
                comments = "  " + city + "can't be found. Please input a valid city name";

                res.render('index', {'body':'', message: comments});     //To do: warning message with red 

            } else {
                let country = (weather.sys.country) ? weather.sys.country : '' ;
                let message = ` is ${weather.main.temp} degrees in
                            ${weather.name}, ${country}!`;
                            
                console.log(weather);
                console.log(message);

                comments = "For city "+city+', country '+country;

                res.render('index', {body : weather, message : message});
            }

        }
    });

    /*url = forecast_url + city + "&units=" + units + "&appid=" + apiKey;   
    forecast_request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            let forecast = JSON.parse(body);
            console.log(forecast); 

            var i;
            for (i = 0; i < forecast.list.length; i++) { 
                let date = lib.DateFormatter(forecast.list[i].dt);
                let message = `Forecast in 5 day is ${forecast.list[i].main.temp} degrees in
                        ${forecast.city.name} at ${date}, ${forecast.city.country}!`;
                console.log(message);
            }

            let comments = "For city "+city+', country '+country;
    
            res.render('index', {body : forecast, comments : comments});
        }
    });*/

});

/* POST result page - forecast*/  
router.post('/weather', function(req, res, next){
    let city = req.body.city;
    url = forecast_url + city + "&units=" + units + "&appid=" + apiKey;   

    forecast_request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            let forecast = JSON.parse(body);
            console.log(forecast); 

            var i;
            for (i = 0; i < forecast.list.length; i++) { 
                let date = lib.DateFormatter(forecast.list[i].dt);
                let message = `Forecast in 5 day is ${forecast.list[i].main.temp} degrees in
                        ${forecast.city.name} at ${date}, ${forecast.city.country}!`;
                console.log(message);
                console.log(forecast.city.coord.lon);
            }

            let comments = "For city "+city+', country '+country;
    
            res.render('index', {body : forecast, comments : comments});
        }
    });

});

module.exports = router;