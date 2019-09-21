import { asyncGetWeather, getWeatherToday, get5DayForecast } from '../services/service.js';
const argv = require('yargs').argv;
const Joi = require('@hapi/joi');
var express = require('express');

const apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //TODO: to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //TODO: to be input - done
let units = 'metric';
let weather_url = 'http://api.openweathermap.org/data/2.5/weather?q=';
let forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?q=';

var urlList = ["", ""];
var datetime = new Date();

const schema = Joi.object().keys({

    // city name must be a valid name string   
    city: Joi.string()
    .pattern(/^[a-zA-Z]{3,35}/).required(),    // TODO: simple validation here: a to z, length 3 to 35 - done
});

/* POST result page - weather and forecast*/   
const getBoth = function(req, res, next){

    console.log("**POST BOTH**");
    const city = req.body.city;
    console.log("city: " + city);

    let url1 = weather_url + city + "&units=" + units + "&appid=" + apiKey;   
    let url2 = forecast_url + city + "&units=" + units + "&appid=" + apiKey;  

    var urlList = [url1, url2];

    const {error} = schema.validate({ city: city});        //simple city input valiation

        if (error) {
            next(error);
        } else {

            let results = asyncGetWeather(urlList, city);    //calling service

            if (results == undefined) {
                console.log("results is undefined");
            }else {
                let weather = results[0];
                let forecast = results[1];    
                let comments = '';            

                console.log("weather:" + weather);
                console.log("forecast:" + forecast);

                if (weather == undefined || weather.coord == undefined) {
                    console.log("**RETURN WEATHER BODY EMPTY**");
                    comments = "  " + city + " can't be found. Please input a valid city name";
                   res.render('../views/index', {body:'', message: comments});     //To do: warning message with red 

                } else {
                    comments = getWeatherToday(weather, city);
                    console.log("JSON.body for weather: \r\n" 
                                + JSON.stringify(weather));           
                    res.render('../views/index', {body : weather, message : comments});
                }

            
                if (forecast == undefined || forecast.list == undefined) {
                    console.log("**RETURN FORECAST BODY EMPTY**");
                    comments = " forecast " + city + " can't be found. Please check if API is working";
                    res.render('../views/index', {body:'', message: comments});     //To do: warning message with red 
                } else {
                    comments = get5DayForecast(forecast, city);
                    console.log("JSON.body for forecast: \r\n" 
                                + JSON.stringify(forecast));
                    res.render('../views/index', {body : forecast, message : comments});
                }
            }

        }
    }
    

export {getBoth, schema, city};