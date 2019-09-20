import { getBoth } from '../controllers/weatherController.js';

var express = require('express');
var Promise = require("bluebird");
const router = express.Router();

var datetime = new Date();

/* GET home page. */
//router.get('/', (req, res) => res.send('Hello World!'))

router.get('/', function(req, res, next) {
    console.log("**GET**");
    res.render('index', {'body':'', forecast: ''});
    console.log("date:" + datetime);           //TODO: wait 10sec for server response
    //res.end();
   });


module.exports = router;

router.post('/weather' ,getBoth );

//TODO: handle wrong city names: aaa   
//TODO: move some functions outside of index.js
//TODO: test with ???
//TODO: packaging?