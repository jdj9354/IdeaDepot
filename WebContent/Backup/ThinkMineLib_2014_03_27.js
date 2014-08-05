
//document.write('<script type="text/javascript" src="paper.js"></script>');


//document;




//------------------- Utility Section--------------------------------------




function addJavascript(jsname) {
	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);
}

addJavascript("/paper.js");
addJavascript("/socket.io/socket.io.js");
addJavascript("/DrawingWorker.js");
addJavascript("/EventParserWorker.js");

function compareIdValue(firstIdValue,secondIdValue){
	if(firstIdValue[0] == secondIdValue[0] && firstIdValue[1] == secondIdValue[1])
		return true;
	else
		return false;
}



//------------------- OperatonCode Section--------------------------------

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

/*const SocketCommuDelimiter = "\\";
const Nested_SocketCommuDelimiter_1 = ",";
const Nested_SocketCommuDelimiter_2 = "/";
const Nested_SocketCommuDelimiter_3 = ".";*/

const DEFAULT_TYPE_EDGE = "SimplePathEdge";

const SERVER_ADDR = "192.168.0.1";




//------------------- ThinkMineCanvas Section------------------------------

function ThinkMineCanvas(userDefinedDrawingInterface){ //MindMap객체를 가지고 이객체를 DrawingObj에개 그리도록 Data ByPass
	
	var fMindMapId;
	var fDrawingInterface = userDefinedDrawingInterface;
	var fDrawingObj = new DrawingObj(fDrawingInterface);	
	var fJobHandler = new JobHandler(fDrawingObj);	
	var fSocketHelper = new SocketHelper(fJobHandler);
	//this.fSocketHelper = new SocketHelper(fJobHandler); //Test 코드 임시로 Public으로 설정
	

	
	var fIsConnectedToServer = false;
	var fSelectedObject = null;
	var onMouseDownInterface = function(x,y,z){
		//충돌검사, 모양들 전부 inner interface로 제공 각 타입의 캔버스들이 구현해야함
		/*this.SelectedObject = null;
		if(CreatingCircle.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(0,0,0,new CircleShape(),new PictureContents("http://cfile22.uf.tistory.com/image/2432574E5215F11118F817"),x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}
		else if(CreatingEllipse.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(0,0,0,new EllipseShape(),new TextContents("ThinkTest"),x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}	
		else {
			for(i=0; i< this.MindObjects.length; i++){
				if(this.MindObjects[i].Shape.DrawingObject.contains(event.point)){
					this.SelectedObject = this.MindObjects[i];
					return;
				}
			}
		}*/
	};
	
	var onMouseUpInterface = function(x,y,z){
		
	};
	
	var onMouseDragInterface = function(x,y,z){
		
	};
	this.connectToServer = function(){		
		var ret = fSocketHelper.connectToServer();
		if(ret)
			fIsConnectedToServer = true;
		else
			fIsConnectedToServer = false;
	};
	this.disconnectFromServer = function(){
		if(fIsConnectedToServer)
			fSocketHelper.disconnectFromServer();
	};
	this.initWithMindMap = function(mindMapId){
		
		if(!fIsConnectedToServer){
			console.log("Connect To Server First");
			return;
		}
		
		fMindMapId = mindMapId;
		fSelectedObject = null;
		
		fSocketHelper.fSocketDataCommuHelperSender.mindMapRequestMindInfo(fMindMapId);
	};
	
	this.addMindObject = function(x, y, z, shape, contents){
		if(typeof(x) != "number" || typeof(y) != "number" || typeof(z) != "number"){
			console.log("ThinkMineCanvas - addMindObject Error : Input Numeric Coordinate");
			return;
		}
		
		if(!(shape instanceof Shape)){
			console.log("ThinkMineCanvas - addMindObject Error : Wrong type of Shape Obj");
			return;
		}
		else {
			if(shape.fShapeTypeDependentInfo == null || shape.fShapeTypeDependentInfo == undefined || !(shape.fShapeTypeDependentInfo instanceof ShapeTypeDependentInfo)
					|| shape.fShapeType == null || shape.fShapeType == undefined || typeof(shape.fShapeType) != "string" ){
				console.log("ThinkMineCanvas - addMindObject Error : Not sufficient Shape Member Variable");
				return;
			}
		}
		
		if(!(contents instanceof Contents)){
			console.log("ThinkMineCanvas - addMindObject Error : Wrong type of Contents Obj");
			return;
		}
		else {
			if(contents.fContentsTypeDependentInfo == null || contents.fContentsTypeDependentInfo == undefined || !(contents.fContentsTypeDependentInfo instanceof ContentsTypeDependentInfo)
					|| contents.fContentsType == null || contents.fContentsType == undefined || typeof(contents.fContentsType) != "string"
					|| contents.fValue == null || contents.fValue == undefined){
				console.log("ThinkMineCanvas - addMindObject Error : ShapeTypeDependentInfo Obj is invalid");
				return;
			}
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectCreateSend([fMindMapId[0],fMindMapId[1]],
																			x,
																			y,
																			z,
																			shape,
																			contents);
			
	};
	
	this.deleteMindObject = function(mindObjectId){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - deleteMindObject Error : mindObjectId is invalid");
			return;		
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectRemoveSend([fMindMapId[0],fMindMapId[1]],
																				[mindObjectId[0],mindObjectId[1]]);
		
	};
	
	this.moveMindObject = function(mindObjectId, x, y, z){
		if(typeof(x) != "number" || typeof(y) != "number" || typeof(z) != "number"){
			console.log("ThinkMineCanvas - moveMindObject Error : Input Numeric Coordinate");
			return;
		}
		
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - moveMindObject Error : mindObjectId is invalid");
			return;
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectMoveSend([fMindMapId[0],fMindMapId[1]],
																			[mindObjectId[0],mindObjectId[1]],
																			x,
																			y,
																			z)};
																			
	this.connectMindObject = function (srcMindObjectId, dstMindObjectId, edgeType, edgeTypeDependentInfo){
		if(srcMindObjectId == null || srcMindObjectId == undefined
			|| dstMindObjectId == null || dstMindObjectId == undefined){
			console.log("ThinkMineCanvas - connectMindObject Error : mindObjectId is invalid");
			return;
		}
		if(edgeType == null || edgeType == undefined || typeof(edgeType) != "string"){
			console.log("ThinkeMineCanvas - connectMindObject Error : edgeType is invalid");
			return;
		}
		
		if(edgeTypeDependentInfo == null || edgeTypeDependentInfo == undefined || !(edgeTypeDependentInfo instanceof EdgeTypeDependentInfo)){
			console.log("ThinkMineCanvas - connectMindObject Error : edgeTypeDependentInfo is invalid");
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectConnectToSend([fMindMapId[0],fMindMapId[1]],
																				[srcMindObjectId[0],srcMindObjectId[1]],
																				[dstMindObjectId[0],dstMindObjectId[1]], 
																				edgeType,
																				edgeTypeDependentInfo);
		
	};
	
	this.disconnectMindObject  = function (srcMindObjectId, dstMindObjectId, edgeType){
		if(srcMindObjectId == null || srcMindObjectId == undefined
				|| dstMindObjectId == null || dstMindObjectId == undefined){
				console.log("ThinkMineCanvas - disconnectMindObject Error : mindObjectId is invalid");
				return;
			}
			if(edgeType == null || edgeType == undefined || typeof(edgeType) != "string"){
				console.log("ThinkeMineCanvas - disconnectMindObject Error : edgeType is invalid");
				return;			
			}
			
			fSocketHelper.fSocketDataCommuHelperSender.mindObjectDisconnectFromSend([fMindMapId[0],fMindMapId[1]],
																							[srcMindObjectId[0],srcMindObjectId[1]],
																							[dstMindObjectId[0],dstMindObjectId[1]], 
																							edgeType);
			
	};
	
	this.changeColorOfContents = function(mindObjectId, color){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - changeColorOfContents Error : mindObjectId is invalid");
			return;		
		}
		
		if(color == null || color == undefined || typeof(color) != "string"){
			console.log("ThinkMineCanvas - changeColorOfContents Error : color is invalid");
			return;
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeColorOfContentsSend([fMindMapId[0],fMindMapId[1]],
																						 [mindObjectId[0],mindObjectId[1]],
																						 color);		
	};
	
	
	this.changeColorOfShape = function(mindObjectId, color){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - changeColorOfShape Error : mindObjectId is invalid");
			return;		
		}
		
		if(color == null || color == undefined || typeof(color) != "string"){
			console.log("ThinkMineCanvas - changeColorOfShape Error : color is invalid");
			return;
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeColorOfShapeSend([fMindMapId[0],fMindMapId[1]],
																						 [mindObjectId[0],mindObjectId[1]],
																						 color);		
	};
	
	
	this.changeDrawingInterface = function (newDrawingInterface){
		fDrawingInterface = newDrawingInterface;
	};
	
};


//------------------- MindMap Section--------------------------------------

function MindMap(mindMapId, parentMindObjectId){
	
	this.fMindMapId = mindMapId;
	this.fParentMindObjectId = parentMindObjectId;
	
	var fMindObjects = new Array();
	var fMaxRelDistance = 300;
	var fMaxMindObjectCount = 100;		

	
	/*this.setMindObjects = function(m_mindobjects){
		this.mindobjects = m_mindobjects;
	};*/
	/*this.getMindObjects = function(){
		return this.mindobjects;
	}*/ // Commented... To prevent Out of bound
	
	this.setMaxRelDistance = function(maxRelDistance){
		fMaxRelDistance = maxRelDistance;
	};
	this.getMaxRelDistance = function(){
		return fMaxRelDistance;
	};
	
	this.setMaxMindObjectCount = function(maxMindObjectCount){
		fMaxMindObjectCount = maxMindObjectCount;
	};
	this.getMaxMindObjectCount = function(){
		return fMaxMindObjectCount;
	};	
	this.pushNewMindObject = function(mindObject){
		if(fMindObjects.length == fMaxMindObjectCount)
			return false;
		else{
			fMindObjects.push(mindObject);
			return true;
		}
	};
	this.getMindObjectOnIndex = function(index){
		return fMindObjects[index];
	};
	this.removeMindObjectOnIndex = function(index){
		if(fMindObjects.length == 0 || !(index < fMindObjects.length && index >= 0))
			return false;
		else{
			fMindObjects.splice(index,1);
			return true;
		}
	};	
	this.lenOfMindObjectsArray = function() {
		return fMindObjects.length;
	};
	
};




//------------------- MindObject Section------------------------------------

function MindObject (mindObjectId, childMindMapId, parentMindMapId, shape, contents, x, y, z){
	this.fMindObjectId = mindObjectId;	
	this.fChildMindMapId = childMindMapId;
	this.fParentMindMapId = parentMindMapId;
	this.fShape = shape;			
	this.fContents = contents;	
	this.fX = x;
	this.fY = y;
	this.fZ = z;	

	var fRelatedObjects = new Array();
	var fConnectedEdges = new Array();
	

	// 그리는 부분들 지워야됨
	
	
	/*this.setRelatedObjects = function(m_related_objects){
		this.related_objects = m_related_objects;		
	};*/
	/*this.getRelatedObjects = function(){
		return this.related_objects;
	};*/	
	this.pushNewRelatedObject = function(relatedObject){
		fRelatedObjects.push(relatedObject);
	};
	this.getRelatedObjectOnIndex = function(index){
		return fRelatedObjects[index];
	};
	this.removeRelatedObjectOnIndex = function(index){
		fRelatedObjects.splice(index,1);
	
	};	
	this.lenOfRelatedObjectsArray = function() {
		return fRelatedObjects.length;
	};
	
	
	/*this.setConnectedEdges = function(m_connected_edges){
		this.connected_edges = m_connected_edges;
	};*/	
	/*this.getConnectedEdges = function(){
		return this.connected_edges;
	};*/
	this.pushNewConnectedEdge = function(connectedEdge){
		fConnectedEdges.push(connectedEdge);
	};
	this.getConnectedEdgeOnIndex = function(index){
		return fConnectedEdges[index];
	};
	this.removeConnectedEdgeOnIndex = function(index){
		fConnectedEdges.splice(index,1);
	
	};	
	this.lenOfConnectedEdgesArray = function() {
		return fConnectedEdges.length;
	};
	
	
	
	this.removeMindObject = function(){
		for(var i=0; i<fRelatedObjects.length; i++){
			for(var j=0; j<fRelatedObjects[i].lenOfRelatedObjectsArray();j++){
				if(fRelatedObjects[i].getRelatedObjectOnIndex(j) == this){
					fRelatedObjects[i].removeRelatedObjectOnIndex(j);
					break;
				}
			}	
			for(var j=0; j<fRelatedObjects[i].lenOfConnectedEdgesArray();j++){
				if(fRelatedObjects[i].getConnectedEdgeOnIndex(j).indexOfComponent(this) != -1){
					fRelatedObjects[i].removeConnectedEdgeOnIndex(j);
					break;
				}
			}
			this.removeRelatedObjectOnIndex(i);					
		}
		
		for(var i=0; i<fConnectedEdges.length; i++){
			//this.ConnectedEdges[i].EraseEdge();
			this.removeConnectedEdgeOnIndex(i);
		}
		
	//	this.EraseMindObject();
		this.fMindObjectId = null;	
		this.fChildMindMapId = null;
		this.fParentMindMapId = null;
		this.fShape = null;
		this.fContents = null;	
		this.fRelatedObjects = null;
		this.fConnectedEdges = null;
	};
	this.moveMindObject = function(x, y, z){		
		
		fX = x;
		fY = y;
		fZ = z;

		
	};	
	this.connectTo = function(connectingMindObject, edgeType, edgeTypeDependentInfo){
		if(fRelatedObjects.indexOf(connectingMindObject) != -1)
			return;
		
		fRelatedObjects.push(connectingMindObject);
		connectingMindObject.pushNewRelatedObject(this);
		
		var newEdge = new Edge(this, connectingMindObject, edgeType, edgeTypeDependentInfo);		
		
		fConnectedEdges.push(newEdge);
		connectingMindObject.pushNewConnectedEdge(newEdge);		

		
	};


		
	
	this.disconnectFrom = function(targetMindObject){
		
		if(fRelatedObjects.indexOf(targetMindObject) == -1)
			return;
		
		for(var i=0; i<fRelatedObjects.length; i++){
			if(fRelatedObjects[i] == targetMindObject){
				fRelatedObjects.splice(i,1);
				break;
			}
		}
		
		for(var i=0; i<targetMindObject.lenOfRelatedObjectsArray(); i++){
			if(targetMindObject.getRelatedObjectOnIndex(i) == this){
				targetMindObject.removeRelatedObjectOnIndex(i);
				break;
			}
		}
		
		var targetEdge;
		
		for(var i=0; i<fConnectedEdges.length; i++){
			if(fConnectedEdges[i].indexOfComponent(this) != -1 && fConnectedEdges[i].indexOfComponent(targetMindObject) != -1) {
				targetEdge = fConnectedEdges[i];
				fConnectedEdges.splice(i,1);
				break;
			}
		}
		for(var i=0; i<targetMindObject.lenOfConnectedEdgesArray(); i++){
			if(targetMindObject.getConnectedEdgeOnIndex(i) == targetEdge){
				targetMindObject.removeConnectedEdgeOnIndex(i);
				break;
			}
		}
		
		if(targetEdge != null)	{
			//TargetEdge.EraseEdge();
			targetEdge.fFirstMindObject = null;
			targetEdge.fSecondMindObject = null;					
		}
	};
	

	this.changeColorOfContents = function(color){
		this.fContents.fColor = color;
	};
	this.changeContents = function(contents){
		this.fContents = contents;
	};
	this.changeColorOfShape = function(color){
		this.fShape.fColor = color;
	};
	this.changeShape = function(shape){
		this.fShape = shape;
	};
	this.putInto = function(mindMap){
		
	};
	this.pullFrom = function(mindMap){
		
	};
}


//------------------- Edge Section------------------------------------

function Edge(firstMindObject, secondMindObject, edgeType, edgeTypeDependentInfo){	
	this.fFirstMindObject = firstMindObject;
	this.fSecondMindObject = secondMindObject;
	this.fEdgeType = edgeType;
	this.fEdgeTypeDependentInfo = edgeTypeDependentInfo;
		
	this.indexOfComponent = function(mindObject){
		if (this.fFirstMindObject == mindObject)
			return 0;
		else if(this.fSecondMindObject == mindObject)
			return 1;
		else
			return -1;
	};
	this.isEqual = function(edge){
		if((this.fFirstMindObject == edge.fFirstMindObject && this.fSecondMindObject == edge.fSecondMindObject)
			|| (this.fSecondMindObject == edge.fFirstMindObject && this.fFirstMindObject == edge.fSecondMindObject))
			return true;
		else
			return false;
		
	};
}

function EdgeTypeDependentInfo(){
	
}

function SimplePathEdgeTypeDependentInfo(width, color){
	this.fWidth = width;
	this.fColor = color;
}
SimplePathEdgeTypeDependentInfo.prototype = new EdgeTypeDependentInfo();
SimplePathEdgeTypeDependentInfo.constructor = SimplePathEdgeTypeDependentInfo;



//------------------- Shape Section------------------------------------



function Shape (shapeType, shapeTypeDependentInfo){	
	this.fShapeType = shapeType;	
	this.fShapeTypeDependentInfo = shapeTypeDependentInfo;
}

function ShapeTypeDependentInfo() {
	
}

function CircleShapeTypeDependentInfo(radius, color){
	this.fRadius = radius;
	this.fColor = color;
}
CircleShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
CircleShapeTypeDependentInfo.constructor = CircleShapeTypeDependentInfo; 


//------------------- Contents Section------------------------------------



function Contents(contentsType, contentsTypeDependentInfo, value){
	this.fContentsType = contentsType;
	this.fContentsTypeDependentInfo = contentsTypeDependentInfo;
	this.fValue = value;	
}

function ContentsTypeDependentInfo(){
	
}

function TextContentsTypeDependentInfo(color, fontFamily, fontWeight, fontSize){
	this.fColor = color;
	this.fFontFamily = fontFamily;
	this.fFontWeight = fontWeight;
	this.fFontSize = fontSize;
}

TextContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
TextContentsTypeDependentInfo.constructor = TextContentsTypeDependentInfo;

//------------------- Decoder/Encoder Section -------------------------------

function Encoder(){
	this.encodeShapeType = function(shapeType){
		var ret;
		switch (shapeType){
		case "CircleShape" :
			ret = 16777216;
			break;
		default :
			ret = 0;
			break;		
		}
		return ret;
	}
	this.encodeContentsType = function(contentsType){
		var ret;
		switch(contentsType){
		case "TextContents" :
			ret = 16777216;
			break;
		case "ImageContents" :
			ret = 33554432;
			break;
		case "SoundContents" :
			ret = 50331648;
			break;
		case "MovieContents" :
			ret = 67108864;
			break;
		default :
			ret = 0;
			break;		
		}
		return ret;
	}
	this.encodeEdgeType = function(edgeType){
		var ret;
		switch (edgeType){
		case "SimplePathEdge" :
			ret = 16777216;
			break;
		default :
			ret = 0;
			break;		
		}
		return ret;
	}
}

function Decoder(){
	this.decodeShapeType = function(shapeType){
		var ret;
		switch (shapeType){
		case 16777216 :
			ret = "CircleShape";
			break;
		default :
			ret = null;
			break;		
		}
		return ret;
	}
	this.decodeContentsType = function(contentsType){
		var ret;
		switch(contentsType){
		case 16777216 :
			ret = "TextContents";
			break;
		case 33554432 :
			ret = "ImageContents";
			break;
		case 50331648 :
			ret = "SoundContents";
			break;
		case 67108864 :
			ret = "MovieContents";
			break;
		default :
			ret = null;
			break;		
		}
		return ret;
	}
	this.decodeEdgeType = function(edgeType){
		var ret;
		switch (edgeType){
		case 16777216 :
			ret = "SimplePathEdge";
			break;
		default :
			ret = null;
			break;		
		}
		return ret;
	}
}

//------------------- JobHandler Section--------------------------------------

function JobHandler(drawingObj){	
	var fJobQ = null;	
	var fWorker = null;
	var fIsStarted = false;
	var fMutexLocked = false;
	var fMindMap = null;
	var fDrawingObj = drawingObj;
	var fEncoder = new Encoder();
	var fDecoder = new Decoder();
	this.resetJobHandler = function(){

		
		if(this.fIsStarted){
			this.fWorker.terminate();			
			this.fWorker = null;			
		}
		
		fJobQ = null;
		fJobQ = new Array();
		
		fMutexLocked = false;
		
		fMindMap = null;
		
		this.startEventLoop();
		
		fDrawingObj.resetDrawingObj();
	};
	this.pushNewJob = function(newJob){
		/*while(fMutexLocked){			
			;
		}*/		
		//fMutexLocked = true;		
		fJobQ.push(newJob);		
		//fMutexLocked = false;
	};
	
	//각각의 모듈 함수화 필요
	
	var handleEventCode = function(eventCode){		
		//var EventCodeArray = EventCode.split(SocketCommuDelimiter);		
		switch (eventCode.Code) {
		
		case CODE_MIND_MAP_REQUEST_MIND_INFO :  //private 함수화 필요
			handleMindMapRequestEvent(eventCode);			
			break;
		case CODE_MIND_ADD :
			handleMindObjectAddEvent(eventCode);			
			break;
		case CODE_MIND_DEL :			
			handleMindObjectDelEvent(eventCode);			
			break;
		case CODE_MIND_MOVE :
			handleMindObjectMoveEvent(eventCode);			
			break;
		case CODE_MIND_PUT_INTO :
			break;
		case CODE_MIND_PULL_OUT :
			break;
		case CODE_MIND_CONNECT_TO :
			handleMindObjectConnectToEvent(eventCode);			
			break;
		case CODE_MIND_DISCONNECT_FROM :
			handleMindObjectDisconnectFromEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_COLOR_OF_CONTENTS :
			handleChangeColorOfContentsEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			break;
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
			handleChangeColorOfShapeEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_SHAPE :
			break;
		case CODE_MIND_CHANGE_PARENT_MIND_MAP :
			break;
		default :
			break;		
		}
		return 1;
		//나중에 표준을 정해서 구현  파싱 Event Code에 대한 파싱
	};
	
	var handleMindMapRequestEvent = function(eventCode){
		if(fMindMap != null)
			return;
					
		var mindMapTemp = new MindMap(-1,-1);			
		var mindMapId = [eventCode.Var1,eventCode.Var2];					
		var parentMindObjectId = [eventCode.Var3,eventCode.Var4];
					
		var mindObjectsArrayForDrawing = new Array();
		var edgesArrayForDrawing = new Array();
		
		var relatedMindObjectsInfoArray = new Array();			
		
		
		for(var i=0; i<eventCode.Var5.length;i++){				
			
			var tempMindObjectId = [eventCode.Var5[i][0],eventCode.Var5[i][1]];
			var tempChildMindMapId = [eventCode.Var5[i][2],eventCode.Var5[i][3]];					
			
			
			
			
			var x = eventCode.Var5[i][4];							
			var y = eventCode.Var5[i][5];				
			var z = eventCode.Var5[i][6];				
			
			
			
			
			var tempShapeType = fDecoder.decodeShapeType(eventCode.Var5[i][7]);				
			var tempShapeTypeDependentInfo;
			
			var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.Var5[i][7]);
			var tempShapeTypeDependentInfoForDrawing;
			
			
							
			tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType, eventCode.Var5[i][8]);						
			tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeType, eventCode.Var5[i][8]);
							
			
			var tempShape = new Shape(tempShapeType, tempShapeTypeDependentInfo);				
			var tempShapeForDrawing = new Shape(tempShapeTypeForDrawing, tempShapeTypeDependentInfoForDrawing);
			
			
			var tempContentsType = fDecoder.decodeContentsType(eventCode.Var5[i][9]);				
			var tempContentsTypeDependentInfo;
			
			var tempContentsTypeForDrawing = fDecoder.decodeContentsType(eventCode.Var5[i][9]);				
			var tempContentsTypeDependentInfoForDrawing;
			
			tempContentsTypeDependentInfo = getObjTypeDependentInfo(tempContentsType, eventCode.Var5[i][10]);
			tempContentsTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempContentsType, eventCode.Var5[i][10]);
			
			
			var tempContentsValue = eventCode.Var5[i][11];
			var tempContents = new Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);
			
			var tempContentsValueForDrawing = eventCode.Var5[i][11];
			var tempContentsForDrawing = new Contents(tempContentsTypeForDrawing, tempContentsTypeDependentInfoForDrawing, tempContentsValueForDrawing);
			
			
			var tempRelatedMindObjects = eventCode.Var5[i][12];								
			var tempMindObject = new MindObject(tempMindObjectId, tempChildMindMapId, mindMapId, tempShape, tempContents , x, y, z);
			
			mindMapTemp.pushNewMindObject(tempMindObject);
			relatedMindObjectsInfoArray.push(tempRelatedMindObjects);
			
			var tempMindObjectForDrawing = {fX : tempMindObject.fX,
											fY : tempMindObject.fY,
											fZ : tempMindObject.fZ,
											fShape : tempShapeForDrawing,
											fContents : tempContentsForDrawing,
											fMindObjectId : [tempMindObject.fMindObjectId[0],tempMindObject.fMindObjectId[1]]							
											};
			
			mindObjectsArrayForDrawing.push(tempMindObjectForDrawing);
			
		}
		
		var maxRelDistance = eventCode.Var6;
		var maxMindObjectCount = eventCode.Var7;
		
		
		//MaxRelDistance,MaxObjectCount 처리, 연관 마인드 오브젝트 커넥트 처리
		
		//Related Objects
		for(var i=0; i<relatedMindObjectsInfoArray.length; i++){
			var relatedMindObjectsInfo = relatedMindObjectsInfoArray[i];
			for(var j=0; j<relatedMindObjectsInfo.length; j+=4){
				var isExsist = false;					
				for(var k=0; k<mindMapTemp.getMindObjectOnIndex(i).lenOfRelatedObjectsArray(); k++){						
					if(compareIdValue([relatedMindObjectsInfo[j],relatedMindObjectsInfo[j+1]],
							mindMapTemp.getMindObjectOnIndex(i).getRelatedObjectOnIndex(k).fMindObjectId)){
						isExsist = true;							
						break;
					}
				}
				if(!isExsist){						
					var connectingObj = null;
					
					for(var k=0; k<mindMapTemp.lenOfMindObjectsArray(); k++){
						if(compareIdValue([relatedMindObjectsInfo[j],relatedMindObjectsInfo[j+1]],
								mindMapTemp.getMindObjectOnIndex(k).fMindObjectId)){
							connectingObj = mindMapTemp.getMindObjectOnIndex(k);
							break;
						}
					}
					if(connectingObj != mindMapTemp.getMindObjectOnIndex(i) && connectingObj != null){
						var tempEdgeType = fDecoder.decodeEdgeType(relatedMindObjectsInfo[j+2]);							
						var tempEdgeTypeDependentInfo;
						
						var tempEdgeTypeForDrawing = fDecoder.decodeEdgeType(relatedMindObjectsInfo[j+2]);							
						var tempEdgeTypeDependentInfoForDrawing;		
						
						tempEdgeTypeDependentInfo = getObjTypeDependentInfo(tempEdgeType, relatedMindObjectsInfo[j+3]);
						tempEdgeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempEdgeType, relatedMindObjectsInfo[j+3]);
						
						mindMapTemp.getMindObjectOnIndex(i).connectTo(connectingObj, tempEdgeType, tempEdgeTypeDependentInfo);
						
						var tempEdgeForDrawing = {fFirstMindObject : {fX : mindMapTemp.getMindObjectOnIndex(i).fX,
																	  fY : mindMapTemp.getMindObjectOnIndex(i).fY,
																	  fZ : mindMapTemp.getMindObjectOnIndex(i).fZ,
																	  fMindObjectId : [mindMapTemp.getMindObjectOnIndex(i).fMindObjectId[0], mindMapTemp.getMindObjectOnIndex(i).fMindObjectId[1]]							
																	},
													fSecondMindObject : {fX : connectingObj.fX,
																		 fY : connectingObj.fY,
																		 fZ : connectingObj.fZ,
																		 fMindObjectId : [connectingObj.fMindObjectId[0], connectingObj.fMindObjectId[1]]							
																		},
													fEdgeType : tempEdgeTypeForDrawing,
													fEdgeTypeDependentInfo : tempEdgeTypeDependentInfoForDrawing
												};
						
						edgesArrayForDrawing.push(tempEdgeForDrawing);
						
					}
				}				
			}
		}
		mindMapTemp.fMindMapId = mindMapId;			
		mindMapTemp.fParentMindObjectId = parentMindObjectId;
		mindMapTemp.fMaxRelDistance = maxRelDistance;
		mindMapTemp.fMaxMindObjectCount = maxMindObjectCount;
		
		fMindMap = mindMapTemp;
		
		var drawingJob = new Array();
		drawingJob.push(CODE_MIND_MAP_REQUEST_MIND_INFO);
		drawingJob.push(mindObjectsArrayForDrawing);
		drawingJob.push(edgesArrayForDrawing);
		fDrawingObj.pushNewJob(drawingJob);
	};
	
	var handleMindObjectAddEvent = function(eventCode){
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4]))
				return;
		}
		
		var tempShape;
		var tempShapeType = fDecoder.decodeShapeType(eventCode.Var8);
		var tempShapeTypeDependentInfo;
		
		var tempShapeForDrawing;
		var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.Var8);
		var tempShapeTypeDependentInfoForDrawing;	
		
		
		tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType, eventCode.Var9);						
		tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeType, eventCode.Var9);			

		
		tempShape = new Shape(tempShapeType, tempShapeTypeDependentInfo);
		tempShapeForDrawing = new Shape(tempShapeTypeForDrawing, tempShapeTypeDependentInfoForDrawing);
					
		var tempContents;
		var tempContentsType = fDecoder.decodeContentsType(eventCode.Var10);
		var tempContentsTypeDependentInfo;
		var tempContentsValue = eventCode.Var12;
		
		var tempContentsForDrawing;
		var tempContentsTypeForDrawing = fDecoder.decodeContentsType(eventCode.Var10);
		var tempContentsTypeDependentInfoForDrawing;
		var tempContentsValueForDrawing = ""+eventCode.Var12;	
		
		
		tempContentsTypeDependentInfo = getObjTypeDependentInfo(tempContentsType, eventCode.Var11);
		tempContentsTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempContentsType, eventCode.Var11);

		
		tempContents = new Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);
		
		tempContentsForDrawing = new Contents(tempContentsTypeForDrawing, tempContentsTypeDependentInfoForDrawing, tempContentsValueForDrawing);
		
		var tempMindObject = new MindObject ([eventCode.Var3,eventCode.Var4],							//MindObjectID1,2
												[0,0],												//ChildMindMapID1,2
												[eventCode.Var1,eventCode.Var2],					//MindMapID1,2
												tempShape,											//Shape
												tempContents,										//Contents
												eventCode.Var5,										//x
												eventCode.Var6,										//y
												eventCode.Var7										//z
												);
		fMindMap.pushNewMindObject(tempMindObject);
		
		var tempMindObjectForDrawing = {fX : tempMindObject.fX,
										fY : tempMindObject.fY,
										fZ : tempMindObject.fZ,
										fShape : tempShapeForDrawing,
										fContents : tempContentsForDrawing,
										fMindObjectId : [tempMindObject.fMindObjectId[0],tempMindObject.fMindObjectId[1]]							
										};
		var drawingJob = new Array();
		drawingJob.push(CODE_MIND_ADD);
		drawingJob.push(tempMindObjectForDrawing);
		fDrawingObj.pushNewJob(drawingJob);		
	};
	
	var handleMindObjectDelEvent = function(eventCode){
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4])) {
				
				var tempDelMindObject = fMindMap.getMindObjectOnIndex(i);
				
				tempShapeType = "" + tempDelMindObject.fShape.fShapeType;
				tempContentsType = "" + tempDelMindObject.fContents.fContentsType;
				
				tempShapeTypeForDrawing = "" + tempDelMindObject.fShape.fShapeType;
				tempContentsTypeForDrawing = "" + tempDelMindObject.fContents.fContentsType;
				
				var tempDelMindObjectInfoForDrawing = {fShape : {fShapeType : tempShapeTypeForDrawing},
														fContents : {fContentsType : tempContentsTypeForDrawing},
														fMindObjectId : [tempDelMindObject.fMindObjectId[0], tempDelMindObject.fMindObjectId[1]]									
													};
				
				var tempDelEdgeInfoArrayForDrawing = new Array();
				
				for(var j=0; j<tempDelMindObject.lenOfConnectedEdgesArray(); j++){
					var tempDelEdge = tempDelMindObject.getConnectedEdgeOnIndex(j);
					
					tempDelEdgeInfoForDrawing = {fFirstMindObject : {fMindObjectId : [tempDelEdge.fFirstMindObject.fMindObjectId[0], tempDelEdge.fFirstMindObject.fMindObjectId[1]]},
													fSecondMindObject : {fMindObjectId : [tempDelEdge.fSecondMindObject.fMindObjectId[0], tempDelEdge.fSecondMindObject.fMindObjectId[1]]},
													fEdgeType : tempDelEdge.fEdgeType
												};
					
					tempDelEdgeInfoArrayForDrawing.push(tempDelEdgeInfoForDrawing);
				}
				
				fMindMap.getMindObjectOnIndex(i).removeMindObject();
				fMindMap.removeMindObjectOnIndex(i);
				
				var drawingJob = new Array();
				drawingJob.push(CODE_MIND_DEL);
				drawingJob.push(tempDelMindObjectInfoForDrawing);
				drawingJob.push(tempDelEdgeInfoArrayForDrawing);
				
				fDrawingObj.pushNewJob(drawingJob);					
				
				break;
			}
		}
		
	};
	
	var handleMindObjectMoveEvent = function(eventCode){
		var tempEdgeArrayForDrawing = new Array();
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4])){
				
				
				var tempShapeType = "" + fMindMap.getMindObjectOnIndex(i).fShape.fShapeType;
				var tempContentsType = "" + fMindMap.getMindObjectOnIndex(i).fContents.fContentsType;
				
				fMindMap.getMindObjectOnIndex(i).fX = eventCode.Var5;
				fMindMap.getMindObjectOnIndex(i).fY = eventCode.Var6;
				fMindMap.getMindObjectOnIndex(i).fZ = eventCode.Var7;
				
				tempMindObjectForDrawing = {fMindObjectId : [eventCode.Var3,eventCode.Var4],
											fX : eventCode.Var5,
											fY : eventCode.Var6,
											fZ : eventCode.Var7,
											fShape : {fShapeType : tempShapeType},
											fContents : {fContentsType : tempContentsType}												
											};
				

				for(var j=0; j<fMindMap.getMindObjectOnIndex(i).lenOfConnectedEdgesArray(); j++){
					
					
					
					var tempEdgeForDrawing = {fEdgeType : "" + fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fEdgeType , 
											  fFirstMindObject : {fMindObjectId : [fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId[0] , 
											                                       fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId[1]]} ,
					                          fSecondMindObject : {fMindObjectId : [fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId[0] , 
						                                             fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId[1]]}
					
											};
					
					tempEdgeArrayForDrawing.push(tempEdgeForDrawing);
				}
				
				fDrawingObj.pushNewJob([CODE_MIND_MOVE,
				                        tempMindObjectForDrawing,
				                        tempEdgeArrayForDrawing]);
				
				break;
			}
		}
	};
	
	var handleMindObjectConnectToEvent = function(eventCode){
		var originMindObject = null;
		var targetMindObject = null;
		var tempEdgeType;
		var tempEdgeTypeDependentInfo;
		
		var originMindObjectForDrawing = null;
		var targetMindObjectForDrawing = null;
		var tempEdgeTypeForDrawing;
		var tempEdgeTypeDependentInfoForDrawing;
		var tempEdgeForDrawing;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId, [eventCode.Var3, eventCode.Var4])){
				originMindObject = fMindMap.getMindObjectOnIndex(i);
			}
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId, [eventCode.Var5, eventCode.Var6])){
				targetMindObject = fMindMap.getMindObjectOnIndex(i);
			}
		}
		if(originMindObject == null || targetMindObject == null)
			return;
		
		for(var i=0; i< originMindObject.lenOfRelatedObjectsArray(); i++){
			if(compareIdValue(originMindObject.getRelatedObjectOnIndex(i).fMindObjectId,targetMindObject.fMindObjectId))
				return;
		}
		
		tempEdgeType = eventCode.Var7;
		tempEdgeTypeForDrawing = eventCode.Var7; 			
		
		
		tempEdgeTypeDependentInfo = getObjTypeDependentInfo(tempEdgeType, eventCode.Var8);
		tempEdgeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempEdgeType, eventCode.Var8);
		
		
		
		originMindObject.connectTo(targetMindObject, tempEdgeType, tempEdgeTypeDependentInfo);

		originMindObjectForDrawing = {fX : originMindObject.fX ,
										fY : originMindObject.fY ,
										fZ : originMindObject.fZ ,
										fMindObjectId : [originMindObject.fMindObjectId[0], originMindObject.fMindObjectId[1]]
									};
		targetMindObjectForDrawing = {fX : targetMindObject.fX ,
										fY : targetMindObject.fY ,
										fZ : targetMindObject.fZ ,
										fMindObjectId : [targetMindObject.fMindObjectId[0], targetMindObject.fMindObjectId[1]]
									};
		
		tempEdgeForDrawing = {fFirstMindObject : originMindObjectForDrawing,
								fSecondMindObject : targetMindObjectForDrawing,
								fEdgeType : tempEdgeTypeForDrawing,
								fEdgeTypeDependentInfo : tempEdgeTypeDependentInfoForDrawing					
								};
		
		fDrawingObj.pushNewJob([CODE_MIND_CONNECT_TO,
		                        tempEdgeForDrawing
		                        ]);
	};
	
	var handleMindObjectDisconnectFromEvent = function(eventCode){
		var originMindObject = null;
		var targetMindObject = null;
		var targetEdge = null;
	
		var tempEdgeForDrawing;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4])){
				originMindObject = fMindMap.getMindObjectOnIndex(i);
				break;
			}		
		}
		
		if(originMindObject == null)
			return;
		
		for(var i=0; i<originMindObject.lenOfConnectedEdgesArray(); i++){
			var currentEdge = originMindObject.getConnectedEdgeOnIndex(i);

			if(compareIdValue([eventCode.Var5,eventCode.Var6],currentEdge.fFirstMindObject.fMindObjectId)){
				targetEdge = currentEdge;
				targetMindObject = currentEdge.fFirstMindObject;
				break;
			}
			if (compareIdValue([eventCode.Var5,eventCode.Var6],currentEdge.fSecondMindObject.fMindObjectId)){
				targetEdge = currentEdge;
				targetMindObject = currentEdge.fSecondMindObject;
				break;
			}				
		}
		
		if(targetEdge == null)
			return;
		
		originMindObject.disconnectFrom(targetMindObject);

		tempEdgeForDrawing = {fEdgeType : ""+targetEdge.fEdgeType,
								fFirstMindObject : {fMindObjectId : [originMindObject.fMindObjectId[0], originMindObject.fMindObjectId[1]]},
								fSecondMindObject : {fMindObjectId : [targetMindObject.fMindObjectId[0], targetMindObject.fMindObjectId[1]]}
							};
		

		
		
		fDrawingObj.pushNewJob([CODE_MIND_DISCONNECT_FROM,
									tempEdgeForDrawing]);		
	};
	
	var handleChangeColorOfContentsEvent = function(eventCode){
		
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4])){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor == undefined)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor = eventCode.Var5;
		
		var tempMindObjectForDrawing = {fContents : {fContentsType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsType},
										fMindObjectId : [fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId[0], fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId[1]]						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_COLOR_OF_CONTENTS,
		                        tempMindObjectForDrawing,
		                        ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor
		                        ]);
		
		
	};
	
	var handleChangeColorOfShapeEvent = function(eventCode){
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,[eventCode.Var3,eventCode.Var4])){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor == undefined)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor = eventCode.Var5;
		
		var tempMindObjectForDrawing = {fShape : {fShapeType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeType},
										fMindObjectId : [fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId[0], fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId[1]]						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_COLOR_OF_SHAPE,
		                        tempMindObjectForDrawing,
		                        ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor
		                        ]);
		
	};

	var handleLatestJob = function(){
		if(fJobQ.length == 0 || fMutexLocked == true)
			return;
		fMutexLocked = true;
		var latestJob = fJobQ[0];
		fJobQ.splice(0,1);
		var ret = handleEventCode(latestJob);
		if(ret == 0){
			//오류 메세지 출력 및 MindMap 재 초기화
		}
		fMutexLocked = false;
	};
	
	this.startEventLoop = function(){
		fIsStarted = true;
		fWorker = new Worker("EventParserWorker.js");
		
		var callBackInterface = handleLatestJob;
		fWorker.onmessage = function (event){
			callBackInterface();
		};
	};
	
	var getObjTypeDependentInfo = function(type, parameterArray){
		var ret;
		switch (type){
		case "CircleShape" :
			ret = new CircleShapeTypeDependentInfo(parameterArray[0], parameterArray[1]);
			break;
		case "TextContents" :
			ret = new TextContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
			break;
		case "SimplePathEdge" :
			ret = new SimplePathEdgeTypeDependentInfo(parameterArray[0], parameterArray[1]);
			break;
		}
		return ret;
	};
}

//------------------- SocketCommunication Section--------------------------------------

function SocketHelper(jobHandler) {
	
	var fJobHandler = jobHandler;
	var fWSocket = null;
	this.fSocketDataCommuHelperSender;
	this.fSocketDataCommuHelperRecv;
	this.connectToServer = function(){
		fWSocket = io.connect();
		
		if(fWSocket == null){
			console.log("Failed to connect to Server");
			return false;
		}
		
		this.fSocketDataCommuHelperSender = new SocketDataCommuHelperSender(fJobHandler, fWSocket);
		this.fSocketDataCommuHelperRecv = new SocketDataCommuHelperRecv(fJobHandler, fWSocket);
		
		var callBackInterface = this.fSocketDataCommuHelperRecv;
		
		
		fWSocket.on('NewEvent',function(e){
			//var InfoString = e.toString();
			//var OpCodeString =  InfoString.substring(0,InfoString.indexOf(SocketCommuDelimiter));			
			if(e.Code == CODE_MIND_MAP_REQUEST_MIND_INFO){
				callBackInterface.onLoadMindMapRecv(e);
			}
			else{
				callBackInterface.onGetLatestEventRecv(e);
			}
	
					
		});

		
		console.log("Succeeded to connect to Server");
		return true;
	};
	this.disconnectFromServer = function(){
		fWSocket.disconnect();
		fWSocket = null;
		this.fSocketDataCommuHelperSender.setWSocket(null);
		this.fSocketDataCommuHelperRecv.setWSocket(null);
	};

}

function SocketDataCommuHelperSender (jobHandler,wSocket) {
	var fJobHandler  = jobHandler;	
	var fWSocket = wSocket;
	var fEncoder = new Encoder();
	var fDecoder = new Decoder();
	
	this.setWSocket = function (wSocket){
		fWSocket = wSocket;
	};
	this.getWSocket = function (){
		return fWSocket;
	};
	
	this.mindObjectCreateSend = function(mindMapId, x, y, z, shape, contents){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelper_Sender : Object is not Initialized");
			return;
		}
		
		var tempShapeType = shape.fShapeType;
		var tempShapeTypeDependentInfo = shape.fShapeTypeDependentInfo;
		var tempShapeTypeDependentInfoArray;
		
		
		
		
		tempShapeTypeDependentInfoArray = genArrayForCommu(tempShapeType, tempShapeTypeDependentInfo);
		
		if(tempShapeTypeDependentInfoArray == null){			
			console.log("SocketDataCommuHelperSender - mindObjectCreateSend : There is no matched type");			
			return;
		}
		
		
		
		var tempContentsType = contents.fContentsType;
		var tempContentsTypeDependentInfo = contents.fContentsTypeDependentInfo;
		var tempContentsTypeDependentInfoArray;
		var tempContentsValue = contents.fValue;
		
		
		
		
		tempContentsTypeDependentInfoArray = genArrayForCommu(tempContentsType, tempContentsTypeDependentInfo);
		
		if(tempContentsTypeDependentInfoArray == null){			
			console.log("SocketDataCommuHelperSender - mindObjectCreateSend : There is no matched type");			
			return;
		}
		
		
		
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_ADD,
									Var1 : mindMapId[0],
									Var2 : mindMapId[1],
									Var3 : x,
									Var4 : y,
									Var5 : z,
									Var6 : fEncoder.encodeShapeType(tempShapeType),
									Var7 : tempShapeTypeDependentInfoArray,
									Var8 : fEncoder.encodeContentsType(tempContentsType),
									Var9 : tempContentsTypeDependentInfoArray,
									Var10 : tempContentsValue});		
		
	};
	this.mindObjectRemoveSend = function(mindMapId,mindObjectId){		
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_DEL,
										Var1 : mindMapId[0],
										Var2 : mindMapId[1],
										Var3 : mindObjectId[0],
										Var4 : mindObjectId[1]});
	};
	this.mindObjectMoveSend = function(mindMapId, mindObjectId, x, y, z){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_MOVE,
									Var1 : mindMapId[0],
									Var2 : mindMapId[1],
									Var3 : mindObjectId[0],
									Var4 : mindObjectId[1],
									Var5 : x,
									Var6 : y,
									Var7 : z});		
		
	};
	this.mindObjectPutIntoSend = function(mindMapId, mindObjectId, destinationMindMapId, x, y, z){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		
		fWSocket.emit('NewEvent',SendInfo);
	};
	this.mindObjectPullOutSend = function(mindMapId, mindObjectId, parentMindMapId, x, y, z){	
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		
		fWSocket.emit('NewEvent',SendInfo);
	};
	this.mindObjectConnectToSend = function(mindMapId, mindObjectId, targetMindObjectId, edgeType, edgeTypeDependentInfo){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		var tempEdgeType = edgeType;
		var tempEdgeTypeDependentInfoArray;
		
		
		tempEdgeTypeDependentInfoArray = genArrayForCommu(tempEdgeType, edgeTypeDependentInfo);
		
		if(tempEdgeTypeDependentInfoArray == null){			
			console.log("SocketDataCommuHelperSender - mindObjectConnectToSend : There is no matched type");			
			return;
		}		

		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_CONNECT_TO,
									Var1 : mindMapId[0],
									Var2 : mindMapId[1],
									Var3 : mindObjectId[0],
									Var4 : mindObjectId[1],
									Var5 : targetMindObjectId[0],
									Var6 : targetMindObjectId[1],
									Var7 : tempEdgeType,
									Var8 : tempEdgeTypeDependentInfoArray});	
		
		
	};
	this.mindObjectDisconnectFromSend = function(mindMapId, mindObjectId, targetMindObjectId, edgeType){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}		
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_DISCONNECT_FROM,
									Var1 : mindMapId[0],
									Var2 : mindMapId[1],
									Var3 : mindObjectId[0],
									Var4 : mindObjectId[1],
									Var5 : targetMindObjectId[0],
									Var6 : targetMindObjectId[1],
									Var7 : edgeType});	
	};
	this.mindObjectChangeColorOfContentsSend = function(mindMapId, mindObjectId, colorCode){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fWSocket.emit('NewEvent',{Code : CODE_MIND_CHANGE_COLOR_OF_CONTENTS,
			Var1 : mindMapId[0],
			Var2 : mindMapId[1],
			Var3 : mindObjectId[0],
			Var4 : mindObjectId[1],
			Var5 : colorCode});	
	};
	this.mindObjectChangeContentsSend = function(mindMapId, mindObjectId, contentsType, contents){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}

	};
	this.mindObjectChangeColorOfShapeSend = function(mindMapId, mindObjectId, colorCode){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_CHANGE_COLOR_OF_SHAPE,
			Var1 : mindMapId[0],
			Var2 : mindMapId[1],
			Var3 : mindObjectId[0],
			Var4 : mindObjectId[1],
			Var5 : colorCode});	
	};
	this.mindObjectChangeShape = function(mindMapId, mindObjectId, shapeType){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		
		fWSocket.emit('NewEvent',SendInfo);
	};
	this.mindObjectChangeParentMindMapSend = function(mindMapId, mindObjectId, targetMindMapId){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		
		fWSocket.emit('NewEvent',SendInfo);
	};

	this.mindMapRequestMindInfo = function(mindMapId){	
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fWSocket.emit('NewEvent',{Code : CODE_MIND_MAP_REQUEST_MIND_INFO,
										Var1 : mindMapId[0],
										Var2 : mindMapId[1]});
	};
	
	var genArrayForCommu = function(type, typeDependentInfo){
		var ret;
		switch(type){
		case  "CircleShape" :
			ret = [typeDependentInfo.fRadius,	//Radius
                   typeDependentInfo.fColor];	//Color
			break;
		case "TextContents" :
			ret = [typeDependentInfo.fColor,			//Color
                   typeDependentInfo.fFontFamily,		//FontFamily
                   typeDependentInfo.fFontWeight,		//FontWeight
                   typeDependentInfo.fFontSize];		//FontSize
			break;
		case "SimplePathEdge" :
			ret = [typeDependentInfo.fWidth, typeDependentInfo.fColor];
			break;
		default :
			ret = null;
			break;
		}
		return ret;
	};
	
}



function SocketDataCommuHelperRecv (jobHandler,wSocket) {
	var fJobHandler = jobHandler;
	var fWSocket = wSocket;
	
	this.setWSocket = function(wSocket){
		fWSocket = wSocket;
	};
	this.getWSocket = function (){
		return fWSocket;
	};
	
	this.onLoadMindMapRecv = function(loadingInfo){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fJobHandler.resetJobHandler();
		fJobHandler.pushNewJob(loadingInfo);
	};
	this.onGetLatestEventRecv = function(newJob){
		//여기에 나중에 MindMapID에 따른 필터 추가 --> MindMapID이 안맞으면 전부 PASS, MindMapID가 맞는데 MindMap이 null이면 임시 잡큐에 push	
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fJobHandler.pushNewJob(newJob);		
	};	
}

//------------------- DrawingObj Section--------------------------------------

function DrawingObj(drawingInterface){
	
	
	var fDrawingInterface = drawingInterface;
	var fDrawingJobQ = null;
	var fWorker = null;
	var fIsStarted = false;
	var fMutexLocked = false;
	
	
	this.resetDrawingObj = function(){

		
		if(fIsStarted){
			fWorker.terminate();
			fWorker = null;		
		}
		
		fDrawingInterface.eraseAll();
		
		fDrawingJobQ = null;
		fDrawingJobQ = new Array();
		
		fMutexLocked = false;
		
		this.startEventLoop();
	};
	
	
	this.pushNewJob = function(drawingJobObject){
		while(fMutexLocked){				
			;
		}
		////Drawing과 공유하지 않는, 순수 대기리스트 큐가 하나 더필요할듯 ( 순서 보장)
		fMutexLocked = true;
		fDrawingJobQ.push(drawingJobObject);
		fMutexLocked = false;
	};
	
	

	
	var handleEventCode = function(drawingJob){		
		switch (drawingJob[0]) {
		case CODE_MIND_MAP_REQUEST_MIND_INFO :
			drawMindMap(drawingJob[1],drawingJob[2]);			
			break;
		case CODE_MIND_ADD :
			drawMindObject(drawingJob[1]);
			break;
		case CODE_MIND_DEL :
			eraseMindObject(drawingJob[1], drawingJob[2]);
			break;
		case CODE_MIND_MOVE :
			moveMindObject(drawingJob[1], drawingJob[2]);
			break;
		case CODE_MIND_PUT_INTO :
			break;
		case CODE_MIND_PULL_OUT :
			break;
		case CODE_MIND_CONNECT_TO :			
			drawEdge(drawingJob[1]);
			break;
		case CODE_MIND_DISCONNECT_FROM :
			eraseEdge(drawingJob[1]);
			break;
		case CODE_MIND_CHANGE_COLOR_OF_CONTENTS :
			changeColorOfContents(drawingJob[1],drawingJob[2]);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			break;
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
			changeColorOfShape(drawingJob[1],drawingJob[2]);
			break;
		case CODE_MIND_CHANGE_SHAPE :
			break;
		case CODE_MIND_CHANGE_PARENT_MIND_MAP :
			break;
		default :
			break;
		
		}
		return 1;
		//나중에 표준을 정해서 구현  파싱 Event Code에 대한 파싱
	};
	
	var drawMindMap = function(mindObjectInfoArray, edgeInfoArray){
		
		var edgeObjects = edgeInfoArray;			
		for(var i=0; i<mindObjectInfoArray.length; i++){
			var tempShapeType = mindObjectInfoArray[i].fShape.fShapeType;			
			
			getDrawingFunctionRef(tempShapeType, "draw")(mindObjectInfoArray[i].fX,									//X
															mindObjectInfoArray[i].fY,									//Y
															mindObjectInfoArray[i].fZ,									//Z
															mindObjectInfoArray[i].fShape.fShapeTypeDependentInfo,		//Info
															mindObjectInfoArray[i].fMindObjectId);						//ObjectID
			
			var tempContentsType =  mindObjectInfoArray[i].fContents.fContentsType;
			
			getDrawingFunctionRef(tempContentsType, "draw")(mindObjectInfoArray[i].fX,										//X
															mindObjectInfoArray[i].fY,										//Y
															mindObjectInfoArray[i].fZ,										//Z
															mindObjectInfoArray[i].fContents.fContentsTypeDependentInfo,	//Info
															mindObjectInfoArray[i].fContents.fValue,						//Value
															mindObjectInfoArray[i].fMindObjectId);							//ObjectID
			
		}
		for(i=0; i<edgeObjects.length; i++){
			
			
			var tempEdgeType = edgeObjects[i].fEdgeType;
			
			getDrawingFunctionRef(tempEdgeType, "draw")(edgeObjects[i].fFirstMindObject.fX,						//Frist X
														edgeObjects[i].fFirstMindObject.fY,						//First Y
														edgeObjects[i].fFirstMindObject.fZ,						//First Z
														edgeObjects[i].fSecondMindObject.fX,					//Second X
														edgeObjects[i].fSecondMindObject.fY,					//Second Y
														edgeObjects[i].fSecondMindObject.fZ,					//Second Z
														edgeObjects[i].fEdgeTypeDependentInfo, 					//Info
														edgeObjects[i].fFirstMindObject.fMindObjectId,			//FirstID
														edgeObjects[i].fSecondMindObject.fMindObjectId);		//SecondID
		}
	};
	
	var drawMindObject = function(mindObject){
		
		getDrawingFunctionRef(mindObject.fShape.fShapeType, "draw")(mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fShape.fShapeTypeDependentInfo,
														mindObject.fMindObjectId);
		
		getDrawingFunctionRef(mindObject.fContents.fContentsType, "draw")(mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fContents.fContentsTypeDependentInfo,
														mindObject.fContents.fValue,
														mindObject.fMindObjectId);		
		
	};
	
	var eraseMindObject = function(delMindObjectInfo, delEdgeInfo){
		
		getDrawingFunctionRef(delMindObjectInfo.fShape.fShapeType, "erase")(delMindObjectInfo.fMindObjectId);

		getDrawingFunctionRef(delMindObjectInfo.fContents.fContentsType, "erase")(delMindObjectInfo.fMindObjectId);
		
		for(var i=0; i<delEdgeInfo.length; i++){
			getDrawingFunctionRef(delEdgeInfo[i].fEdgeType, "erase")(delEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																	delEdgeInfo[i].fSecondMindObject.fMindObjectId);
		}		
	};
	
	var moveMindObject = function(movMindObjectInfo, movEdgeInfo){
		getDrawingFunctionRef(movMindObjectInfo.fShape.fShapeType, "move")(movMindObjectInfo.fX,
																			movMindObjectInfo.fY,
																			movMindObjectInfo.fZ,
																			movMindObjectInfo.fMindObjectId);
		getDrawingFunctionRef(movMindObjectInfo.fContents.fContentsType, "move")(movMindObjectInfo.fX,
																				movMindObjectInfo.fY,
																				movMindObjectInfo.fZ,
																				movMindObjectInfo.fMindObjectId);
		
		for(var i=0; i<movEdgeInfo.length; i++){
			getDrawingFunctionRef(movEdgeInfo[i].fEdgeType, "move")(movMindObjectInfo.fX,
																	movMindObjectInfo.fY,
																	movMindObjectInfo.fZ,
																	movEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																	movEdgeInfo[i].fSecondMindObject.fMindObjectId,
																	movMindObjectInfo.fMindObjectId);
		}	
	};
	
	var drawEdge = function(newEdgeInfo){
		getDrawingFunctionRef(newEdgeInfo.fEdgeType, "draw")(newEdgeInfo.fFirstMindObject.fX,
																newEdgeInfo.fFirstMindObject.fY,
																newEdgeInfo.fFirstMindObject.fZ,
																newEdgeInfo.fSecondMindObject.fX,
																newEdgeInfo.fSecondMindObject.fY,
																newEdgeInfo.fSecondMindObject.fZ,
																newEdgeInfo.fEdgeTypeDependentInfo,
																newEdgeInfo.fFirstMindObject.fMindObjectId,
																newEdgeInfo.fSecondMindObject.fMindObjectId);
	};
	
	var eraseEdge = function(delEdgeInfo){
		getDrawingFunctionRef(delEdgeInfo.fEdgeType, "erase")(delEdgeInfo.fFirstMindObject.fMindObjectId,
																delEdgeInfo.fSecondMindObject.fMindObjectId);
	};
	
	var changeColorOfContents = function(mindObjectInfo, colorCode){
		getDrawingFunctionRef(mindObjectInfo.fContents.fContentsType,"changeColor")(colorCode,
																					mindObjectInfo.fMindObjectId);
	};
	
	var changeColorOfShape = function(mindObjectInfo, colorCode){
		
		getDrawingFunctionRef(mindObjectInfo.fShape.fShapeType,"changeColor")(colorCode,
																				mindObjectInfo.fMindObjectId);
	};
	
	var handleLatestJob = function(){
		if(fDrawingJobQ.length == 0 || fMutexLocked == true)							
			return;			
		
		fMutexLocked = true;
		var latestJob = fDrawingJobQ[0];
		/*console.log("Before Pop : ");
		for(var i=0; i< fDrawingJobQ.length; i++){
			console.log("["+i+"] : "+JSON.stringify(fDrawingJobQ[i]));
		}*/
		fDrawingJobQ.splice(0,1);
		//console.log("Poped Item : ");		
		//console.log(JSON.stringify(latestJob));
		ret = handleEventCode(latestJob);
		if(ret == 0){
			//오류 메세지 출력 및 MindMap 재 초기화
		}
		fMutexLocked = false;
	};
	this.startEventLoop = function(){
		fIsStarted = true;
		fWorker = new Worker("DrawingWorker.js");
		
		var callBackInterface = handleLatestJob;
		fWorker.onmessage = function (event){
			callBackInterface();			
		};
	};
	
	
	var getDrawingFunctionRef = function(type, operation){
		var retFunc;
		switch(operation){
		case "draw" :
			switch(type){
			case "CircleShape" :
				retFunc = fDrawingInterface.drawCircleShape;
				break;
			case "EllipseShape" :
				retFunc = fDrawingInterface.drawEllipseShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.drawTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.drawImageContents;
				break;
			case "SimplePathEdge" :
				retFunc = fDrawingInterface.drawSimplePathEdge;
				break;
			}
			break;
		case "erase" :
			switch(type){
			case "CircleShape" :
				retFunc = fDrawingInterface.eraseCircleShape;
				break;
			case "EllipseShape" :
				retFunc = fDrawingInterface.eraseEllipseShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.eraseTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.eraseImageContents;
				break;
			case "SimplePathEdge" :
				retFunc = fDrawingInterface.eraseSimplePathEdge;
				break;
			}
			break;
		case "move" :
			switch(type){
			case "CircleShape" :
				retFunc = fDrawingInterface.moveCircleShape;
				break;
			case "EllipseShape" :
				retFunc = fDrawingInterface.moveEllipseShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.moveTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.moveImageContents;
				break;
			case "SimplePathEdge" :
				retFunc = fDrawingInterface.moveSimplePathEdge;
				break;
			}
			break;
		case "changeColor" :
			switch(type){
			case "CircleShape" :
				retFunc = fDrawingInterface.changeColorOfCircleShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.changeColorOfTextContents;
			}
			break;
		}
		
		return retFunc;
	};
}

//------------------- DrawingInterface Section--------------------------------------

function DrawingInterface(backBoneType){
	this.fBackBoneType = backBoneType;
	
	//To Maintain Shape,Contents,Edge Objects...
	var fShapeObjects;
	var fContentsObjects;
	var fEdgeObjects;
	
	//Shape Section
	this.drawCircleShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseCircleShape = function(mindObjectId){
		
	};	
	this.moveCircleShape = function(x, y, z, mindObjectId){
		
	};
	this.changeColorOfCircleShape = function(colorCode, mindObjectId){
		
	};
	
	this.drawEllipseShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseEllipseShape = function(mindObjectId){
		
	};
	this.moveEllipseShape = function(x, y, z, mindObjectId){
		
	};
	

	
	//Contents Section
	
	this.drawTextContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseTextContents = function(mindObjectId){
		
	};
	this.moveTextContents = function(x, y, z, mindObjectId){
		
	};
	this.changeColorOfTextContents = function(colorCode, mindObjectId){
		
	};
	
	this.drawImageContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseImageContents = function(mindObjectId){
		
	};
	this.moveImageContents = function(x, y, z, mindObjectId){
		
	};
	
	//Edge Section
	this.drawSimplePathEdge = function(startX ,startY, startZ, endX, endY, endZ, info, startMindObjectId, endMindObjectId){
		
	};
	this.eraseSimplePathEdge = function(startMindObjectId, endMindObjectId){
		
	};
	this.moveSimplePathEdge = function(x, y, z, startMindObjectId, endMindObjectId, movingMindObjectId){
		
	};
	
	//All
	this.eraseAll = function(){
		
	};
}


//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PaperJS////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


//------------------- DrawingInterface Section--------------------------------------
//매개변수 명 변경 필요 (가독성 있게)
function PaerperJS_DrawingInterface(backBoneType){
	this.fBackBoneType = backBoneType;
	
	
	//To Maintain Shape,Contents,Edge Objects...
	var fShapeObjects = new Array();
	var fContentsObjects = new Array();
	var fEdgeObjects = new Array();
	
	
	
	//Shape Section
	this.drawCircleShape = function(x, y, z, info, mindObjectId){
		var position = new paper.Point(x,y);
		var drawingObject = new paper.Path.Circle(position, info.fRadius);		
		drawingObject.fillColor = info.fColor;
		drawingObject.fMindObjectId = mindObjectId;
		paper.view.draw();
		
		fShapeObjects.push(drawingObject);
	};
	this.eraseCircleShape = function(mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){					
				fShapeObjects[i].remove();
				paper.view.draw();
				
				fShapeObjects.splice(i,1);
				break;
			}
		}
	};
	this.moveCircleShape = function(x, y, z, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fShapeObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};	
	this.changeColorOfCircleShape = function(colorCode, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	
	this.drawEllipseShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseEllipseShape = function(mindObjectId){
		
	};
	this.moveEllipseShape = function(x, y, z, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fShapeObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	//Contents Section
	
	this.drawTextContents = function(x, y, z, info, value, mindObjectId){
		var contentsObject = new paper.PointText(x,y);
		contentsObject.justification = 'center';
		contentsObject.content = value;
		contentsObject.fontSize = info.fFontSize;
		contentsObject.fillColor = info.fColor;
		contentsObject.fMindObjectId = mindObjectId;
		paper.view.draw();
		
		fContentsObjects.push(contentsObject);
		
	};
	this.eraseTextContents = function(mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				
				fContentsObjects[i].remove();
				paper.view.draw();
				
				fContentsObjects.splice(i,1);
				break;
			}
		}
	};
	this.moveTextContents = function(x, y, z, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId, mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fContentsObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	this.changeColorOfTextContents = function(colorCode, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId, mindObjectId)){

				fContentsObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.drawImageContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseImageContents = function(mindObjectId){
		
	};
	this.moveImageContents = function(x, y, z, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fContentsObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	//Edge Section
	this.drawSimplePathEdge = function(startX ,startY, startZ, endX, endY, endZ, info, startMindObjectId, endMindObjectId){
		var drawingObject = new paper.Path.Line(new paper.Point(startX,startY),
				new paper.Point(endX,endY));
		drawingObject.strokeColor = info.fColor;
		drawingObject.sendToBack();
		drawingObject.fStartMindObjectId = startMindObjectId;
		drawingObject.fEndMindObjectId = endMindObjectId;
		paper.view.draw();
		
		fEdgeObjects.push(drawingObject);
	};
	this.eraseSimplePathEdge = function(startMindObjectId, endMindObjectId){
		
		for(var i=0;i<fEdgeObjects.length; i++){
			if( ((compareIdValue(fEdgeObjects[i].fStartMindObjectId, startMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, endMindObjectId)))
					||
				((compareIdValue(fEdgeObjects[i].fStartMindObjectId, endMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, startMindObjectId))) ) {			
					
				fEdgeObjects[i].remove();
				paper.view.draw();
				
				fEdgeObjects.splice(i,1);
				
				break;
			}			
		}
	};
	this.moveSimplePathEdge = function(x, y, z, startMindObjectId, endMindObjectId, movingMindObjectId){
		
		for(var i=0;i<fEdgeObjects.length; i++){
			if( ((compareIdValue(fEdgeObjects[i].fStartMindObjectId, startMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, endMindObjectId)))
					||
				((compareIdValue(fEdgeObjects[i].fStartMindObjectId, endMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, startMindObjectId))) ) {			
				
				var movingSegmentObject = null;
				
				if(compareIdValue(movingMindObjectId, fEdgeObjects[i].fStartMindObjectId)){						
					movingSegmentObject = fEdgeObjects[i].firstSegment;
				}
				else if(compareIdValue(movingMindObjectId, fEdgeObjects[i].fEndMindObjectId)){						
					movingSegmentObject = fEdgeObjects[i].lastSegment;
				}
				
				if(movingSegmentObject != null){
					movingSegmentObject.point = new paper.Point(x,y);
					paper.view.draw();
				}
				break;
			}			
		}			
	};
	
	//All
	this.eraseAll = function(){
		
	};	
}

PaerperJS_DrawingInterface.prototype = new DrawingInterface("default");
PaerperJS_DrawingInterface.constructor = PaerperJS_DrawingInterface;


//------------------- Utility Section--------------------------------------

function setUpPaperLib(canvasName){
	var canvas  = document.getElementById(canvasName);
	paper.setup(canvas);
}


//------------------- MindMap Section--------------------------------------

function PaperJSMindMap(CanvasName) {

	SetUpPaperLib(CanvasName);
	
	this.MindObjects = new Array();
	this.MaxRelDistance = 300;
	this.MaxMindObjectCount = 100;
	this.SelectedObject = null;
	this.layer = new paper.Layer();	
	this.layer.MindObjects = this.MindObjects;
	this.layer.SelectedObjects = this.SelectedObject;
	this.layer.MaxRelDistance = this.MaxRelDistance;
	
	var CreatingCircle = new paper.Path.Circle(new paper.Point(100,70), 50);
	CreatingCircle.fillColor = 'black';	
	
	var CreatingRectangle = new paper.Rectangle(new paper.Point(33,150), new paper.Size(135,100));
	var CreatingEllipse = new paper.Shape.Ellipse(CreatingRectangle);
	CreatingEllipse.fillColor = 'black';	
	
	var DeletingCircle = new paper.Path.Circle(new paper.Point(500,500), 50);
	DeletingCircle.fillColor = 'black';	
	
	this.onMouseDownInterface = function(event){
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		this.SelectedObject = null;
		if(CreatingCircle.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(0,0,0,"CircleShape","PictureContents","http://cfile22.uf.tistory.com/image/2432574E5215F11118F817",x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}
		else if(CreatingEllipse.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(0,0,0,"EllipseShape","TextContents","ThinkTest",x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}	
		else {
			for(i=0; i< this.MindObjects.length; i++){
				if(this.MindObjects[i].Shape.DrawingObject.contains(event.point)){
					this.SelectedObject = this.MindObjects[i];
					return;
				}
			}
		}

	};	
	this.onMouseUpInterface = function(event){		
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		if(DeletingCircle.contains(new paper.Point(x,y)) && this.SelectedObject !=null){
			for(i=0; i<this.MindObjects.length; i++){
				if(this.MindObjects[i] == this.SelectedObject){
					this.MindObjects.splice(i,1);
					break;
				}
			}
			this.SelectedObject.RemoveMindObject();
			this.SelectedObject = null;
		}
		else{
			this.SelectedObject = null;
		}
	};
	
	this.onMouseDragInterface = function(event){
		console.log(event.delta);
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		if(this.SelectedObject == null)
			return;
		else {
			this.SelectedObject.MoveMindObject(x,y,z);
			
			for(i=0; i<this.MindObjects.length; i++){
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
				else if(Distance !=0 && Distance > this.MaxRelDistance){
					this.SelectedObject.DisconnectFrom(this.MindObjects[i])
				}
			}
			
		}
	};
	
	var FrameRate = 0.05;
	var PreviousTime = 0;
	/*function onFrameInterface(event){
		// the number of times the frame event was fired:
		//console.log(event.delta);
		//if
		// The total amount of time passed since
		// the first frame event in seconds:
		//var
		
		if(event.time-PreviousTime < FrameRate){
			paper.view.pause();
		}
		else{
			paper.view.update();
			PreviousTime = event.time;
			console.log(event.time);
		}


		// The time passed in seconds since the last frame event:
		//console.log("Aaa");
	};*/

	this.layer.on({mousedown : this.onMouseDownInterface,
					mouseup : this.onMouseUpInterface,
					mousedrag : this.onMouseDragInterface});
	//paper.view.on('frame',onFrameInterface);

	
}



//PaperJSMindMap.prototype = new MindMap();
// PaperJSMindMap.prototype.constructor = PaperJSMindMap;





//------------------- Edge Section------------------------------------

function SimplePathEdge(FirstMindObject,SecondMindObject){
	this.FirstMindObject = FirstMindObject;
	this.SecondMindObject = SecondMindObject;
	this.DrawEdge = function(){
		if(this.DrawingObject == null){
			this.DrawingObject = new paper.Path.Line(new paper.Point(FirstMindObject.x,FirstMindObject.y),
												new paper.Point(SecondMindObject.x,SecondMindObject.y));
			this.DrawingObject.strokeColor = this.EdgeColor;
			this.DrawingObject.sendToBack();
		}
		else{
			;
		}
		
	};
	this.EraseEdge = function(){
		this.DrawingObject.remove();
		
	};
	this.MoveFirstPoint = function(x,y,z){		
		this.DrawingObject.firstSegment.point = new paper.Point(x,y,z);
	};
	this.MoveSecondPoint = function(x,y,z){
		this.DrawingObject.lastSegment.point = new paper.Point(x,y,z);
	};
	this.ChangeColor = function(Color){		
		this.EdgeColor = Color;
		this.DrawingObject.strokeColor = this.EdgeColor; 
	};
}
SimplePathEdge.prototype = new Edge(null,null);
SimplePathEdge.constructor = SimplePathEdge;


//------------------- Shape Section------------------------------------



function CircleShape (){	
	this.DrawShape = function(x,y,z){
		if(this.DrawingObject == null){
			var Position = new paper.Point(x,y);
			this.DrawingObject = new paper.Path.Circle(Position,50);		
			this.DrawingObject.fillColor = this.Color;
		}
		else{
			;
		}
	};	
	this.EraseShape = function(){
		this.DrawingObject.remove();
	};
	this.MoveShape = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		this.DrawingObject.position = newPoint;
	}
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.DrawingObject.fillColor = this.Color;
	};
}

CircleShape.prototype = new Shape();
CircleShape.prototype.constructor = CircleShape;


function EllipseShape (){	
	this.DrawShape = function(x,y,z){
		if(this.DrawingObject == null){
			var RectangleOutline = new paper.Rectangle(new paper.Point(x-67.5,y-50), new paper.Size(135,100));
			this.DrawingObject = new paper.Shape.Ellipse(RectangleOutline);		
			this.DrawingObject.fillColor = this.Color;
		}
		else{
			;
		}
	};	
	this.EraseShape = function(){
		this.DrawingObject.remove();
	};
	this.MoveShape = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		this.DrawingObject.position = newPoint;
	}
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.DrawingObject.fillColor = this.Color;
	};
}

EllipseShape.prototype = new Shape();
EllipseShape.prototype.constructor = EllipseShape;










//------------------- Contents Section------------------------------------


function TextContents(Text) {
	this.Text = Text;
	this.DrawContents = function(x,y,z){
		if(this.ContentsObject == null){
			this.ContentsObject = new paper.PointText(x,y);
			this.ContentsObject.justification = 'center';
			this.ContentsObject.fillColor = this.Color;
			this.ContentsObject.content = this.Text;
		}
		else{
			;
		}
	};
	this.EraseContents = function(){
		this.ContentsObject.remove();
	};
	this.MoveContents = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		
		this.ContentsObject.position = newPoint;
	};
	this.ChangeContents = function(toValue){
		this.Text = toValue;
		this.ContentsObject.content = this.Text;
	};
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.ContentsObject.fillColor = this.Color;
	};
}

TextContents.prototype = new Contents();
TextContents.prototype.constructor = TextContents;




function PictureContents(PictureURI){
	this.PictureURI = PictureURI;
	this.DrawContents = function(x,y,z){
		this.ContentsObject = new paper.Raster(this.PictureURI);
		this.ContentsObject.position = new paper.Point(x,y);
		this.ContentsObject.scale(0.03);
	};
	this.EraseContents = function() {
		this.ContentsObject.remove();
	};
	this.MoveContents = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		
		this.ContentsObject.position = newPoint;
	};
	this.ChangeContents = function(toValue){
		this.PictureURI = toValue;
		this.ContentsObject.source = toValue;
	};
	this.ChangeColor = function(Color){
		
	};
}
PictureContents.prototype = new Contents();
PictureContents.prototype.constructor = PictureContents;








