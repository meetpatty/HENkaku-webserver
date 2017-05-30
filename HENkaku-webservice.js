var express = require('express');
var app = express();
var request = require("request");
var http = require("http");
fs = require('fs');

var base_payload = null;
var henkakuUrlPayloadString = "1886680168,1747922746,1634430565,2016310635,1731164793,1701326703,1801546606,1768042101,110,0,";	  
var localUrl = ""; //Add local address here, must be 39 or less characters in the form http://<ipaddress>/henkaku.bin eg http://192.168.1.1/henkaku.bin
var newPayloadUrlStr = "";

//Create replacement url string for payload
if (localUrl.length > 0 && localUrl.length < 40)
{
	var newUrlBytes = new Buffer(40);

	for (i = 0; i < 40; i++)
	{
		if (i < localUrl.length)
		{
			newUrlBytes[i] = localUrl.charCodeAt(i);
		}
		else
		{
			newUrlBytes[i] = 0;
		}
	}

	for (i = 0; i < 40; i+=4)
	{
		newPayloadUrlStr += newUrlBytes.readUInt32LE(i) + ",";
	}
}

//Check for existence of index.html
if (!fs.existsSync('index.html')) {
	
	console.log('index.html not found, creating');
    var options = {
		url: 'http://go.henkaku.xyz',
		headers: {
			'User-Agent': 'playstation vita 3.60'
		}
	};

	request(options, function(error, response, body) {
		fs.writeFile("index.html", body, function(err) {
			if(err) {
				return console.log(err);
			}
		});
	});
}

//Check for existence of index.html
if (!fs.existsSync('payload.js')) {
	
	console.log('payload.js not found, creating');
    var options = {
		url: 'http://go.henkaku.xyz/payload.js',
		headers: {
			'User-Agent': 'playstation vita 3.60'
		}
	};

	request(options, function(error, response, body) {
		fs.writeFile("base_payload.js", body, function(err) {
			if(err) {
				return console.log(err);
			}
		});
		
		if (newPayloadUrlStr.length > 0)
		{
			fs.writeFile("payload.js", body.replace(henkakuUrlPayloadString, newPayloadUrlStr), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		
		}
		else
		{
			fs.writeFile("payload.js", body, function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	});
}

//Check for existence of index.html
if (!fs.existsSync('henkaku.bin')) {
	
	console.log('henkaku.bin not found, creating');
    var options = {
		url: 'http://go.henkaku.xyz/henkaku.bin',
		headers: {
			'User-Agent': 'playstation vita 3.60',
		},
		encoding: null
	};

	request(options, function(error, response, body) {
		fs.writeFile("henkaku.bin", body, "binary", function(err) {
			if(err) {
				return console.log(err);
			}
		});
	});
}

app.get('/', function (req, res) {
	console.log("index.html requested");
   fs.readFile("index.html", 'utf8', function (err, data) {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
   });
})

app.get('/payload.js', function (req, res) {
	console.log("payload.js requested");
   fs.readFile("payload.js", 'utf8', function (err, data) {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
   });
})

app.get('/henkaku.bin', function (req, res) {
	console.log("henkaku.bin requested");
   fs.readFile("henkaku.bin", 'binary', function (err, data) {
       res.writeHead(200, {'Content-Type': 'application/octet-stream'});
       res.end(data, 'binary');
   });
})

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Henkaku local service listening on http://%s:%s", host, port)
})