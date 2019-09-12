var express = require('express');
const router = express.Router();

const lib = require("./lib.js");
const argv = require('yargs').argv;
let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //to be input
let units = 'metric';
let weather_url = 'http://api.openweathermap.org/data/2.5/weather?q=';
//let weather_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
let forecast_url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
const weather_request = require('request');
const forecast_request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("GET");
    res.render('index', {'body':'', forecast: ''});
   });

/* POST result page - weather now*/   
router.post('/weather', function(req, res, next){
    console.log("POST");
    let city = req.body.city;
    url = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    //console.log(url);

    weather_request(url, function (err, response, body) {
        if(err){
        console.log('error:', error);
        } else {
            let weather = JSON.parse(body);
            let country = (weather.sys.country) ? weather.sys.country : '' ;
            let message = `Temperature today is ${weather.main.temp} degrees in
                        ${weather.name}, ${country}!`;
                        
            //console.log(weather);
            console.log(message);

            let comments = "For city "+city+', country '+country;

            res.render('index', {body : weather, message : message});
        }
    });

});

/* POST result page - forecast*/  
router.post('/forecast', function(req, res, next){
    let city = req.body.city;
    url = weather_url + city + "&units=" + units + "&appid=" + apiKey;    
    //console.log(url);

    forecast_request(url, function (err, response, body) {
    if(err){
        console.log('error:', error);
    } else {
        let body = JSON.parse(body);

        var i;
        for (i = 0; i < body.list.length; i++) { 
            let date = lib.DateFormatter(body.list[i].dt);
            let message = `Temperature forecast in 5 day is ${body.list[i].main.temp} degrees in
                    ${body.city.name} at ${date}, ${body.sys.country}!`;
            console.log(message);
        }

        res.render('index', {body : body});
    }
    });

});

module.exports = router;