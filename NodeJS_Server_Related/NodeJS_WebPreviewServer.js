const imageRootFolder = "WebPreviewImages";
const noImageFileName = "noImage.png"

var http = require('http');
var express = require('express');
var Pageres = require('pageres');
var fs = require('fs');
var app = express();


app.use(express.static(__dirname));
app.use(function(request, response,next) {
	var url = request.param('url');
	var resolution = request.param('resolution');
	var userId = request.param('userId');
	
	console.log(url+resolution);
	
	runPageRessAndReply(url,resolution,userId,response);
});

http.createServer(app).listen(52274,function() {
	console.log('Web Preview Server is Running at http://127.0.0.1:52274');
});

function runPageRessAndReply(url, resolution, userId,responseObj){	
	var pageres = new Pageres({delay:2})
					.src(url,[resolution],{crop:true})
					.dest(__dirname+"/"+imageRootFolder+"/"+userId);	

	pageres.run(function(err,items){
		if(err){
			fs.readFile(__dirname+"/"+imageRootFolder+"/"+userId+"/"+noImageFileName,function(err,data){
				responseObj.writeHead(200, {'Content-Type' : 'image/png'});
				responseObj.end(data);
			});
			console.log("Error while loading Web Preview Image");
			return;	
		}				
		fs.readFile(__dirname+"/"+imageRootFolder+"/"+userId+"/"+items[0].filename,function(err,data){
			responseObj.writeHead(200, {'Content-Type' : 'image/png'});
			responseObj.end(data);
		});
	});
	
	/*pageres.on('warn',function(err){
		fs.readFile(__dirname+"/"+imageRootFolder+"/"+noImageFileName,function(err,data){
			responseObj.writeHead(200, {'Content-Type' : 'image/png'});
			responseObj.end(data);
		});
		throw err;	
	});*/
};


