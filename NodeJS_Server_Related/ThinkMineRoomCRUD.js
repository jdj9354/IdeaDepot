//TO-DO : Need to implement seprated DB Operation Queue for each Mind Map

const spaceDelimiter = " ";
const nullCharDelimiter = "\0";
const nullCharValue = 0;

var TMO = require('../Common/ThinkMineObjects');
//var ConstantsModule = 
var Constants = require('../Common/Constants/ThinkMineConstants');

var MindMap = TMO.MindMap;
var MindObject = TMO.MindObject;


var Edge = TMO.Edge;
var EdgeTypeDependentInfo = TMO.EdgeTypeDependentInfo;
var SimplePathEdgeTypeDependentInfo = TMO.SimplePathEdgeTypeDependentInfo;
var OriPathEdgeTypeDependentInfo = TMO.OriPathEdgeTypeDependentInfo;

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
var DBOperationQueue = new Array();;//[];

var encoder = new TMO.Encoder();
var decoder = new TMO.Decoder();

var net = require('net');
var DbGateConnector = null;

var emitter = null;
var externalModule = exports;

var StoreBack = function() {	
	if(DBOperationQueue.length != 0){		
		var job = DBOperationQueue.shift();
		var message = JSON.stringify(job);
		message += nullCharDelimiter;
		DbGateConnector.write(message);
	}
};


DbGateConnector = net.connect(Constants.THINK_MINE_HBASE_GATE_SERVER_PORT,
								Constants.THINK_MINE_HBASE_GATE_SERVER_ADDR,
	function(){
		console.log("HBASE Gate Connected");		
		console.log("Start HBASE Syncrhonization");
		
		//emitter = externalModule.emitter;		
		setInterval(StoreBack, Constants.THINK_MINE_HBASE_GATE_SYNC_INTERVAL);
	});


var tcpStreamData = "";	
//DbGateConnector.wait = true;
//DbGateConnector.result = null;

DbGateConnector.on('data', function(data){
	if(data[data.length-1] == nullCharValue){
			tcpStreamData += data;
			//tcpStreamData = tcpStreamData.slice(data.length-1,data.length-1);
			
			//var infoArray = tcpStreamData.split(spaceDelimiter,1); 
			var spaceIdx = tcpStreamData.indexOf(spaceDelimiter);
			var flagValue = tcpStreamData.substring(0,spaceIdx);
			var dataValue = tcpStreamData.substring(spaceIdx+1,tcpStreamData.length-1);
			tcpStreamData = "";						
			
			switch (flagValue){
			case "mmrres" :				
				var mindMapObj = JSON.parse(dataValue);			
				
				var resultMindMap = new TMO.MindMap(mindMapObj.MMID,mindMapObj.PMOID);				
				resultMindMap.setMaxRelDistance(mindMapObj.MAXRD);
				resultMindMap.setLimitX(mindMapObj.LX);
				resultMindMap.setLimitY(mindMapObj.LY);
				resultMindMap.setLimitZ(mindMapObj.LZ);
				resultMindMap.setMaxMindObjectCount(mindMapObj.MAXOC);				

				var relatedMindObjectsInfoArray = [];
				
				for(var i=0; i<mindMapObj.CMOS.length;i++){				
					
					var tempMindObjectId = mindMapObj.CMOS[i][0];
					var tempChildMindMapId = mindMapObj.CMOS[i][1];					
					
					var x = mindMapObj.CMOS[i][2];							
					var y = mindMapObj.CMOS[i][3];				
					var z = mindMapObj.CMOS[i][4];				
					
					var tempShapeType = decoder.decodeShapeType(mindMapObj.CMOS[i][5]);				
					var tempShapeTypeDependentInfo;					
									
					tempShapeTypeDependentInfo = TMO.genObjTypeDependentInfo(tempShapeType, mindMapObj.CMOS[i][6]);														
					
					var tempShape = new TMO.Shape(tempShapeType, tempShapeTypeDependentInfo);								
					
					var tempContentsType = decoder.decodeContentsType(mindMapObj.CMOS[i][7]);				
					var tempContentsTypeDependentInfo;
					
					tempContentsTypeDependentInfo = TMO.genObjTypeDependentInfo(tempContentsType, mindMapObj.CMOS[i][8]);				
					
					var tempContentsValue = mindMapObj.CMOS[i][9];
					var tempContents = new TMO.Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);	
					
					var tempRelatedMindObjects = mindMapObj.CMOS[i][10];								
					var tempMindObject = new TMO.MindObject(tempMindObjectId, tempChildMindMapId, mindMapObj.MMID, tempShape, tempContents , x, y, z);
					
					resultMindMap.pushNewMindObject(tempMindObject);
					relatedMindObjectsInfoArray.push(tempRelatedMindObjects);				
				}
				
				
				for(var i=0; i<relatedMindObjectsInfoArray.length; i++){
					var relatedMindObjectsInfo = relatedMindObjectsInfoArray[i];
					for(var j=0; j<relatedMindObjectsInfo.length; j+=3){
						var isExsist = false;					
						for(var k=0; k<resultMindMap.getMindObjectOnIndex(i).lenOfRelatedObjectsArray(); k++){						
							if(TMO.compareIdValue(relatedMindObjectsInfo[j],
									resultMindMap.getMindObjectOnIndex(i).getRelatedObjectOnIndex(k).fMindObjectId)){
								isExsist = true;							
								break;
							}
						}
						if(!isExsist){						
							var connectingObj = null;
							
							for(var k=0; k<resultMindMap.lenOfMindObjectsArray(); k++){
								if(TMO.compareIdValue(relatedMindObjectsInfo[j],
										resultMindMap.getMindObjectOnIndex(k).fMindObjectId)){
									connectingObj = resultMindMap.getMindObjectOnIndex(k);
									break;
								}
							}
							if(connectingObj != resultMindMap.getMindObjectOnIndex(i) && connectingObj != null){
								var tempEdgeType = decoder.decodeEdgeType(relatedMindObjectsInfo[j+1]);							
								var tempEdgeTypeDependentInfo;							
								
								tempEdgeTypeDependentInfo = TMO.genObjTypeDependentInfo(tempEdgeType, relatedMindObjectsInfo[j+2]);						
								
								resultMindMap.getMindObjectOnIndex(i).connectTo(connectingObj, tempEdgeType, tempEdgeTypeDependentInfo);							
							}
						}				
					}
				}				
				MindMapObjects_HM.set(mindMapObj.MMID,resultMindMap);					
				exports.emitter.emit(mindMapObj.MMID,mindMapObj);				
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

			var newShapeTypeDependentInfo = TMO.genObjTypeDependentInfo(decoder.decodeShapeType(data.ST), data.STDI);
			var newShape = new Shape(decoder.decodeShapeType(data.ST), newShapeTypeDependentInfo);
			
			var newContentsTypeDependentInfo = TMO.genObjTypeDependentInfo(decoder.decodeContentsType(data.CT), data.CTDI);
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
			
			var newEdgeTypeDependentInfo = TMO.genObjTypeDependentInfo(decoder.decodeEdgeType(data.ET), data.ETDI);			

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
		
		DBOperationQueue.push(data);
		
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
			//in case of duplicated request for the MindMap on the HBASE
			if(exports.emitter.listeners(data.MMID).length != 0){
				return {suc : 2,
						ret : ret,
						mes : data.MMID
						};
			}
			DbGateConnector.write(JSON.stringify(data) + nullCharDelimiter);
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
				childMindObjCommuArray[i].push(curMindObj.fShape.fShapeTypeDependentInfo);
				
				childMindObjCommuArray[i].push(encoder.encodeContentsType(curMindObj.fContents.fContentsType));
				childMindObjCommuArray[i].push(curMindObj.fContents.fContentsTypeDependentInfo);
				childMindObjCommuArray[i].push(curMindObj.fContents.fValue);
				
				childMindObjCommuArray[i].push([]);
				
				for(var j=0; j<curMindObj.lenOfRelatedObjectsArray(); j++){
					var curRelMindObj = curMindObj.getRelatedObjectOnIndex(j);
					var curRelEdge = curMindObj.getConnectedEdgeOnIndex(j);
					
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(curRelMindObj.fMindObjectId);
					
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(encoder.encodeEdgeType(curRelEdge.fEdgeType));
					childMindObjCommuArray[i][childMindObjCommuArray[i].length-1].push(curRelEdge.fEdgeTypeDependentInfo);					
				}
			}
			
			ret.Code = Constants.CODE_MIND_MAP_REQUEST_MIND_INFO;
			ret.MMID = data.MMID+'';			
			ret.TT = mindMap.fTitle;
			ret.PMOID = mindMap.fParentMindObjectId;			
			ret.CMOS = childMindObjCommuArray;
			ret.MAXRD = mindMap.getMaxRelDistance();
			ret.MAXOC = mindMap.getMaxMindObjectCount();
			ret.LX = mindMap.getLimitX();
			ret.LY = mindMap.getLimitY();
			ret.LZ = mindMap.getLimitZ();			
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
		}
			
		ret = data;
		
		break;
	case Constants.CODE_MIND_RESIZE_SHAPE :
		console.log(data.toString());
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var targetMindObj = null;
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				targetMindObj = mindMap.getMindObjectOnIndex(i);
				break;
			}
		}
		
		if(targetMindObj != null){
			var changeShapeType = decoder.decodeShapeType(data.ST);
			var changeShapeTypeDependentInfo = TMO.genObjTypeDependentInfo(changeShapeType,data.STDI);
			targetMindObj.changeShape(new Shape(changeShapeType,changeShapeTypeDependentInfo));
		}
			
		ret = data;
		break;
	case Constants.CODE_MIND_CHANGE_VALUE_OF_CONTENTS :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var targetMindObj = null;
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i).fMindObjectId){
				targetMindObj = mindMap.getMindObjectOnIndex(i);
				break;
			}
		}		
		if(targetMindObj != null){
			targetMindObj.fContents.fValue = data.CV;
		}
			
		ret = data;		
		
		break;
	}

	DBOperationQueue.push(data);
	
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

	DBOperationQueue.push(data);
	
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




