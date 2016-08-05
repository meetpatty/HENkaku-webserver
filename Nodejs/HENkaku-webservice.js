// include the http module
var express = require('express');
var app = express();
var request = require("request");
var http = require("http");
fs = require('fs');

var offsets = {};
var base_payload = null;

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
		fs.writeFile("payload.js", body, function(err) {
			if(err) {
				return console.log(err);
			}
		});
	});
}

if (!fs.existsSync('base_payload.bin') || !fs.existsSync('offsets.txt')) {
	console.log('Base payload not found, creating');
	
	CreateBasePayload();
}

var payload1;

function CreateBasePayload() {
	
	var payload1, payload2;
	
	http.get('http://go.henkaku.xyz/x?a1=89d02000&a2=81b00240&a3=e0002190&a4=811c08d0&&a5=e062d200&a6=e0603470&a7=e0022cf0&', function(res) {
		var data = [];
		
		res.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			payload1 = Buffer.concat(data);	
			
			http.get('http://go.henkaku.xyz/x?a1=89f02000&a2=81a00060&a3=e0008820&a4=81140190&&a5=e064c2c0&a6=e0603a00&a7=e004cda0&', function(res) {
				var data = [];
				res.on('data', function(chunk) {
					data.push(chunk);
				}).on('end', function() {
					payload2 = Buffer.concat(data);
					
					var request1Addresses = [0x89d02000, 0x81b00240, 0xe0002190, 0x811c08d0, 0xe062d200, 0xe0603470, 0xe0022cf0]
					var request2Addresses = [0x89f02000, 0x81a00060, 0xe0008820, 0x81140190, 0xe064c2c0, 0xe0603a00, 0xe004cda0];
					var addressDifferences = new Uint32Array(7);
					
					for (i = 0; i < 7; i++) {
						if (request1Addresses[i] > request2Addresses[i])
							addressDifferences[i] = (request1Addresses[i] - request2Addresses[i]);
						else
							addressDifferences[i] = (request2Addresses[i] - request1Addresses[i]);
					}
					
					var offsetOutput = "";
					
					for (i = 0; i < payload1.length; i+=4) {
						
						var int1 = payload1.readUInt32LE(i);
						var int2 = payload2.readUInt32LE(i);
						
						var diff = 0;
						
						if (int1 > int2)
						{
							diff = int1 - int2;
						}
						else if (int2 > int1)
						{
							diff = int2 - int1;
						}
						
						if (diff != 0) {
							
							var addressNum = 0;
							
							if (diff == addressDifferences[1])
								addressNum = 1;
							else if (diff == addressDifferences[2])
								addressNum = 2;
							else if (diff == addressDifferences[3])
								addressNum = 3;
							else if (diff == addressDifferences[4])
								addressNum = 4;
							else if (diff == addressDifferences[5])
								addressNum = 5;
							else if (diff == addressDifferences[6])
								addressNum = 6;
							
							offsetOutput +=  i.toString(16) + ':' + addressNum + "\r\n";

							offsets[i] = addressNum;
						}
					}
					
					fs.writeFile("offsets.txt", offsetOutput, function(err) {
						if(err) {
							return console.log(err);
						}
					});
					
					//Create base payload					
					base_payload = new Buffer(payload1.length);
					
					for (i = 0; i < payload1.length; i+=4) {
						
						var payloadData = payload1.readUInt32LE(i);
						
						if (offsets.hasOwnProperty(i))
						{
							var baseAddress = 0;
							
							var offset = offsets[i];
							baseAddress = payloadData - request1Addresses[offset];
							base_payload.writeUInt32LE(baseAddress, i);
						}
						else 
						{
							base_payload.writeUInt32LE(payloadData, i);
						}
					}
					
					fs.writeFile("base_payload.bin", base_payload, "binary", function(err) {
						if(err) {
							return console.log(err);
						}
					});
					
					console.log("Successfully created base payload")
				});
			});
		});
	});			
}

app.get('/index.html', function (req, res) {
   fs.readFile("index.html", 'utf8', function (err, data) {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
   });
})

app.get('/payload.js', function (req, res) {
   fs.readFile("payload.js", 'utf8', function (err, data) {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
   });
})

app.get('/x?*', function (req, res) {
	
	if (base_payload == null) {

		fs.readFileSync("base_payload.bin", function (err, data) {
			if (err) throw err;
			base_payload = data;
		});
		
		fs.readFileSync("offsets.txt", 'utf8', function (err, data) {
			if (err) throw err;
			var parts = data.split("\r\n");
			for (i = 0; i < parts.length; i++) 
			{
				if (parts[i] == '')
					break;
				var offsetParts = parts[i].split(":");
				var offset = parseInt(offsetParts[0],16);
				offsets[offset] = parseInt(offsetParts[1]);
			}
		});
	}
   
	var newPayload = new Buffer(base_payload.length);
	var addresses = [0, 0, 0, 0, 0, 0, 0];
		
	var requestParts = req.url.split("&");
	
	for (i = 0; i < requestParts.length; i++)
	{
		var part = requestParts[i];
		
		if (requestParts[i] == '')
			continue;
		
		var regex = /a(\d)=(.*)/;
		var match = part.match(regex);
		if (match != null)
		{
			var addressNum = parseInt(match[1]);
			var address = parseInt(match[2], 16);
			addresses[addressNum-1] = address;
		}	
	}
	
	for (i = 0; i < base_payload.length; i += 4)
	{
		var data = base_payload.readUInt32LE(i);
		
		if (i == 0)
		{
		console.log(data);
		console.log(offsets[i]);
		}

		if (offsets.hasOwnProperty(i))
		{
			var newValue = 0;

			switch (offsets[i])
			{
				case 0:
					newValue = addresses[0] + data;
					break;
				case 1:
					newValue = addresses[1] + data;
					break;
				case 2:
					newValue = addresses[2] + data;
					break;
				case 3:
					newValue = addresses[3] + data;
					break;
				case 4:
					newValue = addresses[4] + data;
					break;
				case 5:
					newValue = addresses[5] + data;
					break;
				case 6:
					newValue = addresses[6] + data;
					break;
			}

			newPayload.writeUInt32LE(newValue, i);
		}
		else
		{
			newPayload.writeUInt32LE(data, i);
		}
	}
	
	res.writeHead(200, {'Content-Type': 'application/octet-stream'});
	res.end(newPayload);
	
	
})

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Henkaku local service listening on http://%s:%s", host, port)
})





