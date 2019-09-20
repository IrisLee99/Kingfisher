# Kingfisher
web dev test

entry point: app.js
open libs: node-modules: to use common modules such as "require" 
           yargs: command line interface tool
           express: for frontend html generation
           nodemon: for auto server restart
           babel: new syntax?? a JavaScript compiler!  ref:https://babeljs.io/docs/en/usage
           pug: for html file generation
           bluebird: for multiple requests
           joi: for schema validation
           
3rd party API: openweathermap.org      

Usage:  1. npm start 
        2. browse to http://localhost:3000/
        3. Input any city names and click 


#1. Get Weather by City Name
node index.js -c {city}

example:$node index.js -c Shenzhen
return: Temperature today is 303.22 degrees in
               Shenzhen!


#2. Get Forecast by City Name
node index.js -c {city}

example:$node index.js -c Shenzhen
return: Temperature forecast is 303.22 degrees in
               Shenzhen at 1:00:00(hh:mm:ss)!
