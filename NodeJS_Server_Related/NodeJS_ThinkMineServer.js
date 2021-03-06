/*const CODE_MIND_ADD = 32;
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
const CODE_MIND_RESIZE_SHAPE = 45;
const CODE_MIND_MAP_REQUEST_MIND_INFO = 65;*/

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


var express = require('express');
var app = express();
/*app.use(express.static(__dirname+'/js'));
app.use(express.static(__dirname+'/res'));
app.use(express.static(__dirname));
app.use(express.static(__dirname+'/res_usr'));*/
app.use(express.static(__dirname+'/../Common'));
app.use(express.static(__dirname+'/../Common/Constants'));
app.use(express.static(__dirname+'/../WebContent/js'));
app.use(express.static(__dirname+'/../WebContent/res'));
app.use(express.static(__dirname+'/../WebContent/'));
app.use(express.static(__dirname+'/../WebContent/res_usr'));
app.use(function (request,response) {
	//fs.readFile(__dirname + '/'+"index.html", function (error,data){
	fs.readFile("../WebContent/"+THINK_MINE_MIND_MAP_PAGE_NAME, function (error,data){
		response.writeHead(200,{'Content-Type' : 'text/html'});
		response.end(data);
	});
});


var socketio = require('socket.io');

var server = http.createServer(app);
server.listen(52271,function(){
	console.log("Server running at http://127.0.0.1:52271");	

	

	
});
var io = socketio.listen(server,{log:false});

/*

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
			console.log(m.reply.retObject);
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS :
			io.sockets.emit('NewEvent',m.reply.retObject);
			break;
		case CODE_MIND_RESIZE_SHAPE :
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
			console.log("aaaa");
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
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
			io.sockets.emit('NewEvent',data);
			break;
		case CODE_MIND_RESIZE_SHAPE :
			var message = {
				requestSocketId : socket.id,
				operationType : 3,
				collectionName : "shape",
				info : data
			};
			dbHelperProcess.send(message);
			break;
		default :
			break;
		}
	});
});

var c = "efadef2232";
var d = parseInt(c,16);
console.log(c);
console.log(d);


var hashMapModule = require('hashmap');
var map = new hashMapModule.HashMap();
map.set("1","2");
console.log(map.get("1"));
console.log(map.get("2"));



var HashMapQueue = function(){
	var HashMap = hashMapModule.HashMap;
	var mainHashMap = new HashMap();
	var maxHashSize = 10000;
	var maxQueueSize = 1000;
	var totalCount = 0;
	
	this.pushItem = function(key,item){
		if(!mainHashMap.has(key)){
			if(mainHashMap.count() > maxHashSize){
				console.log("There are too many key,value on the mainHashMap");
				return false;
			}
			else{
				mainHashMap.set(key,[item]);
				return true;
			}
		}
		var QueueArray = mainHashMap.get(key);
		if(QueueArray.length > maxQueueSize){
			console.log("There are too many items on the Sub Queue of the mainHashMap");
			return false;
		}
		else{
			QueueArray.push(item);
			totalCount ++;
		}
	};
	this.popItem = function(key){
		var QueueArray = mainHashMap.get(key);
		if(QueueArray == undefined || QueueArray == null){
			console.log("There are no such item with key("+key+")");
			return null;
		}
		if(QueueArray.length == 0){
			console.log("There are no such item with key("+key+")");
			return null;			
		}
		var retItem = QueueArray[0];
		QueueArray.splice(0,1);
		totalCount --;
		return retItem;
	};
	this.getTotalCount = function(){
		return totalCount;
	};
}

var test = new HashMapQueue();

for (var i=0; i<500; i++){
	test.pushItem(i,i);
	console.log(test.popItem(498));
}

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




