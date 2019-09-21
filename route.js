import { getBoth, city } from './controllers/weatherController.js';

var express = require('express');
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

router.post('/weather',getBoth );

module.exports = router;
//TODO: handle wrong city names: aaa   
//TODO: move some functions outside of index.js - done
//TODO: test with: mocha + chai
//TODO: packaging?  - skip
//TODO: put param city in URL 