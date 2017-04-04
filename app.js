
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var util = require('util');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var app = express();

//Put your skyscanner api key here
const apiKey = "sa959583952162241927741272970024";

var baseURI = 'http://partners.api.skyscanner.net/apiservices/'; 
var browse_pricing = baseURI + 'pricing/v1.0';
var browse_reference = baseURI + 'reference/v1.0';

app.get('/getPrice/:pickupplace/:dropoffplace/:pickupdate/:pickuptime/:driverage', function (req, res) {
	console.log("Inside getPrice: ");
	var params = req.params;
	console.log("params: "+JSON.stringify(params));
	var market = (params.country) ? params.country : 'UK';
	console.log("market: "+market);
	var currency = (params.currency) ? params.currency : 'GBP';
	console.log("currency: "+currency);
	var locale = (params.language) ? params.language : 'en-GB';
	console.log("locale: "+locale);
	var pickupplace = params.pickupplace;
	console.log("pickupplace: "+pickupplace);
	var dropoffplace = params.dropoffplace;
	console.log("dropoffplace: "+dropoffplace);
	var pickupdate = params.pickupdate;
	console.log("pickupdate: "+pickupdate);
	var pickuptime = params.pickuptime;
	console.log("pickuptime: "+pickuptime);
	var pickupdatetime = pickupdate+"T"+pickuptime;
	console.log("pickupdatetime: "+pickupdatetime);
	var ip = "127.0.0.1";
	/*var dropoffdatetime = req.param("dropoffdatetime");
	console.log("dropoffdatetime: "+dropoffdatetime);*/
	var driverage = params.driverage;
	console.log("driverage: "+driverage);
	
	var body;
	var browse_reference_url = util.format(
			browse_reference+'/locales?apiKey=%s',
            apiKey);
	
	var browse_pricing_url = util.format(
			browse_pricing+'/US/USD/en-US/'+'%s/%s/%s/%s?apiKey=%s',
            encodeURIComponent(pickupplace),
            encodeURIComponent(dropoffplace),
            encodeURIComponent(pickupdatetime),
            encodeURIComponent(driverage),
            apiKey);
	
	
	var req = http.get(browse_pricing_url, function(res) {
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
