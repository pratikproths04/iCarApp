
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var app = express();

//Put your skyscanner api key here
var api_key = "sa959583952162241927741272970024";

var baseURI = 'http://partners.api.skyscanner.net/apiservices/carhire/'; 
var browse = baseURI + 'liveprices/v2/';

app.get('/getPrice', function (req, res) {
	var market = (req.param("country")) ? req.param("country") : 'US';
	console.log("market: "+market);
	var currency = (req.param("currency")) ? req.param("currency") : 'USD';
	console.log("currency: "+currency);
	var locale = (req.param("language")) ? req.param("language") : 'en-us';
	console.log("locale: "+locale);
	var pickupplace = (req.param("pickupplace"));
	console.log("pickupplace: "+pickupplace);
	var dropoffplace = req.param("dropoffplace");
	console.log("dropoffplace: "+dropoffplace);
	var pickupdate = req.param("pickupdate");
	console.log("pickupdate: "+pickupdate);
	var pickuptime = req.param("pickuptime");
	console.log("pickuptime: "+pickuptime);
	var pickupdatetime = pickupdate+"T"+pickuptime;
	console.log("pickupdatetime: "+pickupdatetime);
	/*var dropoffdatetime = req.param("dropoffdatetime");
	console.log("dropoffdatetime: "+dropoffdatetime);*/
	var driverage = req.param("driverage");
	console.log("driverage: "+driverage);
	
	var options = {
	  host: browse,
	  path: '/'+market+'/'+currency+'/'+locale+'/'+pickupplace+'/'
	  		+dropoffplace+'/'+pickupdatetime+'/'+driverage+'/'+api_key 
	};
	var body;
	var req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
		console.log('chunk: ' + chunk);
	    bodyChunks.push(chunk);
	  }).on('end', function() {
		console.log('bodyChunks: ' + bodyChunks);
	    body = Buffer.concat(bodyChunks);
	    console.log('BODY: ' + body);
	    // ...and/or process the entire body here.
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
	
	if(body!= null)
    	res.send({status: "success", "data":body});
    res.send({status: "fail", "data":body});
	
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// development only
if (app.get('env') === 'development') {
	  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
