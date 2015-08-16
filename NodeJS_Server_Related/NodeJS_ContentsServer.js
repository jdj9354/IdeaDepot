const webPreviewRootFolder = "WebPreviewImages";
const contentsRootFolder = "ContentsFiles";
const noImageFileName = "noImage.png"

var CC = require('../Common/Constants/ContentsConstants');
var TMC = require('../Common/Constants/ThinkMineConstants');

var http = require('http');
var express = require('express');
var Pageres = require('pageres');
var fs = require('fs');
var app = express();


app.use(express.static(__dirname));
app.use(function(request, response,next) {
	var CT = request.param(CC.REQ_PARAM_ENUM.CT);
	switch(CT){
	case CC.CONTENTS_TYPE_ENUM.Image :
	case CC.CONTENTS_TYPE_ENUM.Movie :
	case CC.CONTENTS_TYPE_ENUM.Sound :
		break;
	case CC.CONTENTS_TYPE_ENUM.WebPreview :
		var url = request.param(CC.REQ_PARAM_ENUM.WP_URL);
		var resolution = request.param(CC.REQ_PARAM_ENUM.WP_RESOLUTION);
		var userId = request.param(CC.REQ_PARAM_ENUM.UI);
		
		console.log(url+resolution);
		
		runPageRessAndReply(url,resolution,userId,response);
		break;
	}

});

app.use('/upload',function(request, response,next) {
	fs.readFile(req.files.contentsFile.path, function(error,data){
		var userId = request.param(CC.REQ_PARAM_ENUM.UI);
		var contentsType  = request.param(CC.REQ_PARAM_ENUM.CT);
		var contentsFolder = "im";
		switch(contentsType){
		case CC.CONTENTS_TYPE_ENUM.Image:
			contentsFolder = "im";
			break;
		case CC.CONTENTS_TYPE_ENUM.Movie:
			contentsFolder = "mv";
			break;
		case CC.CONTENTS_TYPE_ENUM.Sound:
			contentsFolder = "snd";
			break;
		}
		
		var filePath = __dirname+"/"+contentsRootFolder+"/"+userId+"/"+contentsFolder;
		fs.writeFile(filePath, data,function(error){
			if(error){
				throw err;
			}
			else {
				;
			}			
		});
	});
});

http.createServer(app).listen(TMC.CONTENTS_SERVER_PORT,function() {
	console.log('Contents Server is Running at http://127.0.0.1:53374');
});

function runPageRessAndReply(url, resolution, userId,responseObj){	
	var pageres = new Pageres({delay:2})
					.src(url,[resolution],{crop:false})
					.dest(__dirname+"/"+webPreviewRootFolder+"/"+userId);	

	pageres.run(function(err,items){
		if(err){
			fs.readFile(__dirname+"/"+webPreviewRootFolder+"/"+userId+"/"+noImageFileName,function(err,data){
				responseObj.writeHead(200, {'Content-Type' : 'image/png'});
				responseObj.end(data);
			});
			console.log("Error while loading Web Preview Image");
			return;	
		}				
		fs.readFile(__dirname+"/"+webPreviewRootFolder+"/"+userId+"/"+items[0].filename,function(err,data){
			responseObj.writeHead(200, {'Content-Type' : 'image/png'});
			responseObj.end(data);
		});
	});
	
	/*pageres.on('warn',function(err){
		fs.readFile(__dirname+"/"+webPreviewRootFolder+"/"+noImageFileName,function(err,data){
			responseObj.writeHead(200, {'Content-Type' : 'image/png'});
			responseObj.end(data);
		});
		throw err;	
	});*/
};


