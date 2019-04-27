var http = require("http");
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors');
var url = require('url');


var router = express.Router();  

//start body-parser configuration
app.use( bodyParser.json());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({// to support URL-encoded bodies
  extended: true
}));
app.use(cors());
//end body-parser configuration

app.use(express.static("USTCode"));
app.get('/', function (req, res,next) {
  res.redirect('/'); 
 });

http.createServer({

}, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to http://localhost:3000/')
  console.log(process.env.TERM);
})

