var express = require('express');
var Promise = require("bluebird");
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
//const weather_request = require('request');
//const forecast_request = require('request');
var request = Promise.promisifyAll(require("request"), {multiArgs: true});
var urlList = ["", ""];


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("**GET**");
    res.render('index', {'body':'', forecast: ''});
   });


/* POST result page - weather now*/   
router.post('/weather', function(req, res, next){
    console.log("**POST**");
    let city = req.body.city;
    url1 = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    url2 = forecast_url + city + "&units=" + units + "&appid=" + apiKey;  
    var urlList = [url1, url2];

    Promise.map(urlList, function(url) {

        return request.getAsync(url).spread(function(response,body) {
            if(response.statusCode != 200){
                throw new Error('error1:', response.statusCode);
            }else {

                console.log("**respond**");
                console.log(body);
                return JSON.parse(body);

            }

        });
    }).then(function(results) {

        let weather = results[0];
        let forecast = results[1];

        if (weather.coord == undefined) {
            console.log("**RETURN WEATHER BODY EMPTY**");
            comments = "  " + city + "can't be found. Please input a valid city name";

            res.render('index', {'body':'', message: comments});     //To do: warning message with red 

            return;

        } else {
            console.log("got weather");
            let msg = getWeatherToday(weather);
            res.render('index', {body : weather, message : msg});
        }

        if (forecast.list == undefined) {
            console.log("**RETURN FORECAST BODY EMPTY**");
            comments = " forecast " + city + "can't be found. Please check if API is working";

            res.render('index', {'body':'', message: comments});     //To do: warning message with red 
            
        } else {
            console.log("got forecast");
            let msg = get5DayForecast(forecast);
            
            res.render('index', {body : forecast, message : msg});
        }

        //res.render('index', {body : weather, message : message});
        //res.render('index', {body : forecast, comments : comments});

    }).catch(function(err) {
        // handle error here
        console.log('error:', err);
    });



    function getWeatherToday(weather) {
        
            let comments = null;
            //console.log(weather.coord);     //check if undefined
            let country = (weather.sys.country) ? weather.sys.country : '' ;
            let message = ` is ${weather.main.temp} degrees in
                            ${weather.name}, ${country}!`;
                            
            console.log(weather);
            console.log(message);

            comments = "For city "+city+', country '+country;

            //res.render('index', {body : weather, message : message});
            return message;

        }
    

    function get5DayForecast (forecast) {

            var i;
            for (i = 0; i < forecast.list.length; i++) { 
                let date = lib.DateFormatter(forecast.list[i].dt);
                let message = `Forecast in 5 day is ${forecast.list[i].main.temp} degrees in
                        ${forecast.city.name} at ${date}, ${forecast.city.country}!`;
                console.log(message);
            }

            let message = "For city "+city+', country '+country;
    
            //res.render('index', {body : forecast, message : message});
            return message;
        }
    

});

module.exports = router;