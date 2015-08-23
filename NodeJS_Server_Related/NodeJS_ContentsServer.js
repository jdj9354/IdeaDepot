const webPreviewRootFolder = "WebPreviewImages";
const contentsRootFolder = "ContentsFiles";
const noImageFileName = "noImage.png"

var CC = require('../Common/Constants/ContentsConstants');
var TMC = require('../Common/Constants/ThinkMineConstants');

var http = require('http');
var express = require('express');
var Pageres = require('pageres');
var fs = require('fs');
var path = require('path');
var app = express();

fs.mkdirParent = function(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      fs.mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};


function getListOfFiles(dir){
	var files = fs.readdirSync(dir)
				  .map(function(v) { 
					  return { name:v,
							   time:fs.statSync(dir + v).mtime.getTime()
							 }; 
				   })
				   .sort(function(a, b) { return a.time - b.time; })
				   .map(function(v) { return v.name; });			  
	return files;
}
			  

function mkdir(path, root) {

    var dirs = path.split('/'), dir = dirs.shift(), root = (root || '') + dir + '/';

    try { fs.mkdirSync(root); }
    catch (e) {
        //dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length || mkdir(dirs.join('/'), root);
}

app.use(express.static(__dirname));
app.use(express.bodyParser());
app.use('/webpreview',function(request, response,next) {	
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
	fs.readFile(request.files.contentsFile.path, function(error,data){
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
		console.log(request.files.contentsFile.name);
		var dirPath = __dirname+"/"+contentsRootFolder+"/"+userId+"/"+contentsFolder;
		var filePath = __dirname+"/"+contentsRootFolder+"/"+userId+"/"+contentsFolder+"/"+request.files.contentsFile.name;		
		mkdir(dirPath);		
		fs.writeFile(filePath, data,function(error){
			if(error){
				throw error;
			}
			else {
				response.send('File uploaded to: ' + filePath + ' - ' + request.files.contentsFile.size + ' bytes');
			}			
		});
		
	});
});
app.use('/list',function(request, response,next) {	
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
	case CC.CONTENTS_TYPE_ENUM.WebPreview:
		return;
		break;
	}	
	var dirPath = __dirname+"/"+contentsRootFolder+"/"+userId+"/"+contentsFolder+"/";	
	var fileList = getListOfFiles(dirPath);		
	var reponseString = "";
	for(var i=0; i<fileList.length; i++)
		reponseString += (fileList[i] + "\n");
	response.send(reponseString);
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


