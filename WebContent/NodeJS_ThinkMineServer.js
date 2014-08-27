const CODE_MIND_ADD = 32;
const CODE_MIND_DEL = 33;
const CODE_MIND_MOVE = 34;
const CODE_MIND_PUT_INTO = "MPI";
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
			
//			totalCount = 0;
//			var ResultObj = {};
//			ResultObj.Code = CODE_MIND_MAP_REQUEST_MIND_INFO;
//			ResultObj.Var1 = data.Var1;
//			ResultObj.Var2 = data.Var2;
//			ResultObj.Var3 = 0
//			ResultObj.Var4 = 1;
//			
//			var TempArray = new Array();
//			for(i=0; i<5; i++){
//				
//				var MindObjectID1 = 0;
//				var MindObjectID2 = totalCount;
//				var ChildMindMapID1 = 0;
//				var ChildMindMapID2 = 5;
//				var x = 100+150*i;
//				var y = 200+75*i;
//				var z = 0;
//				var ShapeType = 16777216;
//				var ShapeDependentInfo = [30, "#ff0000"];
//				var ContentsType = 16777216;
//				var ContentsDependentInfo = ["#00ff00",'Courier New', 'bold', (Math.floor(25) + 1)];		
//				var Contents = "Think Test "+i;
//				var RelatedObjectArray;
//				if(i == 0 || i == 2 || i == 3)
//					RelatedObjectArray = [0,0,16777216,[1,"#000000"],
//					                          0,2,16777216,[1,"#000000"],
//					                          0,3,16777216,[1,"#ff0000"]];
//				else
//					RelatedObjectArray = [];
//				
//				var InnerTempArray = [MindObjectID1,MindObjectID2,ChildMindMapID1,ChildMindMapID2,x,y,z,ShapeType,ShapeDependentInfo,ContentsType,ContentsDependentInfo,Contents,RelatedObjectArray];
//				TempArray.push(InnerTempArray);
//				/*
//				
//				ResultString += "[";
//				
//				ResultString += String(i);
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += 5;
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += 100+(Math.floor(Math.random() * 150) + 1)*i;
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += 200+(Math.floor(Math.random() * 100) + 1)*i;
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += 0;
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += "CircleShape";
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += "TextContents";
//				ResultString += Nested_SocketCommuDelimiter_2;
//				
//				ResultString += "ThinkTest";
//				ResultString += Nested_SocketCommuDelimiter_2+"{";
//				
//				ResultString += "0";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "SimplePathEdge";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "#000000";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "2";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "SimplePathEdge";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "#000000";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "3";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "SimplePathEdge";
//				ResultString += Nested_SocketCommuDelimiter_3;
//				
//				ResultString += "#535600";
//				ResultString += "}]";
//				if(i<4)
//					ResultString += ",";*/
//				totalCount ++;
//			}
//			ResultObj.Var5 = TempArray;
//			ResultObj.Var6 = 300;
//			ResultObj.Var7 = 90;
//			/*ResultString += SocketCommuDelimiter;
//			ResultString += "300";
//			ResultString += SocketCommuDelimiter;
//			
//			ResultString += "90";*/
//			
//			//var data = {a:[[1,2],50], b:50};
//			//data2.a = 50;
//			//data2.b = 50;
//			socket.emit('NewEvent',ResultObj);
			break;
		
		case CODE_MIND_ADD :
//			var ResultObj = {};
//			ResultObj.Code = CODE_MIND_ADD;
//			ResultObj.Var1 = data.Var1;
//			ResultObj.Var2 = data.Var2;
//			
//			//MindMap 할당하는 로직 필요		
//			ResultObj.Var3 = 0;
//			ResultObj.Var4 = 8;		
//			//totalCount ++;
//			//MindMap 할당하는 로직 필요
//			
//			ResultObj.Var5 = data.Var3;
//			ResultObj.Var6 = data.Var4;
//			ResultObj.Var7 = data.Var5;
//			ResultObj.Var8 = data.Var6;
//			ResultObj.Var9 = data.Var7;
//			ResultObj.Var10 = data.Var8;
//			ResultObj.Var11 = data.Var9;
//			ResultObj.Var12 = data.Var10;
//			
//
//			var buf = new Buffer(ResultObj);
			
			
			var message = {
				requestSocketId : socket.id,
				operationType : 1,
				collectionName : "mindobject",
				info : data
			};
			
			dbHelperProcess.send(message);
			
//			data.MOID = "abcde";
//			data.CMMID = "abcde";
//			
			//io.sockets.emit('NewEvent',data);
			

			
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




