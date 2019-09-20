const getWeatherToday = function(req, res, next) {
        
    let comments = null;
    //console.log(weather.coord);     //check if undefined
    let country = (weather.sys.country) ? weather.sys.country : '' ;
    let message = ` is ${weather.main.temp} degrees in ${weather.name}, ${country}!`;
                    
    console.log(message);

    comments = "For city "+city+', country '+country;

    //res.render('index', {body : weather, message : message});
    //return message;

}


const get5DayForecast = function (req, res, next) {

    var i;
    //let msg = 'Forecast in 5 days: ';
    for (i = 0; i < forecast.list.length; i++) { 
        let date = lib.DateFormatter(forecast.list[i].dt);
        //msg = msg +  `${forecast.list[i].main.temp} degrees in ${forecast.city.name} at ${date}, ${forecast.city.country}!`;               
    }
    //console.log(msg);

    let message =   "  for city "+city+', country '+country;

    //res.render('index', {body : forecast, message : message});
    //return message;
}

export { getWeatherToday, get5DayForecast };