
const lib = require("./lib.js");
const argv = require('yargs').argv;
let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';    //to be hidden
let city = argv.c || 'Hangzhou';
let country = 'China';                              //to be input
let units = 'metric';
let weather_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
let forecast_url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
const weather_request = require('request');
const forecast_request = require('request');

weather_request(weather_url, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body);
      let message = `Temperature today is ${weather.main.temp} degrees in
                 ${weather.name}!`;
      console.log(message);
    }
  });

forecast_request(forecast_url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let forecast = JSON.parse(body);
    var i;
        for (i = 0; i < forecast.list.length; i++) { 
            let date = lib.DateFormatter(forecast.list[i].dt);
            let message = `Temperature forecast in 5 day is ${forecast.list[i].main.temp} degrees in
                    ${forecast.city.name} at ${date}!`;
            console.log(message);
        };
  }
});