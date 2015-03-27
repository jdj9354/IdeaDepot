//TO-DO : Need to implement seprated DB Operation Queue for each Mind Map

const spaceDelimiter = " ";

var TMO = require('./ThinkMineObjects');
//var ConstantsModule = 
var Constants = require('../Constants/ThinkMineConstants');

var MindMap = TMO.MindMap;
var MindObject = TMO.MindObject;


var Edge = TMO.Edge;
var EdgeTypeDependentInfo = TMO.EdgeTypeDependentInfo;
var SimplePathEdgeTypeDependentInfo = TMO.SimplePathEdgeTypeDependentInfo;

var Shape = TMO.Shape;
var ShapeTypeDependentInfo = TMO.ShapeTypeDependentInfo;
var CircleShapeTypeDependentInfo = TMO.CircleShapeTypeDependentInfo;
var EllipseShapeTypeDependentInfo = TMO.EllipseShapeTypeDependentInfo;
var RectangleShapeTypeDependentInfo = TMO.RectangleShapeTypeDependentInfo;
var StarShapeTypeDependentInfo = TMO.StarShapeTypeDependentInfo;
var PolygonShapeTypeDependentInfo = TMO.PolygonShapeTypeDependentInfo;


var Contents = TMO.Contents;
var ContentsTypeDependentInfo = TMO.ContentsTypeDependentInfo;
var TextContentsTypeDependentInfo = TMO.TextContentsTypeDependentInfo;
var ImageContentsTypeDependentInfo = TMO.ImageContentsTypeDependentInfo;
var MovieContentsTypeDependentInfo = TMO.MovieContentsTypeDependentInfo;
var WebPreviewContentsTypeDependentInfo = TMO.WebPreviewContentsTypeDependentInfo;


var HashMap = require('hashmap').HashMap;
var MindMapObjects_HM = new HashMap();
var DBOPerationQueue = [];

var encoder = new TMO.Encoder();
var decoder = new TMO.Decoder();

var net = require('net');
var DbGateConnector = null;

var emitter = exports.emitter;


var StoreBack = function() {
	if(DBOPerationQueue.length != 0){
		var job = DBOPerationQueue.shift();
		var message = JSON.stringify(job);	
		DbGateConnector.write(message);
	}
};


DbGateConnector = net.connect(Constants.THINK_MINE_HBASE_GATE_SERVER_PORT,
								Constants.THINK_MINE_HBASE_GATE_SERVER_ADDR,
	function(){
		console.log("HBASE Gate Connected");		
		console.log("Start HBASE Syncrhonization");
		
		setTimeout(StoreBack, Constants.THINK_MINE_HBASE_GATE_SYNC_INTERVAL);
	});


var tcpStreamData = "";	
//DbGateConnector.wait = true;
//DbGateConnector.result = null;

DbGateConnector.on('data', function(data){
	if(data[data.length-1] == nullCharValue){
			tcpStreamData += data;
			tcpStreamData.slice(data.length-1,data.length-1);
			
			var infoArray = tcpStreamData.split(spaceDelimiter); 
			var flagValue = infoArray[0];
			
			switch (flagValue){
			case "mmrres" :
				var mindMapObj = JSON.parse(infoArray[1]);				
				MindMapObjects_HM.set(mindMapObj.MMID,mindMapObj);
				emitter.emit(mindMapObj.MMID);				
				break;
			default :
				break;
			}
			
			
	}
	else{
		tcpStreamData += data;
	}	
});

exports.Create = function(data){
		var OpCode =  data.Code;
		var ret = {};

		switch (OpCode){
		case Constants.CODE_MIND_ADD :
		
			var mindMap = MindMapObjects_HM.get(data.MMID);

			if(mindMap == null){
				return {suc : 0,
						ret : null,
						mes : "There is no such mindMap" + data.MMID
						};
			}

			var newShapeTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeShapeType(data.ST), data.STDI);
			var newShape = new Shape(decoder.decodeShapeType(data.ST), newShapeTypeDependentInfo);
			
			var newContentsTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeContentsType(data.CT), data.CTDI);
			var newContents = new Contents(decoder.decodeContentsType(data.CT), newContentsTypeDependentInfo, data.CV);
			
			var newMindObject = new TMO.MindObject(data.MOID, data.MOID, data.MMID, newShape, newContents, data.X, data.Y, data.Z);
			
			mindMap.pushNewMindObject(newMindObject);
			
			data.CMMID = null;
			ret = data;
			
			
			break;
		case Constants.CODE_MIND_CONNECT_TO : 
			var mindMap = MindMapObjects_HM.get(data.MMID);
			
			if(mindMap == null){
				return {suc : 0,
						ret : null,
						mes : "There is no such mindMap" + data.MMID
						};
			}
			
			var mindObj = null;
			var targetMindObj = null;
			
			for(var i = 0; i < mindMap.lenOfMindObjectsArray() ; i++){
				if(mindMap.getMindObjectOnIndex(i).fMindObjectId == data.MOID){
					mindObj = mindMap.getMindObjectOnIndex(i);
				}
				if(mindMap.getMindObjectOnIndex(i).fMindObjectId == data.TMOID){
					targetMindObj = mindMap.getMindObjectOnIndex(i);
				}
				if(mindObj != null && targetMindObj != null)
					break;
			}
			if(mindObj == null || targetMindObj == null){

				return {suc : 0,
						ret : null,
						mes : "There is no such mindObj " + data.MOID + " / " + data.TMOID
						};
			}
			
			var newEdgeTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeEdgeType(data.ET), data.ETDI);			

			mindObj.connectTo(targetMindObj, decoder.decodeEdgeType(data.ET), newEdgeTypeDependentInfo);
			ret = data;
			
			break;
		case Constants.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP :
			if(!MindMapObjects_HM.has(data.MMID)){
				var newMindMap = new TMO.MindMap(data.MMID,'');
				MindMapObjects_HM.set(data.MMID,newMindMap);

				ret.Code = Constants.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP;
				ret.MMID = data.MMID+'';			
				ret.TT = "No Title";
				ret.PMOID = '';			
				ret.CMOS = new Array();
				ret.MAXRD = 300;
				ret.MAXOC = 100;
				ret.LX = 1000;
				ret.LY = 600;
				ret.LZ = 1000;			
			
				
				break;
			}
			else{
				return {suc : 0,
						ret : null,
						mes : "Duplicated MindMapId : " + data.MMID
						};
			}
		}
		
		DBOPerationQueue.push(data);
		
		return {suc : 1,
				ret : ret,
				mes : "Success"
				};

};
exports.Read = function(data){
	console.log("Read");
	var ret = {};
	var OpCode =  data.Code;
	switch (OpCode){
	case Constants.CODE_MIND_MAP_REQUEST_MIND_INFO :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		if(mindMap == null){
			DbGateConnector.write(JSON.stringify(data));
			return {suc : 2,
					ret : ret,
					mes : data.MMID
					};
		}
		//in case of duplicated request for the MindMap on the HBASE
		else if(emitter.listeners(data.MMID).length != 0){
			return {suc : 2,
					ret : ret,
					mes : data.MMID
					};
		}
		else{
			
			var childMindObjCommuArray = [];
			
			for(var i=0; i<mindMap.lenOfMindObjectsArray(); i++){
				var curMindObj = mindMap.getMindObjectOnIndex(i);
				
				childMindObjCommuArray.push([]);
				childMindObjCommuArray[i].push(curMindObj.fMindObjectId);					
				
				childMindObjCommuArray[i].push(curMindObj.fChildMindMapId);
				
				childMindObjCommuArray[i].push(curMindObj.fX);
				childMindObjCommuArray[i].push(curMindObj.fY);
				childMindObjCommuArray[i].push(curMindObj.fZ);
				
				childMindObjCommuArray[i].push(encoder.encodeShapeType(curMindObj.fShape.fShapeType));
				childMindObjCommuArray[i].push(TMO.genArrayForCommu(curMindObj.fShape.fShapeType,curMindObj.fShape.fShapeTypeDependentInfo));
				
				childMindObjCommuArray[i].push(encoder.encodeContentsType(curMindObj.fContents.fContentsType));
				childMindObjCommuArray[i].push(TMO.genArrayForCommu(curMindObj.fContents.fContentsType,curMindObj.fContents.fContentsTypeDependentInfo));
				childMindObjCommuArray[i].push(curMindObj.fContents.fValue);
				
				childMindObjCommuArray[i].push([]);
				
				for(var j=0; j<curMindObj.lenOfRelatedObjectsArray(); j++){
					var curRelMindObj = curMindObj.getRelatedObjectOnIndex(j);
					var curRelEdge = curMindObj.getConnectedEdgeOnIndex(j);
					
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(curRelMindObj.fMindObjectId);
					
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(encoder.encodeEdgeType(curRelEdge.fEdgeType));
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(TMO.genArrayForCommu(curRelEdge.fEdgeType,curRelEdge.fEdgeTypeDependentInfo));					
				}




			}
			
			
			
			
			

			
			ret.Code = Constants.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP;
			ret.MMID = data.MMID+'';			
			ret.TT = mindMap.fTitle;
			ret.PMOID = mindMap.fParentMindObjectId;			
			ret.CMOS = childMindObjCommuArray;
			ret.MAXRD = mindMap.getMaxRelDistance();
			ret.MAXOC = mindMap.getMaxMindObjectCount();
			ret.LX = mindMap.getLimitX();;
			ret.LY = mindMap.getLimitY();;
			ret.LZ = mindMap.getLimitZ();;			
		}
		break;
	}
	// change to event emmit
	return {suc : 1,
			ret : ret,
			mes : "Success"
			};
	
};
exports.Update = function(data){
	var OpCode =  data.Code;
	var ret = {};

	switch (OpCode){
	case Constants.CODE_MIND_MOVE :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var targetMindObj = null;
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				targetMindObj = mindMap.getMindObjectOnIndex(i);
				break;
			}
		}
		
		if(targetMindObj != null){
			targetMindObj.moveMindObject(data.X, data.Y, data.Z);
			console.log("move");
		}
			
		ret = data;
		
		break;
	}

	DBOPerationQueue.push(data);
	
	return {suc : 1,
			ret : ret,
			mes : "Success"
			};
};
exports.Delete = function(data){

	var OpCode =  data.Code;
	var ret = {};

	switch (OpCode){
	case Constants.CODE_MIND_DISCONNECT_FROM :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var fromMindObj = null;
		var toMindObj = null;
		
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				fromMindObj = mindMap.getMindObjectOnIndex(i);
			}
			if(data.TMOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				toMindObj = mindMap.getMindObjectOnIndex(i);
			}
			if(fromMindObj != null && toMindObj != null)
				break;
		}
		
		if(fromMindObj != null && toMindObj != null){
			fromMindObj.disconnectFrom(toMindObj);
		}
			
		ret = data;
		
		break;
	case Constants.CODE_MIND_DEL :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var targetMindObj = null;
		var targetMindObjIndex = -1;
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				targetMindObj = mindMap.getMindObjectOnIndex(i);
				targetMindObjIndex = i;
				break;
			}
		}
		
		if(targetMindObj != null){
			mindMap.removeMindObjectOnIndex(targetMindObjIndex);
			targetMindObj.removeMindObject();
		}
			
		ret = data;
		
		break;
	}

	DBOPerationQueue.push(data);
	
	return {suc : 1,
			ret : ret,	
			mes : "Success"
			};
};


exports.onRoomRemoved = function(roomId){
	while(DBOperationQueue.length != 0){
		StoreBack();
	}
	MindMapObjects_HM.remove(roomId);
	
};




