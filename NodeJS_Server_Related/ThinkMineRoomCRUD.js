
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

exports.Create = function(data){
		var OpCode =  data.Code;
		var resultMes = {};

		switch (OpCode){
		case Constants.CODE_MIND_ADD :
		
			var mindMap = MindMapObjects_HM.get(data.MMID);

			if(mindMap == null){
				return {suc : 0,
						mes : "There is no such mindMap" + data.MMID
						};
			}

			var newShapeTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeShapeType(data.ST), data.STDI);
			var newShape = new Shape(decoder.decodeShapeType(data.ST), newShapeTypeDependentInfo);
			
			var newContentsTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeContentsType(data.CT), data.CTDI);
			var newContents = new Contents(decoder.decodeContentsType(data.CT), newContentsTypeDependentInfo);
			
			var newMindObject = new TMO.MindObject(data.MOID, data.MOID, data.MMID, newShape, newContents, data.X, data.Y, data.Z);
			
			mindMap.pushNewMindObject(newMindObject);
			
			data.CMMID = null;
			resultMes = data;
			
			
			break;
		case Constants.CODE_MIND_CONNECT_TO : 
			var mindMap = MindMapObjects_HM.get(data.MMID);
			
			if(mindMap == null){
				return {suc : 0,
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
						mes : "There is no such mindObj " + data.MOID + " / " + data.TMOID
						};
			}
			
			var newEdgeTypeDependentInfo = TMO.getObjTypeDependentInfo(decoder.decodeEdgeType(data.ET), data.ETDI);			

			mindObj.connectTo(targetMindObj, decoder.decodeEdgeType(data.ET), newEdgeTypeDependentInfo);
			resultMes = data;
			
			break;
		case Constants.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP :
			var newMindMap = new TMO.MindMap(data.MMID,'');
			MindMapObjects_HM.set(data.MMID,newMindMap);

			resultMes.Code = Constants.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP;
			resultMes.MMID = data.MMID+'';			
			resultMes.TT = "No Title";
			resultMes.PMOID = '';			
			resultMes.CMOS = new Array();
			resultMes.MAXRD = 300;
			resultMes.MAXOC = 100;
			resultMes.LX = 1000;
			resultMes.LY = 600;
			resultMes.LZ = 1000;			
			
			console.log(resultMes);
			console.log('herehere');
			
			break;
		}
		
		DBOPerationQueue.push(data);
		
		return {suc : 1,
				mes : resultMes
				};

};
exports.Read = function(data){
	console.log("Read");
	var OpCode =  data.Code;
	switch (OpCode){
	case Constants.CODE_MIND_MAP_REQUEST_MIND_INFO :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		if(mindMap == null){
			//TCP Socket Commu and get Info
		}			
		break;
	}
	// change to event emmit
	return {suc : 1,
			mes : mindMap
			};
	
};
exports.Update = function(data){
	var OpCode =  data.Code;
	var resultMes = {};

	switch (OpCode){
	case Constants.CODE_MIND_MOVE :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var targetMindObj = null;
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i)){
				targetMindObj = mindMap.getMindObjectOnIndex(i);
				break;
			}
		}
		
		if(targetMindObj != null){
			targetMindObj.moveMindObject(data.X, data.Y, data.Z);
		}
			
		resultMes = data;
		
		break;
	}

	DBOPerationQueue.push(data);
	
	return {suc : 1,
			mes : resultMes
			};
};
exports.Delete = function(data){

	var OpCode =  data.Code;
	var resultMes = {};

	switch (OpCode){
	case Constants.CODE_MIND_DISCONNECT_FROM :
		var mindMap = MindMapObjects_HM.get(data.MMID);
		var fromMindObj = null;
		var toMindObj = null;
		
		for(var i=0; i< mindMap.lenOfMindObjectsArray(); i++){
			if(data.MOID == mindMap.getMindObjectOnIndex(i)){
				fromMindObj = mindMap.getMindObjectOnIndex(i);
			}
			if(data.TMOID == mindMap.getMindObjectOnIndex(i)){
				toMindObj = mindMap.getMindObjectOnIndex(i);
			}
			if(fromMindObj != null && toMindObj != null)
				break;
		}
		
		if(fromMindObj != null && toMindObj != null){
			fromMindObj.disconnectFrom(toMindObj);
		}
			
		resultMes = data;
		
		break;
	}

	DBOPerationQueue.push(data);
	
	return {suc : 1,
			mes : resultMes
			};
};
exports.StoreBack = function(data){

};





