
const lib = require("./lib.js");
const argv = require('yargs').argv;
let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //to be input
let units = 'metric';
let weather_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
let forecast_url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&unites=${units}&appid=${apiKey}`;
const request = require('request');

request(forecast_url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let forecast = JSON.parse(body);
    let date = lib.DateFormatter(forecast.list[0].dt);
    let message = `Temperature forecast is ${forecast.list[0].main.temp} degrees in
               ${forecast.city.name} at ${date}!`;
    console.log(message);
  }
});

/*request(weather_url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    let message = `Temperature today is ${weather.main.temp} degrees in
               ${weather.name}!`;
    console.log(message);
  }
});*/