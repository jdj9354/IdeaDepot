var tmdb = new function(undefined) {
	
const THINK_MINE_DB_NAME = "tmdb";
const MIND_MAP_COLLECTION_NAME = "mindmap";
const MIND_OBJECT_COLLECTION_NAME = "mindobject";
const SHAPE_COLLECTION_NAME = "shape";
const CONTENTS_COLLECTION_NAME = "contents";
const EDGE_COLLECTION_NAME = "edge";


const CODE_MIND_ADD = 32;
const CODE_MIND_DEL = 33;
const CODE_MIND_MOVE = 34;
const CODE_MIND_PUT_INTO = "MPI";
const CODE_MIND_PULL_OUT = "MPO";
const CODE_MIND_CONNECT_TO = 37;
const CODE_MIND_DISCONNECT_FROM = 38;
const CODE_MIND_CHANGE_COLOR_OF_CONTENTS = 39;
const CODE_MIND_CHANGE_CONTENTS = "MCC";
const CODE_MIND_CHANGE_COLOR_OF_SHAPE = 41;
const CODE_MIND_CHANGE_SHAPE = "MCS";
const CODE_MIND_CHANGE_PARENT_MINDMAP = "MCPMM";
const CODE_MIND_MAP_REQUEST_MIND_INFO = 65;


var dbObj = null;

var mindMapCollection = null;	
var mindObjectCollection = null;
var shapeCollection = null;
var contentsCollection = null;
var edgeCollection = null;		

var Db = null;

this.sequentialFind = function(conditionArray,collection){
	if(conditionArray == null || collection == null){
		return null;
	}
	var maxCount = conditionArray.length;
	
	if(maxCount == 0)
		return null;
	
	var retArray = new Array();
	
	var count = -1;
	
	var loopFunction = function(err,queryResult){
		count++;
		if(count != 0){
			retArray.push(queryResult);
			
		}
		if(count == resultItem.mind_objects.length)
			return;
		else{
			collection.findOne(conditionArray[count],loopFunction);			
		}
	};
	
	return
	
};

this.prepareDB = function(){

	Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    DBRef = require('mongodb').DBRef,
    assert = require('assert');

	
	dbObj = new Db('ThinkMine', new Server('localhost',27017));
	
	
	MongoClient.connect("mongodb://localhost:27017/ThinkMine",function(err,db){
		if(err){ return console.dir(err); }

			console.log("MongoDB connected");
			
			var collection = db.collection('mindmap');
			var doc1 = {'hello':'doc1'};
			
		// collection.insert(doc1,function(err, result) {});
			
			var aa=null;
			var f = false;
			
			var etest = new process.EventEmitter();
			
			etest.on('found',function(){console.log(aa.text); f = true;});
			
		// console.log(c+'');
			collection.findOne({"_id" : new ObjectID("536f9de336ace5e65af718f1")},function(err, item){if(item==null) console.log("null!");aa=item;
			console.log(item);
			var b = item._id+'';
			console.log(b);});
			
			console.log("Pass!");
			// while(aa==null){}
			
			// aa = collection.find().toArray(function(err,
			// documents){console.log(documents[0]);});
			
			// console.log(aa[0].author);
			
		
	});
	
	dbObj.open(function(err,db){
		
		if(err != null){
			
		}
		
		mindMapCollection = db.collection(MIND_MAP_COLLECTION_NAME);	
		mindObjectCollection = db.collection(MIND_OBJECT_COLLECTION_NAME);
		shapeCollection = db.collection(SHAPE_COLLECTION_NAME);
		contentsCollection = db.collection(CONTENTS_COLLECTION_NAME);
		edgeCollection = db.collection(EDGE_COLLECTION_NAME);		
	});
	
	// var testa = this.makeCommunicationMindMap([0,0]);
//	
// console.log(testa.Var1);
// console.log(testa.Var2);
// console.log(testa.Var3);
// console.log(testa.Var4);
// console.log(testa.Var5);
// console.log(testa.Var6);
	
}

this.insertMindMap = function(mindMap){	
	mindMapCollection.insert(mindMap,function(err, result) {});
};

this.removeMindMap = function(mindMapId, requestSocketId, mode){
	
};

this.composeCommunicationMindMapAndReply = function(mindMapId,requestSocketId){
	
	var communicationMindMap = {};
	
	// var eventEmitter = new process.EventEmitter();
	
	
	

		
	console.log(mindMapId);
	
	mindMapCollection.findOne({"_id": new ObjectID(mindMapId)},function(err, resultItem) {
		if(err!=null){
			
		}
		if(resultItem == null){				
			process.send({replyRequestSocketId : requestSocketId,
							reply : null});
			return;
		}
		
		communicationMindMap.Code = CODE_MIND_MAP_REQUEST_MIND_INFO;
		communicationMindMap.MMID = resultItem._id+'';			
		communicationMindMap.PMOID = resultItem.parent_mind_object.oid+'';			
		communicationMindMap.CMOS = new Array();
		communicationMindMap.MAXRD = resultItem.max_rel_distance;
		communicationMindMap.MAXOC = resultItem.max_mind_object_count;
		
		var childCount = -1;			
		
		var loopFunction = function(err,childMindObjectInfo){
			if (err != null){
				
			}
			
			
			
			if(childCount >= 0){
				
				communicationMindMap.CMOS.push(new Array());
				// console.log(childCount);
				// console.log(communicationMindMap.Var5[childCount]);
				communicationMindMap.CMOS[childCount].push(childMindObjectInfo._id+'');					
				
				communicationMindMap.CMOS[childCount].push(childMindObjectInfo.child_mind_map.oid+'');					
				
				communicationMindMap.CMOS[childCount].push(childMindObjectInfo.x);
				communicationMindMap.CMOS[childCount].push(childMindObjectInfo.y);
				communicationMindMap.CMOS[childCount].push(childMindObjectInfo.z);
				
				shapeCollection.findOne({"_id": childMindObjectInfo.shape.oid}, function(err,shapeResult){
					if(err != null){
						
					}
					
					communicationMindMap.CMOS[childCount].push(shapeResult.shape_type);
					communicationMindMap.CMOS[childCount].push(shapeResult.shape_type_dependent_info);
					
					contentsCollection.findOne({"_id" : childMindObjectInfo.contents.oid},function(err,contentsResult){
						communicationMindMap.CMOS[childCount].push(contentsResult.contents_type);
						communicationMindMap.CMOS[childCount].push(contentsResult.contents_type_dependent_info);
						communicationMindMap.CMOS[childCount].push(contentsResult.value);
						
						communicationMindMap.CMOS[childCount].push(new Array());
						
						var relCount = -1;
						
						var innerLoopFunction = function(err,edgeInfo){							
							if (err != null){									
								
							}
							// console.log(childMindObjectInfo);
							
							
							
							/*
							 * if(currentRelIndex ==
							 * childMindObjectInfo.related_mind_objects.length){
							 * if(childCount ==
							 * resultItem.mind_objects.length){
							 * console.log(communicationMindMap);
							 * dbObj.close(); return; } else{ childCount++;
							 * mindObjectCollection.findOne({id:[resultItem.mind_objects[childCount].oid[0],resultItem.mind_objects[childCount].oid[1]]},loopFunction);
							 * return; } }
							 */
							

							if(relCount >= 0){								
								

								console.log(childMindObjectInfo.related_mind_objects[relCount]);
								communicationMindMap.CMOS[childCount][communicationMindMap.CMOS[childCount].length-1].push(childMindObjectInfo.related_mind_objects[relCount].oid+'');									
								
								communicationMindMap.CMOS[childCount][communicationMindMap.CMOS[childCount].length-1].push(edgeInfo.edge_type);
								communicationMindMap.CMOS[childCount][communicationMindMap.CMOS[childCount].length-1].push(edgeInfo.edge_type_dependent_info);													
																	
								
								relCount ++;
								
								
								// var currentRelIndex = relCount;
								
								if(relCount == childMindObjectInfo.related_mind_objects.length){
									childCount++;
									if(childCount == resultItem.mind_objects.length){
										console.log("efef");
										console.log(communicationMindMap.CMOS[2][13]);											
										process.send({replyRequestSocketId : requestSocketId,
														reply : {retObject : communicationMindMap}});
										return;
									}
									else{
										
										mindObjectCollection.findOne({"_id" : resultItem.mind_objects[childCount].oid},loopFunction);
										return;
									}
								}
								
								edgeCollection.findOne({"$or" : [{first_mind_object_id : childMindObjectInfo.related_mind_objects[relCount].oid , second_mind_object_id : childMindObjectInfo._id},
								                                 {first_mind_object_id : childMindObjectInfo._id , second_mind_object_id : childMindObjectInfo.related_mind_objects[relCount].oid}]},innerLoopFunction);	
							}
							else{
								relCount ++;									
								
								edgeCollection.findOne({"$or" : [{first_mind_object_id : childMindObjectInfo.related_mind_objects[relCount].oid , second_mind_object_id : childMindObjectInfo._id},
																	{first_mind_object_id : childMindObjectInfo._id , second_mind_object_id : childMindObjectInfo.related_mind_objects[relCount].oid}]},innerLoopFunction);									
							}							
						}
						if(childMindObjectInfo.related_mind_objects.length > 0)
							innerLoopFunction(null,null);
						else{
							childCount++;
							if(childCount == resultItem.mind_objects.length){
								// console.log(communicationMindMap);
								console.log("afafaf");
								console.log(communicationMindMap.CMOS[0][12]);									
								process.send({replyRequestSocketId : requestSocketId,
											reply : {retObject : communicationMindMap}});
								return;
							}
							else{
								
								mindObjectCollection.findOne({"_id": resultItem.mind_objects[childCount].oid},loopFunction);
								return;
							}								
						}
							
					});
				});				
			}
			else{
				childCount++;					
				mindObjectCollection.findOne({"_id" : resultItem.mind_objects[0].oid},loopFunction);
			}
			
		};
		if(resultItem.mind_objects.length > 0)
			loopFunction(null,undefined);
		else{				
			process.send({replyRequestSocketId : requestSocketId,
							reply : {retObject : communicationMindMap}});
			console.log("cccccc");
		}
	});
	// console.log("aaaa");
		
	
	return ;
};

this.createMindObjectAndReply = function(info,requestSocketId){
	var message = {};
	//message.Code = CODE_MIND_ADD;
	if(info == null || info == undefined){
		message.retString = "Failed to insert MindObject " + info.CV;
		console.log(message.retString);
		process.send({replyRequestSocketId : requestSocketId,
						reply : message});
	}
	
	var newId = new ObjectID();
	
	var newShape = {
		_id : newId,
		shape_type : info.ST,
		shape_type_dependent_info : info.STDI
	};
	
	var newContents = {
		_id : newId,
		contents_type : info.CT,
		contents_type_dependent_info : info.CTDI,
		value : info.CV
	};
	
	var newMindObject = {
		_id : newId,
		child_mind_map :  new DBRef("mindmap",newId),
		contents : new DBRef("contents",newId),
		parent_mind_map : new DBRef("mindmap",new ObjectID(info.MMID)),
		related_mind_objects : [],
		shape : new DBRef("shape",newId),
		x : info.X,
		y : info.Y,
		z : info.Z
	};
	
	
		

		
	/*
	 * mindMapCollection.update({"_id" : new ObjectID(info.MMID)},{"$push" :
	 * {"mind_objects" : new
	 * DBRef("mindobject",newId)}},function(err,result){ if(err != null){
	 * message.retString = "failed to update mindMap"; dbObj.close();
	 * return; }
	 * 
	 * message.retString = "Succeeded to create MindObject";
	 * process.send(message); dbObj.close(); return; });
	 */
	
	mindObjectCollection.insert(newMindObject,function(err,result){
		if(err !=null){
			message.retString = "failed to insert mindObject";
			// process.send(message);				
			return;				
		}
		shapeCollection.insert(newShape,function(err,result){
			if(err !=null){
				message.retString = "failed to insert shape";
				// process.send(message);					
				return;
			}
			contentsCollection.insert(newContents,function(err,result){
				if(err !=null){
					message.retString = "failed to insert contents";
					// process.send(message);						
					return;
				}
				message.retString = "MindObject Insertion Complete";
				// process.send(message);
				mindMapCollection.update({"_id" : new ObjectID(info.MMID)},{"$push" : {"mind_objects" : new DBRef("mindobject",newId)}},function(err,result){
					if(err != null){
						message.retString = "failed to update mindMap";
						// 생성됐는데 쓰일수없는 것들 지우는 코드 필요								
						return;
					}
					
					message.retObject = {Code : CODE_MIND_ADD,
										 MMID : info.MMID,
										 MOID : newId+'',
										 CMMID : null,
										 X : info.X,
										 Y : info.Y,
										 Z : info.Z,
										 ST : info.ST,
										 STDI : info.STDI,
										 CT : info.CT,
										 CTDI : info.CTDI,
										 CV : info.CV};
					
					message.retString = "Succeeded to create MindObject";
					process.send({replyRequestSocketId : requestSocketId,
									reply : message});
					return;
				});
				return;
			});
		});
	});
	
	console.log(newShape);
	console.log(newContents);
	console.log(newMindObject);
};


this.moveMindObjectAndReply = function(info,requestSocketId){
	var message = {};
	message.Code = CODE_MIND_MOVE;
	if(info == null || info == undefined){
		message.retString = "Failed to move MindObject " + info.MOID;		
		console.log(message.retString);
		process.send({replyRequestSocketId : requestSocketId,
						reply : null});
	}
	
	
		
	mindObjectCollection.update({"_id" : new ObjectID(info.MOID)},{"$set" : {"x" : info.X, "y" : info.Y, "z" : info.Z}},function(err,result){
		if(err != null){
			message.retString = "failed to update(move) mindObject";
			
			return;
		}
		
		
		message.retString = "Succeeded to update(move) MindObject";
		message.retObject = info;
		process.send({replyRequestSocketId : requestSocketId,
						reply : message});
	
		return;
	});		
		

	
};

this.removeMindObjectAndReply = function(info,requestSocketId){
	
	mindObjectCollection.findOne({"_id" : new ObjectID(info.MOID)}, function(err, result){
		if(err != null){
			
		}
		
		if(result == null || result == undefined){
			
		}
		
		var parentMindMapId = result.parent_mind_map.oid;
		var childMindMapId = result.child_mind_map.oid;
		var contentsId = result.contents.oid;
		var shapeId = result.shape.oid;
		var relatedMindObjects = result.related_mind_objects;
		
				
		tmdb.removeMindMap(childMindMapId+'',requestSocketId,false);
		
		mindObjectCollection.remove({"_id" : new ObjectID(info.MOID)},function(err,result){
			
		
			mindMapCollection.update({"_id" : parentMindMapId},{"$pull" : {"mind_objects" : {"$ref" : "mindobject" , "$id" : new ObjectID(info.MOID)}}}, function(err, result){
				if(err != null){
					console.log("err");
				}
				
				if(result == null || result == undefined){
					console.log("result is not normal");
				}
				
				contentsCollection.remove({"_id" : contentsId}, function(err,result){
					if(err != null){
						
					}
					
					if(result == null || result == undefined){
						
					}
					
					shapeCollection.remove({"_id" : shapeId}, function(err, result){
						if(err != null){
							
						}
						
						if(result == null || result == undefined){
							
						}
					});
					
					for(var i=0; i<relatedMindObjects.length; i++){
						mindObjectCollection.update({"_id" : relatedMindObjects[i].oid},{"$pull" : {"_id" : info.MOID}},function (err,result){
							if(err != null){
								
							}
							
							if(result == null || result == undefined){
								
							}
						});
					}
					
				});
				
			});
		});												
		
		
	});
};

this.connectMindObjectAndReply = function(info,requestSocketId) {
	var newEdge = {"_id" : new ObjectID(),
					"first_mind_object_id" : new ObjectID(info.MOID),
					"second_mind_object_id" : new ObjectID(info.TMOID),
					"edge_type" : info.ET,
					"edge_type_dependent_info" : info.ETDI
			
	};
	edgeCollection.insert(newEdge,function(err, result){
		if(err != null){
			
		}
		mindObjectCollection.update({"_id" : new ObjectID(info.MOID)},{"$push" : {"related_mind_objects" : {"$ref" : "mindobject","$id" : new ObjectID(info.TMOID)}}},function(err,result){
			if(err !=null){
				
			}
			
			mindObjectCollection.update({"_id" : new ObjectID(info.TMOID)},{"$push" : {"related_mind_objects" : {"$ref" : "mindobject","$id" : new ObjectID(info.MOID)}}},function(err,result){
				if(err !=null){
					
				}
			});
			
		});
	});
	
	
};

this.disconnectMindObjectAndReply = function(info, requestSocketId){
	edgeCollection.remove({"$or" : [{"first_mind_object_id" : new ObjectID(info.MOID),"second_mind_object_id" : new ObjectID(info.TMOID)},
	                                {"first_mind_object_id" : new ObjectID(info.TMOID),"second_mind_object_id" : new ObjectID(info.MOID)}]}
		,function(err, result){
			if(err !=null){
				
			}
			
			mindObjectCollection.update({"_id" : new ObjectID(info.MOID)},{"$pull" : {"related_mind_objects" : {"$ref" : "mindobject","$id" : new ObjectID(info.TMOID)}}},function(err,result){
				if(err != null){
					
				}
				
				mindObjectCollection.update({"_id" : new ObjectID(info.TMOID)},{"$pull" : {"related_mind_objects" : {"$ref" : "mindobject","$id" : new ObjectID(info.MOID)}}},function(err,result){
					if(err != null){
						
					}
				});
			});
			
	});
};


this.insertMindObject = function(mindObject){	
	mindObjectCollection.insert(mindObject,function(err, result) {});
};

this.findOneMindObject = function(objectIdArray){	
	var mindObject = mindObjectCollection.findOne({_id:[objectIdArray[0],objectIdArray[1]]},function(err, result) {});
	/*
	 * var childMindMapId = mindObject.child_mind_map._id; var parentMindMapId =
	 * mindObject.parent_mind_map._id; var relatedObjects; var connectedEdges;
	 */
	
	return mindObject;
};

this.insertShape = function(shape){	
	shapeCollection.insert(shape,function(err, result) {});
};

this.insertContents = function(contents){
	contentsCollection.insert(contents,function(err, result) {});
};

this.insertEdge = function(edge){	
	edgeCollection.insert(edge,function(err, result) {});
};

this.nodeJSCallBackFunction = function(m){
	var operationType = m.operationType;
	var collectionName = m.collectionName;
	var info = m.info;
	var requestSocketId = m.requestSocketId;
	switch(operationType){
	case 0:	
		switch(collectionName){
		case MIND_MAP_COLLECTION_NAME :			
			tmdb.composeCommunicationMindMapAndReply(info.mindMapId,requestSocketId);
			break;
		default :
			break;
		}
		break;
	case 1:
		switch(collectionName){
		case MIND_OBJECT_COLLECTION_NAME :
			tmdb.createMindObjectAndReply(info,requestSocketId);
			break;
		case EDGE_COLLECTION_NAME :
			tmdb.connectMindObjectAndReply(info,requestSocketId);
			break;
		default :
			break;
		}
		break;
	case 2:
		switch(collectionName){
		case MIND_OBJECT_COLLECTION_NAME :
			tmdb.removeMindObjectAndReply(info,requestSocketId);
			break;
		case EDGE_COLLECTION_NAME :
			tmdb.disconnectMindObjectAndReply(info, requestSocketId);
			break;
		default :
			break;
		}
		break;
	case 3:
		switch(collectionName){
		case MIND_OBJECT_COLLECTION_NAME :
			tmdb.moveMindObjectAndReply(info,requestSocketId);
		}
	default:
		break;
	}
};

};

process.on('message',tmdb.nodeJSCallBackFunction);



tmdb.prepareDB();