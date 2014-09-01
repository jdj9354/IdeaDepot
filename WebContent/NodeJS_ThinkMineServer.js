const CODE_MIND_ADD = 32;
const CODE_MIND_DEL = 33;
const CODE_MIND_MOVE = 34;
const CODE_MIND_PUT_INTO = 35;
const CODE_MIND_PULL_OUT = "MPO";
const CODE_MIND_CONNECT_TO = 37;
const CODE_MIND_DISCONNECT_FROM = 38;
const CODE_MIND_CHANGE_COLOR_OF_CONTENTS = 39;
const CODE_MIND_CHANGE_VALUE_OF_CONTENTS = 40;
const CODE_MIND_CHANGE_CONTENTS = "MCC";
const CODE_MIND_CHANGE_COLOR_OF_SHAPE = 42;
const CODE_MIND_CHANGE_SHAPE = "MCS";
const CODE_MIND_CHANGE_PARENT_MINDMAP = "MCPMM";
const CODE_MIND_MAP_REQUEST_MIND_INFO = 65;

const SocketCommuDelimiter = "\\";
const Nested_SocketCommuDelimiter_1 = ",";
const Nested_SocketCommuDelimiter_2 = "/";
const Nested_SocketCommuDelimiter_3 = ".";


const DB_HELPER_JS_NAME = "ThinkMineDBHelper.js";
const THINK_MINE_MAIN_PAGE_NAME = "ThinkMine_MainPage_DEV.html";
const THINK_MINE_MIND_MAP_PAGE_NAME = "ThinkMine_MindMapPage_DEV.html";


var http = require('http');

var fs = require('fs');
var socketio = require('socket.io');

var childProcessModule = require('child_process');

var dbHelperProcess = childProcessModule.fork(__dirname + '/'+DB_HELPER_JS_NAME);


var express = require('express');
var app = express();
app.use(express.static(__dirname+'/js'));
app.use(express.static(__dirname+'/res'));
app.use(express.static(__dirname));
app.use(express.static(__dirname+'/res_usr'));
app.use(function (request,response) {
	fs.readFile(__dirname + '/'+THINK_MINE_MIND_MAP_PAGE_NAME, function (error,data){
		response.writeHead(200,{'Content-Type' : 'text/html'});
		response.end(data);
	});
});


var socketio = require('socket.io');

var server = http.createServer(app);
server.listen(52273,function(){
	console.log("Server running at http://127.0.0.1:52273");	

	

	
});




var io = socketio.listen(server,{log:false});
io.set('log level',1);

var dbCallBackFunction = null;


dbCallBackFunction = function(m){	
	if(m.reply == null){
		console.log("Couldn't find....DB Query is NULL");
		return;
	}
	if(m.reply.retObject.Code == undefined){
		console.log("DB Query Result is wrong");
		return;
	}
	else{
		switch(m.reply.retObject.Code){
		case CODE_MIND_MAP_REQUEST_MIND_INFO :
			console.log("ccccc");
			io.sockets.sockets[m.replyRequestSocketId].emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_ADD :			
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_MOVE :
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_PUT_INTO :
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS :
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		default :
			break;
		}
		
	}
	//console.log("ParentProcess");
	//console.log(m);
	return;
};

dbHelperProcess.on('message',dbCallBackFunction);


io.sockets.on('connection', function (socket){
	
	var count = 0 ;
	socket.on('NewEvent',function(data){
		//	NewEvent에 대한 처리
		//var InfoString = data.toString();
		//console.log(data.Code);
		var OpCode =  data.Code;
		switch (OpCode){
		case CODE_MIND_MAP_REQUEST_MIND_INFO :		
			//Test Code
			
			var message = {
				requestSocketId : socket.id,
				operationType : 0,
				collectionName : "mindmap",
				info : data,				
			};
			
			dbHelperProcess.send(message);			

			break;
		
		case CODE_MIND_ADD :
		
			
			var message = {
				requestSocketId : socket.id,
				operationType : 1,
				collectionName : "mindobject",
				info : data
			};
			
			dbHelperProcess.send(message);
			
			

			
			break;
			
		
		case CODE_MIND_DEL :
			
			var message = {
				requestSocketId : socket.id,
				operationType : 2,
				collectionName : "mindobject",
				info : data
			};
			
			dbHelperProcess.send(message);
			
			io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_MOVE :
			
			var message = {
				requestSocketId : socket.id,
				operationType : 3,
				collectionName : "mindobject",
				info : data
			};
		
			dbHelperProcess.send(message);			
			
			break;
		case CODE_MIND_PUT_INTO :
			
			var message = {
				requestSocketId : socket.id,
				operationType : 3,
				collectionName : "mindobject",
				info : data		
			}
			
			dbHelperProcess.send(message);			
			break;
		
		case CODE_MIND_CONNECT_TO :
			
			var message = {
				requestSocketId : socket.id,
				operationType : 1,
				collectionName : "edge",
				info : data
			};
			
			dbHelperProcess.send(message);
			
			io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_DISCONNECT_FROM :
			var message = {
				requestSocketId : socket.id,
				operationType : 2,
				collectionName : "edge",
				info : data
			};
			
			dbHelperProcess.send(message);
			
			io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_CHANGE_COLOR_OF_CONTENTS :
			io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
			var message = {
				requestSocketId : socket.id,
				operationType : 3,
				collectionName : "contents",
				info : data
			};
			
			dbHelperProcess.send(message);
			//io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE:
			io.sockets.emit('NewEvent',data);
			break;
		default :
			break;
		}
	});
});


/*
var server = http.createServer(function (request,response){
	fs.readFile(__dirname + '/../ThinkMineMain.html', function (error,data){
		response.writeHead(200,{'Content-Type' : 'text/html'});
		response.end(data);
	});
}).listen(52273,function(){
	console.log("Server running at http://127.0.0.1:52273");
});
*/

var totalCount = 0;




