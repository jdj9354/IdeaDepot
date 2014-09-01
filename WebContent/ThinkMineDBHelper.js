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


var dbObj = null;

var mindMapCollection = null;	
var mindObjectCollection = null;
var shapeCollection = null;
var contentsCollection = null;
var edgeCollection = null;		

var Db = null;


var composeMindMapDocument = function(_id, title, parent_mind_object, mind_objects, max_rel_distance, max_mind_object_count, limit_x, limit_y, limit_z){
	var ret = {};
	
	ret._id = _id;
	ret.title = title;
	ret.parent_mind_object = parent_mind_object;
	ret.mind_objects = mind_objects;
	ret.max_rel_distance = max_rel_distance;
	ret.max_mind_object_count = max_mind_object_count;
	ret.limit_x = limit_x;
	ret.limit_y = limit_y;
	ret.limit_z = limit_z;	
	
	return ret;
}

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
			
	
			
		
	});
	
	dbObj.open(function(err,db){
		
		if (err) {
			//sys.puts(err);
		} else {
			mindMapCollection = db.collection(MIND_MAP_COLLECTION_NAME);	
			mindObjectCollection = db.collection(MIND_OBJECT_COLLECTION_NAME);
			shapeCollection = db.collection(SHAPE_COLLECTION_NAME);
			contentsCollection = db.collection(CONTENTS_COLLECTION_NAME);
			edgeCollection = db.collection(EDGE_COLLECTION_NAME);		
		}
		
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
	
	
	

	//Compose new Root Mindmap
	if(mindMapId == ""){
		var newId = new ObjectID();		
		
		communicationMindMap.Code = CODE_MIND_MAP_REQUEST_MIND_INFO;
		communicationMindMap.MMID = newId+'';			
		communicationMindMap.TT = "No Title";
		communicationMindMap.PMOID = '';			
		communicationMindMap.CMOS = new Array();
		communicationMindMap.MAXRD = 300;
		communicationMindMap.MAXOC = 100;
		communicationMindMap.LX = 1000;
		communicationMindMap.LY = 600;
		communicationMindMap.LZ = 1000;
		
		process.send({replyRequestSocketId : requestSocketId,
				reply : {retObject : communicationMindMap}});
				
				
		var newMindMap = composeMindMapDocument(newId,
												communicationMindMap.TT,
												'',
												new Array(),
												300,
												100,
												1000,
												600,
												1000);
		
		mindMapCollection.insert(newMindMap,function(err, result) {});
		
		return;
		
	}
	
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
		communicationMindMap.TT = resultItem.title+'';
		communicationMindMap.PMOID = resultItem.parent_mind_object.oid+'';			
		communicationMindMap.CMOS = new Array();
		communicationMindMap.MAXRD = resultItem.max_rel_distance;
		communicationMindMap.MAXOC = resultItem.max_mind_object_count;
		communicationMindMap.LX = resultItem.limit_x;
		communicationMindMap.LY = resultItem.limit_y;
		communicationMindMap.LZ = resultItem.limit_z;
		
		var childCount = -1;			
		
		var loopFunction = function(err,childMindObjectInfo){
			if (err != null){
				process.send({replyRequestSocketId : requestSocketId,
				reply : {retObject : communicationMindMap}});
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
										//console.log("efef");
										//console.log(communicationMindMap.CMOS[2][13]);											
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

this.putIntoMindObjectAndReply = function(info,requestSocketId) {
	var message = {};
	message.Code = CODE_MIND_PUT_INTO;
	

	
	if(info ==null || info == undefined){
		message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
		console.log(message.retString);
		process.send({replyRequestSocketId : requestSocketId,
						reply : null});						
	}

	

	
	mindMapCollection.findOne({"_id" : new ObjectID(info.MOID)}, function(err, result){
		if(err !=null){
			message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
			message.retObject = info;
			process.send({replyRequestSocketId : requestSocketId,
						reply : message});
		}
		if(result == undefined){
			message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
			message.retObject = info;
			process.send({replyRequestSocketId : requestSocketId,
						reply : message});
		}
		console.log(result);
		if(result != null){
			putIntoHelperFunction(message,info);
		}
		else{
		
			var newMindMap = composeMindMapDocument(new ObjectID(info.DMMID),
													"No Title",
													new ObjectID(info.MMID),
													new Array(),
													300,
													100,
													1000,
													600,
													1000);
													
			mindMapCollection.insert(newMindMap,function(err,result){
				if(err !=null){
					message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
					message.retObject = info;
					process.send({replyRequestSocketId : requestSocketId,
								reply : message});
				}
				if(result == null || result == undefined){
					message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
					message.retObject = info;
					process.send({replyRequestSocketId : requestSocketId,
								reply : message});
				}
				putIntoHelperFunction(message,info);				
			});
		}
	});
	
	
	var putIntoHelperFunction = function(message, info){
		var newIdOriginMindMap = new ObjectID(info.MMID);
		var newIdMindObject = new ObjectID(info.MOID);
		var newIdDstMindMap = new ObjectID(info.DMMID);
		
		var relatedMindObjects;	
		
		var limitX;
		var limitY;
		var limitZ;
		
		var newX;
		var newY;
		var newZ;
		
		mindMapCollection.findOne({"_id" : newIdOriginMindMap}, function(err, result){
			if(err !=null){
				message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
				message.retObject = info;
				process.send({replyRequestSocketId : requestSocketId,
							reply : message});
			}
			if(result == null || result == undefined){
				message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
				message.retObject = info;
				process.send({replyRequestSocketId : requestSocketId,
							reply : message});
			}
			limitX = result.limit_x;
			limitY = result.limit_y;
			limitZ = result.limit_z;
			
			newX = parseInt(limitX * info.X);
			newY = parseInt(limitY * info.Y);
			newZ = parseInt(limitZ * info.Z);

			mindObjectCollection.findOne({"_id" : newIdMindObject}, function(err, result){
				if(err !=null){
					message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
					message.retObject = info;
					process.send({replyRequestSocketId : requestSocketId,
								reply : message});
					return;
				}
				if(result == null || result == undefined){
					message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
					message.retObject = info;
					process.send({replyRequestSocketId : requestSocketId,
								reply : message});
					return;
				}
				
				relatedMindObjects = result.related_mind_objects;
				
				mindMapCollection.update({"_id" : newIdOriginMindMap},{"$pull" : {"mind_objects" : {"$ref" : "mindobject" , "$id" : newIdMindObject}}}, function(err, result){
			
					if(err != null){
						message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
						message.retObject = info;
						process.send({replyRequestSocketId : requestSocketId,
									reply : message});
						return;
					}
							
					/*if(result == null || result == undefined){
						message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
						message.retObject = info;
						process.send({replyRequestSocketId : requestSocketId,
									reply : message});
						return;
					}*/
					
					mindMapCollection.update({"_id" : newIdDstMindMap},{"$push" : {"mind_objects" : new DBRef("mindobject", newIdMindObject)}},function(err,result){
						if(err != null){
							message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
							message.retObject = info;
							process.send({replyRequestSocketId : requestSocketId,
										reply : message});
							return;
						}
						
						
						mindObjectCollection.update({"_id" : newIdMindObject},{"$set" : {"parent_mind_map" : new DBRef("mindmap",newIdDstMindMap), 
																						"related_mind_objects" : {},
																						"x" : newX,
																						"y" : newY,
																						"z" : newZ}}, function(err,result){
							if(err != null){
								message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
								message.retObject = info;
								process.send({replyRequestSocketId : requestSocketId,
											reply : message});
								return;
							}
							edgeCollection.remove({"$or" : [{"first_mind_object_id" : new ObjectID(info.MOID)},{"second_mind_object_id" : new ObjectID(info.MOID)}]}
							,function(err, result){
								if(err !=null){
									message.retString = "Failed to put MindObject("+info.MOID+") into MindMap("+info.DMMID+")";
									message.retObject = info;
									process.send({replyRequestSocketId : requestSocketId,
												reply : message});
									return;								
								}
								
							});
							
							var queryCount = 0;
							var mutex = false;
							
							for(var i=0; i<relatedMindObjects.length; i++){
								mindObjectCollection.update({"_id" : relatedMindObjects[i].oid},{"$pull" : {"related_mind_objects" : {"$ref" : "mindobject","$id" : new ObjectID(info.MOID)}}},function (err,result){
									if(err != null){									
									}
									
									if(result == null || result == undefined){
									}
									while(mutex){
										;
									}
									mutex = true;
									queryCount++;
									mutex = false;
									console.log(queryCount);
									if(queryCount == relatedMindObjects.length){										
										message.retObject = {Code : CODE_MIND_PUT_INTO,
															 MMID : info.MMID,
															 MOID : info.MOID,
															 DMMID : info.DMMID,
															 X : newX,
															 Y : newY,
															 Z : newZ};
										
										message.retString = "Succeeded to change Parent MindMap of MindObject("+info.MOID+")";
										process.send({replyRequestSocketId : requestSocketId,
														reply : message});
										
									}
								});
							}
							
						});
					});
				});
			});
		});	

	};
};

this.removeMindObjectAndReply = function(info,requestSocketId){

	//Need to add removing Edge Info, And it should returns some object.

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
						mindObjectCollection.update({"_id" : relatedMindObjects[i].oid},{"$pull" : {"$ref" : "mindobject","$id" : new ObjectID(info.MOID)}},function (err,result){
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

this.changeMindObjectContentsAndReply = function(info, requestSocketId){
	var message = {};
	message.Code = CODE_MIND_CHANGE_VALUE_OF_CONTENTS;
	
	mindObjectCollection.findOne({"_id" : new ObjectID(info.MOID)}, function(err, result){
		if(err != null){
			message.retString = "changeMindObjectContentsAndReply : Couldn't find MindObject" + info.MOID;				
			return;
		}
		
		var contentsId = result.contents.oid;
		contentsCollection.update({"_id" : contentsId}, {"$set" : {"value" : info.CV}},function(err,result){
			if(err != null){
				message.retString = "changeMindObjectContentsAndReply : failed to update(change Contents) Contents of MindObject" + info.MOID;				
				return;
			}
			
			
			message.retString = "changeMindObjectContentsAndReply : Succeeded to update(change Contents) Contents of MindObject" + info.MOID;
			message.retObject = info;
			process.send({replyRequestSocketId : requestSocketId,
							reply : message});
		
			return;
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
	switch(m.info.Code){
	case CODE_MIND_ADD :
		tmdb.createMindObjectAndReply(info,requestSocketId);
		break;
	case CODE_MIND_DEL :
		tmdb.removeMindObjectAndReply(info,requestSocketId);
		break;
	case CODE_MIND_MOVE :
		tmdb.moveMindObjectAndReply(info,requestSocketId);
		break;
	case CODE_MIND_PUT_INTO : 
		tmdb.putIntoMindObjectAndReply(info,requestSocketId);
		break;
	case CODE_MIND_CONNECT_TO :
		tmdb.connectMindObjectAndReply(info,requestSocketId);
		break;
	case CODE_MIND_DISCONNECT_FROM :
		tmdb.disconnectMindObjectAndReply(info, requestSocketId);
		break;
	case CODE_MIND_CHANGE_COLOR_OF_CONTENTS :
		break;
	case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
		tmdb.changeMindObjectContentsAndReply(info, requestSocketId);
		break;
	case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
		break;
	case CODE_MIND_MAP_REQUEST_MIND_INFO :
		tmdb.composeCommunicationMindMapAndReply(info.MMID,requestSocketId);
		break;
	}
	/*switch(operationType){
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
			break;
		}
	default:
		break;
	}*/
};

};

process.on('message',tmdb.nodeJSCallBackFunction);



tmdb.prepareDB();
