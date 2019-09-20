import { getWeatherToday, get5DayForecast } from '../controllers/weatherController.js';

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
let forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?q=';

var request = Promise.promisifyAll(require("request"), {multiArgs: true});
var urlList = ["", ""];
var datetime = new Date();

const schema = Joi.object().keys({

    // city name must be a valid name string   
    city: Joi.string()
    .pattern(/^[a-zA-Z]{3,35}/).required(),    // TODO: simple validation here: a to z, length 3 to 35 - done
});

/* GET home page. */
//router.get('/', (req, res) => res.send('Hello World!'))

router.get('/', function(req, res, next) {
    console.log("**GET**");
    res.render('index', {'body':'', forecast: ''});
    console.log("date:" + datetime);           //TODO: wait 10sec for server response
    //res.end();
   });


/* POST result page - weather now*/   
router.post('/weather', function(req, res, next){
    console.log("**POST**");

    let city = req.body.city;
    console.log("city: " + city);

    let url1 = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    let url2 = forecast_url + city + "&units=" + units + "&appid=" + apiKey;  

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
                    let weather = results[0];
                    let forecast = results[1];                

                    if (weather == undefined || weather.coord == undefined) {
                        console.log("**RETURN WEATHER BODY EMPTY**");
                        comments = "  " + city + "can't be found. Please input a valid city name";

                        res.render('index', {'body':'', message: comments});     //To do: warning message with red 

                    return;

                    } else {
                        let comments = getWeatherToday;
                        res.render('index', {body : weather, message : comments});
                    }

            
                if (forecast.list == undefined) {
                    console.log("**RETURN FORECAST BODY EMPTY**");
                    comments = " forecast " + city + "can't be found. Please check if API is working";

                    res.render('index', {'body':'', message: comments});     //To do: warning message with red 
                    
                    return;
                
                } else {
                    
                    let comments = get5DayForecast;
                    res.render('index', {body : forecast, message : comments});
                }

            }

            }).catch(function(err) {
                // handle error here
                console.log('error:', err);
            });
        
        
    });

module.exports = router;


//TODO: handle wrong city names: aaa
//TODO: move some functions outside of index.js
//TODO: test with ???
//TODO: packaging?