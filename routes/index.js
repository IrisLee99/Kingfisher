var express = require('express');
var Promise = require("bluebird");
const router = express.Router();
const lib = require("../lib.js");
const argv = require('yargs').argv;
const Joi = require('@hapi/joi');


let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //TODO: to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //TODO: to be input - done
let units = 'metric';
let weather_url = 'http://api.openweathermap.org/data/2.5/weather?q=';
//let weather_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
let forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?q=';
//let forecast_url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
//const weather_request = require('request');
//const forecast_request = require('request');
var request = Promise.promisifyAll(require("request"), {multiArgs: true});
var urlList = ["", ""];
var datetime = new Date();

const schema = Joi.object().keys({

    // city name must be a valid name string   
    city: Joi.string()
    .pattern(/^[a-zA-Z]{3,35}/).required(),    // TODO: simple validation here: a to z, length 3 to 35
});

/* GET home page. */
//router.get('/', (req, res) => res.send('Hello World!'))

router.get('/', function(req, res, next) {
    console.log("**GET**");
    res.render('index', {'body':'', forecast: ''});
    console.log("date:" + datetime);
    //TODO: wait 10sec for server response
    //res.end();
   });


/* POST result page - weather now*/   
router.post('/weather', function(req, res, next){
    console.log("**POST**");
    let city = req.body.city;
    url1 = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    url2 = forecast_url + city + "&units=" + units + "&appid=" + apiKey;  
    var urlList = [url1, url2];

    Promise.map(urlList, url => {

        const {error} = schema.validate({ city: city});        //simple city input valiation

        if (error) {
            next(error);
          } else {

            let weather = null;
            let forecast = null;

            return request.getAsync(url).spread(function(response,body) {
                if(response.statusCode != 200){
                    throw new Error('error1:', response.statusCode);
                }else {
                    console.log("**respond**");
                    //console.log("body:" +  body);
                    return JSON.parse(body);
                }
            });
        }
            
        }).then(function(results) {

                if (results == undefined) {
                    console.log("results is undefined");
                }else {
                    weather = results[0];
                    forecast = results[1];                

                    if (weather.coord == undefined) {
                        console.log("**RETURN WEATHER BODY EMPTY**");
                        comments = "  " + city + "can't be found. Please input a valid city name";

                        res.render('index', {'body':'', message: comments});     //To do: warning message with red 

                    return;

                    } else {
                        let comments = getWeatherToday(weather);
                        res.render('index', {body : weather, message : comments});
                    }

            
                if (forecast.list == undefined) {
                    console.log("**RETURN FORECAST BODY EMPTY**");
                    comments = " forecast " + city + "can't be found. Please check if API is working";

                    res.render('index', {'body':'', message: comments});     //To do: warning message with red 
                    
                    return;
                
                } else {
                    
                    let comments = get5DayForecast(forecast);
                    res.render('index', {body : forecast, message : comments});
                }

            }
            //res.render('index', {body : weather, message : message});
            //res.render('index', {body : forecast, comments : comments});

            }).catch(function(err) {
                // handle error here
                console.log('error:', err);
            });
        
        
    });

    function getWeatherToday(weather) {
        
            let comments = null;
            //console.log(weather.coord);     //check if undefined
            let country = (weather.sys.country) ? weather.sys.country : '' ;
            let message = ` is ${weather.main.temp} degrees in
                            ${weather.name}, ${country}!`;
                            
            console.log(message);

            comments = "For city "+city+', country '+country;

            //res.render('index', {body : weather, message : message});
            return message;

        }
    

    function get5DayForecast (forecast) {

            var i;
            //let msg = 'Forecast in 5 days: ';
            for (i = 0; i < forecast.list.length; i++) { 
                let date = lib.DateFormatter(forecast.list[i].dt);
                //msg = msg +  `${forecast.list[i].main.temp} degrees in ${forecast.city.name} at ${date}, ${forecast.city.country}!`;               
            }
            //console.log(msg);

            let message =   "  for city "+city+', country '+country;
    
            //res.render('index', {body : forecast, message : message});
            return message;
        }
    



module.exports = router;


//TODO: handle wrong city names: aaa
//TODO: move some functions outside of index.js
//TODO: test with ???
//TODO: packaging?