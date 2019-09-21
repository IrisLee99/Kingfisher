var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"), {multiArgs: true});
const lib = require("../lib.js");

const asyncGetWeather = async function(urlList, city) {

    console.log("/*In SERVICE*/");
    console.log("urlList: " + urlList[0]);
    console.log("urlList: " + urlList[1]);

    Promise.map(urlList, url => {

        return request.getAsync(url).spread(function(response,body) {
            if(response.statusCode != 200){
                next;
                //throw new Error('error1:', response.statusCode);
            }else {
                console.log("**respond**");
                console.log("body:" +  body);
                return JSON.parse(body);
            }
        });
            
    }).then(function(results) {
        console.log("**IN THEN**:" + results[0]);
        return results;    

        }).catch(function(err) {
            // handle error here
            console.log('error:', err);
        });
}

function  getWeatherToday (weather, city) {
    let comments = null;
    //console.log(weather.coord);     //check if undefined
    let country = (weather.sys.country) ? weather.sys.country : '' ;
    let message = ` is ${weather.main.temp} degrees in ${weather.name}, ${country}!`;
                    
    console.log(message);

    comments = "For city "+city+', country '+country;

    console.log("weather message: " + message);
    return message;
}


function get5DayForecast (forecast, city) {
    var i;
    //let msg = 'Forecast in 5 days: ';
    for (i = 0; i < forecast.list.length; i++) { 
        let date = lib.DateFormatter(forecast.list[i].dt);
        //msg = msg +  `${forecast.list[i].main.temp} degrees in ${forecast.city.name} at ${date}, ${forecast.city.country}!`;               
    }
        
    let country = (forecast.city.country ) ? forecast.city.country  : '' ;    
    let message =   "  for city "+city+', country '+country;

        console.log("forecast message: " + message);
        return message;
}

export{ asyncGetWeather, getWeatherToday, get5DayForecast };