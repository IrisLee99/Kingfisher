
let apiKey = 'a2f4ddd6b316804c8e4ce802525a2d7a';   //to be hidden
let city = 'china';
let units = 'metric';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`

let request = require('request');

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    let message = `Temperature today is ${weather.main.temp} degrees in
               ${weather.name}!`;
    console.log(message);
  }
});