
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

addJavascript("/paper-full.js");
addJavascript("/socket.io/socket.io.js");
addJavascript("/DrawingWorker.js");
addJavascript("/EventParserWorker.js");
addJavascript("/AnimationWorker.js");
addJavascript("/kinetic-v5.0.2.min.js");


function compareIdValue(firstIdValue,secondIdValue){
	if(firstIdValue == secondIdValue)
		return true;
	else
		return false;
}

function distanceOfTwoPoints(x1,y1,z1, x2,y2,z2){
	var xd = x2-x1;
	xd = xd * xd;
	
	var yd = y2-y1;
	yd = yd * yd;
	
	var zd = z2-z1;
	zd = zd * zd;
	
	return Math.sqrt(xd + yd + zd);
}

function distanceOfTwoPoints(x1,y1,z1, x2,y2,z2){
	var xd = x2-x1;
	xd = xd * xd;
	
	var yd = y2-y1;
	yd = yd * yd;
	
	var zd = z2-z1;
	zd = zd * zd;
	
	return Math.sqrt(xd + yd + zd);
}


function distanceOfTwoPointsBySquare(x1,y1,z1, x2,y2,z2){
	var xd = x2-x1;
	xd = xd * xd;
	
	var yd = y2-y1;
	yd = yd * yd;
	
	var zd = z2-z1;
	zd = zd * zd;
	
	return xd + yd + zd;
}

function linearInterpolation(x1,y1,z1, x2,y2,z2, n){
	var direction = x2>x1? 1: -1;
	var count = 0;
	var increment = (x2-x1)/n;
	var retArray = new Array();
	
	retArray.push([x1,y1,z1]);	
	
	if(x2-x1 !=0){	
		while(count < n){
			var interpolatedX;
			var interpolatedY;
			var interpolatedZ;
			
			interpolatedX = x1 + increment * (count + 1);
			interpolatedY = y1 + ((y2-y1)/(x2-x1))*(interpolatedX-x1);
			interpolatedZ = z1 + ((z2-z1)/(x2-x1))*(interpolatedX-x1);
			
			retArray.push([interpolatedX, interpolatedY, interpolatedZ]);
			count++;
		}
	}
	
	retArray.push([x2,y2,z2]);
	
	return retArray;
	
}

function clone(obj){
    var clonedObjectsArray = [];
    var originalObjectsArray = []; //used to remove the unique ids when finished
    var next_objid = 0;

    function objectId(obj) {
        if (obj == null) return null;
        if (obj.__obj_id == undefined){
            obj.__obj_id = next_objid++;
            originalObjectsArray[obj.__obj_id] = obj;
        }
        return obj.__obj_id;
    }

    function cloneRecursive(obj) {
        if (null == obj || typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean") return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0; i < obj.length; ++i) {
                copy[i] = cloneRecursive(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            if (clonedObjectsArray[objectId(obj)] != undefined)
                return clonedObjectsArray[objectId(obj)];

            var copy;
            if (obj instanceof Function)//Handle Function
                copy = function(){return obj.apply(this, arguments);};
            else
                copy = {};

            clonedObjectsArray[objectId(obj)] = copy;

            for (var attr in obj)
                if (attr != "__obj_id" && obj.hasOwnProperty(attr))
                    copy[attr] = cloneRecursive(obj[attr]);                 

            return copy;
        }       


        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    var cloneObj = cloneRecursive(obj);



    //remove the unique ids
    for (var i = 0; i < originalObjectsArray.length; i++)
    {
        delete originalObjectsArray[i].__obj_id;
    };

    return cloneObj;
}


//------------------- OperatonCode Section--------------------------------

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
const CODE_MIND_CHANGE_PARENT_MIND_MAP = "MCPMM";
const CODE_MIND_RESIZE_SHAPE = 45;
const CODE_MIND_MAP_REQUEST_MIND_INFO = 65;

/*const SocketCommuDelimiter = "\\";
const Nested_SocketCommuDelimiter_1 = ",";
const Nested_SocketCommuDelimiter_2 = "/";
const Nested_SocketCommuDelimiter_3 = ".";*/


const DEFAULT_TYPE_EDGE = "SimplePathEdge";
const DEFAULT_OPACITY_SELECTED_MIND_OBJECT = 0.7;
const DEFAULT_OPACITY_MOVING_MIND_OBJECT = 0.7;

const MEDIA_SERVER_ADDR = "192.168.0.2";
const WEB_PREVIEW_PORT = "52274";
const moveCountLimit = 5;

//const MIN_SHAPE_TYPE_DEPENDENT_INFO = {CircleShape : new CircleShapeTypeDependentInfo(										};

var CreatingCircle;
var CreatingImageCircle;
var CreatingRectangle;
var CreatingEllipse;
var CreatingStar;
var CreatingPolygon;
var DeletingCircle;

//Dummy Data For Test
//We need to get this value from user by closing ThinkMineLibrary Global Scope, and implementing Constructor
var currentUserId = "jdj9354"; 

//------------------- ThinkMineCanvas Section------------------------------

function ThinkMineCanvas(userDefinedDrawingInterface, userDefinedCollisionInterface){ //MindMap객체를 가지고 이객체를 DrawingObj에개 그리도록 Data ByPass
	
	var moveCount = 0;	
	
	//var fMindMapId;
	var fDrawingInterface = userDefinedDrawingInterface;
	var fCollisionInterface = userDefinedCollisionInterface;
	var fDrawingObj = new DrawingObj(fDrawingInterface);
	var fJobHandler = new JobHandler(fDrawingObj);
	var fSocketHelper = new SocketHelper(fJobHandler);
	//this.fSocketHelper = new SocketHelper(fJobHandler); //Test 코드 임시로 Public으로 설정
	
	var fSelectedShapeType = "CircleShape";
	var fSelectedShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(50,"#FF0000");
	var fSelectedContentsType = "TextContents";
	var fSelectedContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
	
	//Outter Menu Selection related variables
	

	var fMenuAvailableShape = ["CircleShape",
								"RectangleShape",
								"StarShape",
								"PolygonShape"];
								
	var fMenuSelectedShape = fMenuAvailableShape[0];								
	var fMenuInsertedSDI = null;
	//var fMenuInsertedSDI = new CircleShapeTypeDependentInfo(50,"#FF0000");
	
	var fMenuAvailableContents = ["TextContents",
									"ImageContents",
									"MovieContents",
									"WebPreviewContents"];
									
	var fMenuSelectedContents = fMenuAvailableContents[0];									
	var fMenuInsertedCDI = null;
	//var fMenuInsertedCDI = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
	
	var fMenuInsertedCV = "";
	//var fMenuInsertedCV = "Test";
	
	var fObjectAddMode = false;
	//fObjectAddMode = true;
	var fVirtualMindObject = null;
	var fAddEventStartPointX = -1;
	var fAddEventStartPointY = -1;
	var fAddEventStartPointZ = -1;
	
	//
	
	
	
	var fIsConnectedToServer = false;
	var fSelectedObject = null;
	var fSelectedObjectOriginalOpacitiy = 1;
	var fMovingObject = null;
	var fIsDragging = false;
	var fLastClickTimeInMillis = 0;
	
	var fIsCompositionEventStarted = false;
	var fIsContentsChanged = false;
	
	//this.fMindMap = null;
	
	//Utility Functions
	
	var resetTMCanvas = function(){

		var fSelectedObject = null;
		var fMovingObject = null;
		var fIsDragging = false;
		var fLastClickTimeInMillis = 0;
		
		var fIsCompositionEventStarted = false;
		var fIsContentsChanged = false;
		
									
		fObjectAddMode = false;
		fVirtualMindObject = null;		
		fAddEventStartPointX = -1;
		fAddEventStartPointY = -1;
		fAddEventStartPointZ = -1;
		
		var contentsEditor = document.getElementById('ContentsEditor');
		if(contentsEditor != null)
			contentsEditor.parentNode.removeChild(contentsEditor);				
		
		var applyButton = document.getElementById('ApplyButton');
		if(applyButton != null)
			applyButton.parentNode.removeChild(applyButton);
		
	};
	
	//Menu Interaction Functions
	
	this.enableObjectAddMode = function(){
		fObjectAddMode = true;
	};
	
	this.disableObjectAddMode = function(){
		fObjectAddMode = false;
	};
	
	this.setMenuSelectedShape = function(shapeIndex){
		this.enableObjectAddMode();
		if(fVirtualMindObject != null){
			fDrawingInterface["erase"+fMenuSelectedShape]("virtual");
			fDrawingInterface["erase"+fMenuSelectedContents]("virtual");
			fVirtualMindObject = null;
		}
			
		fMenuSelectedShape = fMenuAvailableShape[shapeIndex];		
	};
	
	this.setMenuInsertedSDI = function(shapeDependentInfo){
		fMenuInsertedSDI = shapeDependentInfo;
	};
	
	this.setMenuSelectedContents = function(contentsIndex){
		fMenuSelectedContents = fMenuAvailableContents[contentsIndex];
	};
		
	this.setMenuInsertedCDI = function(contentsDependentInfo){
		fMenuInsertedCDI = contentsDependentInfo;
	};
	
	this.setMenuInsertedCV = function(contentsValue){
		fMenuInsertedCV = contentsValue;
	};
	
	//Event Listener Interface
	
	this.onPasteInterface = function(e){
		var clipBoardContents = e.clipboardData.getData('text/plain');
		var tempShape = new Shape(fSelectedShapeType,fSelectedShapeTypeDependentInfo);
		var tempContents = new Contents(fSelectedContentsType,fSelectedContentsTypeDependentInfo,clipBoardContents);
		this.addMindObject(e.point.x,e.point.y,0,tempShape,tempContents);
	};
	
	this.onKeyDownInterface = function (event) {
	
		if (!event) {  /*This will happen in IE */
			event = window.event;
		}
			
		var keyCode = event.keyCode;
		
		if (keyCode == 8 &&
			((event.target || event.srcElement).tagName != "TEXTAREA") && 
			((event.target || event.srcElement).tagName != "INPUT")) { 
			
				
			if (navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
				event.stopPropagation();
			} else {
				alert("prevented");
				event.returnValue = false;
			}
			
			return false;
		}
	};
	
	this.onCompositionEventStartInterface = function(event){
		fIsCompositionEventStarted = true;
	};
	
	this.onCompositionEventUpdateInterface = function(event){
		if(fSelectedObject != null){
			switch(fSelectedObject.fContents.fContentsType){
			case "TextContents" :			
				var currentText = fSelectedObject.fContents.fValue;
				currentText += event.data;
				
				fSelectedObject.fContents.fValue = currentText;
				fIsContentsChanged = true;
				
				var tempMindObjectForDrawing = {fX : fSelectedObject.fX ,
												fY : fSelectedObject.fY ,
												fZ : fSelectedObject.fZ ,
												fContents : {fContentsType : ""+fSelectedObject.fContents.fContentsType,
															 fContentsTypeDependentInfo : fSelectedObject.fContents.fContentsTypeDependentInfo,
															 fValue : ""+currentText},
												fMindObjectId : ""+fJobHandler.getMindMap().fMindMapId													
												};
				fDrawingObj.pushNewJob([CODE_MIND_CHANGE_VALUE_OF_CONTENTS,
										tempMindObjectForDrawing
										]);			
				break;
			default : 
				break;
			}
		}
	};
	
	this.onCompositionEventEndInterface = function(event){
		fIsCompositionEventStarted = false;
	};

	
	this.onMouseDownInterface = function(x,y,z){
		//충돌검사, 모양들 전부 inner interface로 제공 각 타입의 캔버스들이 구현해야함
		fMovingObject = null;
		var MindMap = fJobHandler.getMindMap();
		/*if(CreatingCircle.contains(new paper.Point(x,y))){
			/*var newMindObject = new MindObject(0,0,0,new CircleShape(),new PictureContents("http://cfile22.uf.tistory.com/image/2432574E5215F11118F817"),x,y,0);		
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
		}*/
		// Test Code Block start
		if(!fObjectAddMode) {
			if(CreatingCircle.contains(new paper.Point(x,y))){
				
				var tempShape;
				var tempShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(50,"#FF0000");
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
				
				tempShape = new Shape("CircleShape",tempShapeTypeDependentInfo);
				tempContents = new Contents("TextContents",tempContentsTypeDependentInfo,"Ok!!!");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
				

				
			}	
			/*else if(CreatingEllipse.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new EllipseShapeTypeDependentInfo(150,250,"#F361A6");
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#2FF1F3",'Courier New','bold',25);
				
				tempShape = new Shape("EllipseShape",tempShapeTypeDependentInfo);
				tempContents = new Contents("TextContents",tempContentsTypeDependentInfo,"This is a Ellipse Shape");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}*/
			else if(CreatingImageCircle.contains(new paper.Point(x,y))){
				
				var tempShape;
				var tempShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(290,"#FF0000");
				
				var tempContents;
				//var tempContentsTypeDependentInfo = new ImageContentsTypeDependentInfo(400,400);
				var tempContentsTypeDependentInfo = new MovieContentsTypeDependentInfo(400,400);
				
				tempShape = new Shape("CircleShape",tempShapeTypeDependentInfo);
				//tempContents = new Contents("ImageContents",tempContentsTypeDependentInfo,"http://cfile27.uf.tistory.com/image/0151AC3F51D28D6F2CF37B");
				tempContents = new Contents("MovieContents",tempContentsTypeDependentInfo,"Mr.chu.mp4");
				
				
				this.addMindObject(x,y,z,tempShape,tempContents);
				
				//var newMindObject = new MindObject(0,0,0,new EllipseShape(),new TextContents("ThinkTest"),x,y,0);		
				//newMindObject.DrawMindObject();
				//this.MindObjects.push(newMindObject);
				
				//this.SelectedObject = newMindObject;
				
				/*for(i=0; i< this.MindObjects.length; i++){
					this.SelectedObject.Shape.position;
					var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
					if(Distance !=0 && Distance <= this.MaxRelDistance){
						this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
					}
				}
				return;*/
			}
			else if(CreatingRectangle.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new RectangleShapeTypeDependentInfo(70,70,"#FFFF00",true);
				
				var tempContents;
				var tempContentsTypeDependentInfo = new WebPreviewContentsTypeDependentInfo(500,500, "1280X840",0.7); //TextContentsTypeDependentInfo("#000000",'Courier New','bold',25);
				
				tempShape = new Shape("RectangleShape",tempShapeTypeDependentInfo);
				tempContents = new Contents("WebPreviewContents",tempContentsTypeDependentInfo,"http://www.melon.com");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			else if(CreatingStar.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new StarShapeTypeDependentInfo(5,200,100,"#0FEF1F");
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#2FF1F3",'Courier New','bold',25);
				
				tempShape = new Shape("StarShape",tempShapeTypeDependentInfo);
				tempContents = new Contents("TextContents",tempContentsTypeDependentInfo,"This is a Star Shape");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			else if(CreatingPolygon.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new PolygonShapeTypeDependentInfo(12,200,"#FF0F0F");
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#2FF1F3",'Courier New','bold',25);
				
				tempShape = new Shape("PolygonShape",tempShapeTypeDependentInfo);
				tempContents = new Contents("TextContents",tempContentsTypeDependentInfo,"This is a Polygon Shape");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			// Test Code Block end
			else {
				for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
					if(fCollisionInterface.isContaining(x,y,z,MindMap.getMindObjectOnIndex(i))){
						fMovingObject = MindMap.getMindObjectOnIndex(i);
						moveCount = 0;
						return;
					}
					/*var dst = distanceOfTwoPoints(MindMap.getMindObjectOnIndex(i).fX,MindMap.getMindObjectOnIndex(i).fY,MindMap.getMindObjectOnIndex(i).fZ,x,y,0);
					if(dst<	MindMap.getMindObjectOnIndex(i).fShape.fShapeTypeDependentInfo.fRadius){
						fMovingObject = MindMap.getMindObjectOnIndex(i);
						moveCount = 0;
						return;
					}*/
				}
			}
		}
		else {
		}
	};
	
	this.onDoubleMouseDownInterface = function(x,y,z){
		if(!fObjectAddMode){
			var MindMap = fJobHandler.getMindMap();
			var targetMindObjectId = null;
		
			for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
				if(fCollisionInterface.isContaining(x,y,z,MindMap.getMindObjectOnIndex(i))){
					targetMindObjectId = MindMap.getMindObjectOnIndex(i).fMindObjectId;
				}
			}
			
			if(targetMindObjectId != null){
				this.initWithMindMap(targetMindObjectId);
				
			}
			else{
				return;
			}
		}
		else{
		}
		
	};
	
	this.onMouseUpInterface = function(x,y,z){
		
		var MindMap = fJobHandler.getMindMap();
		var curSelectedObject = null;
		
		if(!fObjectAddMode){
		
			for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
				if(fCollisionInterface.isContaining(x,y,0,MindMap.getMindObjectOnIndex(i))){
					curSelectedObject = MindMap.getMindObjectOnIndex(i);
					break;
				}
				/*var dst = distanceOfTwoPoints(MindMap.getMindObjectOnIndex(i).fX,MindMap.getMindObjectOnIndex(i).fY,MindMap.getMindObjectOnIndex(i).fZ,x,y,0);
				if(dst<	MindMap.getMindObjectOnIndex(i).fShape.fShapeTypeDependentInfo.fRadius){
					curSelectedObject = MindMap.getMindObjectOnIndex(i);
					break;
				}*/
			}
			
			if(!fIsDragging){
				if(curSelectedObject != null){	
					if(fSelectedObject !=null){
						if(curSelectedObject != fSelectedObject){	
						
							fDrawingInterface.changeOpacityOfCircleShape(0.5,curSelectedObject.fMindObjectId);
							fDrawingInterface.changeOpacityOfTextContents(0.5,curSelectedObject.fMindObjectId);						
							
							fDrawingInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
							fDrawingInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
							
							fSelectedObject = curSelectedObject;
							
							var applyButton = document.getElementById('ApplyButton');
							var contentsEditor = document.getElementById('ContentsEditor');
							
							var changeValueOfContentsRef = this.changeValueOfContents;
							applyButton.onclick = function (){
								changeValueOfContentsRef(fSelectedObject.fMindObjectId, fSelectedObject.fContents.fContentsType, contentsEditor.value);
							};
							
						}
						else{
							fDrawingInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
							fDrawingInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
							resetTMCanvas();
							//Should implement some effect which is expanding, in order to the user can do anything.
							this.onDoubleMouseDownInterface(x,y,z);
							return;
						}
					
						//fDrawingInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
						//fDrawingInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);

					}
					else{
						fSelectedObject = curSelectedObject;
						
						fDrawingInterface.changeOpacityOfCircleShape(0.5,fSelectedObject.fMindObjectId);
						fDrawingInterface.changeOpacityOfTextContents(0.5,fSelectedObject.fMindObjectId);		
					
						var contentsEditor = document.createElement('input');
						contentsEditor.setAttribute('id',"ContentsEditor");
						contentsEditor.setAttribute('type','text');
						contentsEditor.value = fSelectedObject.fContents.fValue;
						document.body.appendChild(contentsEditor);
						
						var applyButton = document.createElement('button');
						applyButton.setAttribute('id','ApplyButton');
						applyButton.innerText = 'Apply';
						
						var changeValueOfContentsRef = this.changeValueOfContents;
						applyButton.onclick = function (){
							changeValueOfContentsRef(fSelectedObject.fMindObjectId, fSelectedObject.fContents.fContentsType, contentsEditor.value);
						};
						document.body.appendChild(applyButton);
					}


					
				}
				else{
					if(fSelectedObject !=null){
						fDrawingInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
						fDrawingInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
					
								
						//this.changeValueOfContents(fSelectedObject.fMindObjectId, fSelectedObject.fContents.fContentsType ,fSelectedObject.fContents.fValue);
						fSelectedObject = null;	
						fIsContentsChanged = false;
						
						var contentsEditor = document.getElementById('ContentsEditor');
						contentsEditor.parentNode.removeChild(contentsEditor);				
						
						var applyButton = document.getElementById('ApplyButton');
						applyButton.parentNode.removeChild(applyButton);
					}
				}
			
			}	
			
			
			else{
				if(fMovingObject != null){
					// Test Code Block start
					if(DeletingCircle.contains(new paper.Point(x,y))){
								
					//			var tempShape;
					//			var tempShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(50,"#FF0000");
					//			
					//			var tempContents;
					//			var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
					//			
					//			tempShape = new Shape("CircleShape",tempShapeTypeDependentInfo);
					//			tempContents = new Contents("TextContents",tempContentsTypeDependentInfo,"Ok!!!");
					//			
					//			this.addMindObject(x,y,0,tempShape,tempContents);						
								this.deleteMindObject(fMovingObject.fMindObjectId);
					//			for(i=0; i< MindMap.lenOfMindObjectsArray(); i++){
					//				var dst = distanceOfTwoPoints(MindMap.getMindObjectOnIndex(i).fX,MindMap.getMindObjectOnIndex(i).fY,MindMap.getMindObjectOnIndex(i).fZ,x,y,0);
					//				if(dst<	MindMap.getMindObjectOnIndex(i).fShape.fShapeTypeDependentInfo.fRadius){
					//					this.fSelectedObject = MindMap.getMindObjectOnIndex(i);
					//					return;
					//				}
					//			}
							
					}
					else{
						for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
							if(fCollisionInterface.isContaining(x,y,0,MindMap.getMindObjectOnIndex(i)) && 
									MindMap.getMindObjectOnIndex(i) != fMovingObject){
								this.putIntoMindObject(fMovingObject, MindMap.getMindObjectOnIndex(i).fMindObjectId);
								break;;
							}
						}	
					}
					// Test Code Block end
					fIsDragging = false;
					fMovingObject = null;				
				}
			} 
		}
		else {
			if(fVirtualMindObject != null){
	
				var tempShape = new Shape(fMenuSelectedShape, fVirtualMindObject.fShape.fShapeTypeDependentInfo);
				var tempContents = new Contents(fMenuSelectedContents, fMenuInsertedCDI , fMenuInsertedCV);
				
				this.addMindObject(fVirtualMindObject.fX,fVirtualMindObject.fY,fVirtualMindObject.fZ,tempShape,tempContents);
				
				fVirtualMindObject = null;
				fAddEventStartPointX = -1;
				fAddEventStartPointY = -1;
				fAddEventStartPointZ = -1;
				//delete fMenuInsertedSDI;
				
				fDrawingInterface["erase"+fMenuSelectedShape]("virtual");
				fDrawingInterface["erase"+fMenuSelectedContents]("virtual");
			}
			else{
			}
		}
		
	};		
	
	
	this.onMouseDragInterface = function(x,y,z){		
		
		if(!fObjectAddMode){
			var MindMap = fJobHandler.getMindMap();
			
			/*if(count < 10){
				count ++;
				return;
			}*/
			/*if(this.fSelectedObject !=null){
				this.moveMindObject([this.fSelectedObject.fMindObjectId[0],this.fSelectedObject.fMindObjectId[1]],x,y,z);
				count = 0;		
			}*/
			
			if(fMovingObject == null)		
				return;			
			else {			
				fIsDragging = true;
				moveCount++;
				if(moveCount == moveCountLimit){
					moveCount = 0;
					this.moveMindObject(fMovingObject.fMindObjectId,x,y,z);
				}
				
				var maxRelDistanceBySquare = MindMap.getMaxRelDistance()*MindMap.getMaxRelDistance();
				
				for(var i=0; i<MindMap.lenOfMindObjectsArray(); i++){
					var currentMindObject = MindMap.getMindObjectOnIndex(i);
					var Distance = distanceOfTwoPointsBySquare(currentMindObject.fX,currentMindObject.fY,currentMindObject.fZ,fMovingObject.fX,fMovingObject.fY,fMovingObject.fZ);
					//console.log(Distance);
					var isConnectedMindObject = false;
					for(var j=0; j<fMovingObject.lenOfRelatedObjectsArray(); j++){
						if(compareIdValue(currentMindObject.fMindObjectId, fMovingObject.getRelatedObjectOnIndex(j).fMindObjectId)){
							isConnectedMindObject = true;
						}
					}
					
					if(Distance !=0 && Distance <= maxRelDistanceBySquare && !isConnectedMindObject){
						//console.log("connect");
						this.connectMindObject(fMovingObject.fMindObjectId,
												MindMap.getMindObjectOnIndex(i).fMindObjectId, "SimplePathEdge", new SimplePathEdgeTypeDependentInfo(10,"#00ff00"));
					}
					else if(Distance !=0 && Distance > maxRelDistanceBySquare && isConnectedMindObject){
						//console.log("disconnect");
						this.disconnectMindObject(fMovingObject.fMindObjectId,
								MindMap.getMindObjectOnIndex(i).fMindObjectId, "SimplePathEdge");
					}
				}
				
			}
		}
		else{
			if(fVirtualMindObject == null){
				fVirtualMindObject = {fX : x,
										fY : y,
										fZ : z,
										fShape:{fShapeTypeDependentInfo:fMenuInsertedSDI}};
				
				fAddEventStartPointX = x;
				fAddEventStartPointY = y;
				fAddEventStartPointZ = z;
				
				switch(fMenuSelectedShape){
				case "PolygonShape" :
				case "CircleShape" :
					fMenuInsertedSDI.fRadius = 1;
					break;
				case "RectangleShape" :
					fMenuInsertedSDI.fWidth = 10;
					fMenuInsertedSDI.fHeight = 10;
					break;	
				case "StarShape" :
					fMenuInsertedSDI.fFirstRadius = 10;
					fMenuInsertedSDI.fSecondRadius = 5;
					break;							
				}
				
								
				fDrawingInterface["draw"+fMenuSelectedShape](x,y,z,fMenuInsertedSDI,"virtual");
				fDrawingInterface["draw"+fMenuSelectedContents](x,y,z,fMenuInsertedCDI,fMenuInsertedCV,"virtual");
				
				fDrawingInterface["changeOpacityOf"+fMenuSelectedShape](0.5,"virtual");
				fDrawingInterface["changeOpacityOf"+fMenuSelectedContents](0.5,"virtual");
			}
			else{

				
				var newX;
				var newY;
				var newZ;
				
				switch(fMenuSelectedShape){
				case "PolygonShape" :
				case "CircleShape" :
				
					var xDiff = x - fAddEventStartPointX;
					var yDiff = y - fAddEventStartPointY;
					var zDiff = z - fAddEventStartPointZ;
					
					var distance = distanceOfTwoPoints(x,y,z,fAddEventStartPointX,fAddEventStartPointY,fAddEventStartPointZ);
					var ratioFactor = zDiff==0?1.414:1.732;
					var eDistance = distance/ratioFactor;
					
					var midX;
					var midY;
					var midZ;
					
					if(xDiff>=0)
						midX = fAddEventStartPointX + eDistance;
					else
						midX = fAddEventStartPointX - eDistance;
						
					if(yDiff>=0)
						midY = fAddEventStartPointY + eDistance;
					else
						midY = fAddEventStartPointY - eDistance;
					
					if(zDiff>=0)
						midZ = fAddEventStartPointZ + eDistance;
					else
						midZ = fAddEventStartPointZ - eDistance;
					
					newX = (fAddEventStartPointX + midX)/2;
					newY = (fAddEventStartPointY + midY)/2;
					newZ = (fAddEventStartPointZ + midZ)/2;

					
					var newRadius = eDistance/2;

					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fRadius = newRadius;
					
					break;
				case "RectangleShape" :
					var xDiff = x - fAddEventStartPointX;
					var yDiff = y - fAddEventStartPointY;
					var zDiff = z - fAddEventStartPointZ;
					
					newX = (x + fAddEventStartPointX)/2;
					newY = (y + fAddEventStartPointY)/2;
					newZ = (z + fAddEventStartPointZ)/2;
					
					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fWidth = xDiff>0?xDiff:-xDiff;
					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fHeight = yDiff>0?yDiff:-yDiff;
					
						
					break;
					
				case "StarShape" :
				
					var xDiff = x - fAddEventStartPointX;
					var yDiff = y - fAddEventStartPointY;
					var zDiff = z - fAddEventStartPointZ;
					
					var distance = distanceOfTwoPoints(x,y,z,fAddEventStartPointX,fAddEventStartPointY,fAddEventStartPointZ);
					var ratioFactor = zDiff==0?1.414:1.732;
					var eDistance = distance/ratioFactor;
					
					var midX;
					var midY;
					var midZ;
					
					if(xDiff>=0)
						midX = fAddEventStartPointX + eDistance;
					else
						midX = fAddEventStartPointX - eDistance;
						
					if(yDiff>=0)
						midY = fAddEventStartPointY + eDistance;
					else
						midY = fAddEventStartPointY - eDistance;
					
					if(zDiff>=0)
						midZ = fAddEventStartPointZ + eDistance;
					else
						midZ = fAddEventStartPointZ - eDistance;
					
					newX = (fAddEventStartPointX + midX)/2;
					newY = (fAddEventStartPointY + midY)/2;
					newZ = (fAddEventStartPointZ + midZ)/2;

					
					var newRadius = eDistance/2;
					
					var firstRadius = fVirtualMindObject.fShape.fShapeTypeDependentInfo.fFirstRadius;
					var secondRadius = fVirtualMindObject.fShape.fShapeTypeDependentInfo.fSecondRadius;
					
					var fsRatio = secondRadius / firstRadius;

					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fFirstRadius = firstRadius > secondRadius ? newRadius : newRadius/fsRatio;
					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fSecondRadius = firstRadius > secondRadius ? newRadius*fsRatio : newRadius;
					
					break;					
					//fMenuInsertedSDI.fRadius = newRadius;					
				}
				
				fVirtualMindObject.fX = newX;
				fVirtualMindObject.fY = newY;
				fVirtualMindObject.fZ = newZ;
				
				fDrawingInterface["move"+fMenuSelectedShape](newX,newY,newZ,"virtual");
				fDrawingInterface["move"+fMenuSelectedContents](newX,newY,newZ,"virtual");
				
				fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
										{fMindObjectId : "virtual",
										fShape : {fShapeType : fMenuSelectedShape,
													fShapeTypeDependentInfo : fVirtualMindObject.fShape.fShapeTypeDependentInfo
										}}]);
				
				//fDrawingInterface["resize"+fMenuSelectedShape](fVirtualMindObject.fShape.fShapeTypeDependentInfo,"virtual");
				//fDrawingInterface["move"+fMenuSelectedShape](x,y,z,"virtual");
				//fDrawingInterface["move"+fMenuSelectedContents](x,y,z,"virtual");
			}			
		}
		
		
	};
	
	this.onMouseMoveInterface = function(x,y,z){
		if(!fObjectAddMode){
		}
		else{
			/*if(fVirtualMindObject == null){
				fVirtualMindObject = {};
				fDrawingInterface["draw"+fMenuSelectedShape](x,y,z,fMenuInsertedSDI,"virtual");
				fDrawingInterface["draw"+fMenuSelectedContents](x,y,z,fMenuInsertedCDI,fMenuInsertedCV,"virtual");
				
				fDrawingInterface["changeOpacityOf"+fMenuSelectedShape](0.5,"virtual");
				fDrawingInterface["changeOpacityOf"+fMenuSelectedContents](0.5,"virtual");				
			}
			else{
				fDrawingInterface["move"+fMenuSelectedShape](x,y,z,"virtual");
				fDrawingInterface["move"+fMenuSelectedContents](x,y,z,"virtual");
			}*/
		}
	};
	
	//Basic Functionality Functions
	
	this.connectToServer = function(){		
		var ret = fSocketHelper.connectToServer();
		if(ret)
			fIsConnectedToServer = true;
		else{
			fIsConnectedToServer = false;
			console.log("Failed to connect to ThinkMine Server");
		}
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
		
		//fMindMapId = mindMapId;
		fMovingObject = null;
		fSelectedObject = null;
		
		fSocketHelper.fSocketDataCommuHelperSender.mindMapRequestMindInfo(mindMapId);
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
				console.log("ThinkMineCanvas - addMindObject Error : ContentsTypeDependentInfo Obj is invalid");
				return;
			}
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectCreateSend(fJobHandler.getMindMap().fMindMapId,
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
		console.log("delete send");
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectRemoveSend(fJobHandler.getMindMap().fMindMapId,	
																		mindObjectId);
		
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
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectMoveSend(fJobHandler.getMindMap().fMindMapId,
																			mindObjectId,
																			x,
																			y,
																			z);
																			
	};
	
	this.putIntoMindObject = function(mindObject, dstMindMapId){
		if(mindObject == null || dstMindMapId == undefined || dstMindMapId == null || mindObject == undefined){
			console.log("ThinkMineCanvas - putIntoMindObject Error : mindObjectId or dstMindMapId is invalid");
			return;
		}
		var x = Math.random();
		var y = Math.random();
		var z = Math.random();
		
		//Need to implement shirinking effect of MindObject
		
		var contentsEditor = document.getElementById('ContentsEditor');
		if(contentsEditor != null)
			contentsEditor.parentNode.removeChild(contentsEditor);				
		
		var applyButton = document.getElementById('ApplyButton');
		if(applyButton != null)
			applyButton.parentNode.removeChild(applyButton);
		

		fSocketHelper.fSocketDataCommuHelperSender.mindObjectPutIntoSend(fJobHandler.getMindMap().fMindMapId, 
																		mindObject, 
																		dstMindMapId, 
																		x, 
																		y, 
																		z);
	};
																			
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
		
		if(srcMindObjectId == dstMindObjectId){
			console.log("ThinkeMineCanvas - connectMindObject Error : srcMindObjectId and dstMindMapId are same");
			return;
		}
		
		if(edgeTypeDependentInfo == null || edgeTypeDependentInfo == undefined || !(edgeTypeDependentInfo instanceof EdgeTypeDependentInfo)){
			console.log("ThinkMineCanvas - connectMindObject Error : edgeTypeDependentInfo is invalid");
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectConnectToSend(fJobHandler.getMindMap().fMindMapId,
																				srcMindObjectId,
																				dstMindObjectId, 
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
			
			fSocketHelper.fSocketDataCommuHelperSender.mindObjectDisconnectFromSend(fJobHandler.getMindMap().fMindMapId,
																							srcMindObjectId,
																							dstMindObjectId, 
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
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeColorOfContentsSend(fJobHandler.getMindMap().fMindMapId,
																						 mindObjectId,
																						 color);		
	};
	
	this.changeValueOfContents = function(mindObjectId, contentsType ,contentsValue){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - changeColorOfContents Error : mindObjectId is invalid");
			return;		
		}		
		if(contentsValue == null || contentsValue == undefined || typeof(contentsValue) != "string"){
			console.log("ThinkMineCanvas - changeValueOfContents Error : contentsValue is invalid");
			return;
		}
		if(contentsType == null || contentsType == undefined || typeof(contentsType) != "string"){
			console.log("ThinkMineCanvas - changeValueOfContents Error : contentsType is invalid");
			return;
		}
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeValueOfContentsSend(fJobHandler.getMindMap().fMindMapId, 
																						mindObjectId, 
																						contentsType, 
																						contentsValue)
		
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
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeColorOfShapeSend(fJobHandler.getMindMap().fMindMapId,
																						 mindObjectId,
																						 color);		
	};
	
	this.resizeShape = function(mindObjectId, shape){
		if(!(shape instanceof Shape)){
			console.log("ThinkMineCanvas - resizeShape Error : Wrong type of Shape Obj");
			return;
		}
		else {
			if(shape.fShapeTypeDependentInfo == null || shape.fShapeTypeDependentInfo == undefined || !(shape.fShapeTypeDependentInfo instanceof ShapeTypeDependentInfo)
					|| shape.fShapeType == null || shape.fShapeType == undefined || typeof(shape.fShapeType) != "string" ){
				console.log("ThinkMineCanvas - resizeShape Error : Not sufficient Shape Member Variable");
				return;
			}
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectResizeShapeSend(fJobHandler.getMindMap().fMindMapId,
																				mindObjectId,
																				shape);
		
	};
	
	
	this.changeDrawingInterface = function (newDrawingInterface){
		fDrawingInterface = newDrawingInterface;
	};
	
};


//------------------- MindMap Section--------------------------------------

function MindMap(mindMapId, parentMindObjectId){
	
	this.fMindMapId = mindMapId;
	this.fTitle = "";
	this.fParentMindObjectId = parentMindObjectId;
	
	var fMindObjects = new Array();
	var fMaxRelDistance = 300;
	var fMaxMindObjectCount = 100;
	var fLimitX = 1200;
	var fLimitY = 800;
	var fLimitZ = 1000;

	
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
	
	this.setLimitX = function(limitX){
		fLimitX = limitX;
	};
	this.getLimitX = function(){
		return fLimitX;
	};

	this.setLimitY = function(limitY){
		fLimitY = limitY;
	};
	this.getLimitY = function(){
		return fLimitY;
	};
	
	this.setLimitZ = function(limitZ){
		fLimitZ = limitZ;
	};
	this.getLimitZ = function(){
		return fLimitZ;
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
		this.removeMindObject();
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

function EllipseShapeTypeDependentInfo(width, height, color){
	this.fWidth = width;
	this.fHeight = height;
	this.fColor = color;
}
EllipseShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
EllipseShapeTypeDependentInfo.constructor = EllipseShapeTypeDependentInfo; 


function RectangleShapeTypeDependentInfo(width, height, color, isRounded){
	this.fWidth = width;
	this.fHeight = height;
	this.fColor = color;
	this.fIsRounded = isRounded;
}
RectangleShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
RectangleShapeTypeDependentInfo.constructor = RectangleShapeTypeDependentInfo; 



function StarShapeTypeDependentInfo(nrPoints, firstRadius, secondRadius,color){
	this.fNrPoints = nrPoints;
	this.fFirstRadius = firstRadius;
	this.fSecondRadius = secondRadius;
	this.fColor = color;
}
StarShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
StarShapeTypeDependentInfo.constructor = StarShapeTypeDependentInfo; 



function PolygonShapeTypeDependentInfo(nrSides, radius, color){
	this.fNrSides = nrSides;
	this.fRadius = radius;
	this.fColor = color;
}
PolygonShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
PolygonShapeTypeDependentInfo.constructor = PolygonShapeTypeDependentInfo; 


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


function ImageContentsTypeDependentInfo(width, height, opacity){
	this.fWidth = width;
	this.fHeight = height;
	this.fOpacity = opacity;	
}

ImageContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
ImageContentsTypeDependentInfo.constructor = ImageContentsTypeDependentInfo;

function MovieContentsTypeDependentInfo(width, height){
	this.fWidth = width;
	this.fHeight = height;	
}

MovieContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
MovieContentsTypeDependentInfo.constructor = MovieContentsTypeDependentInfo;

function WebPreviewContentsTypeDependentInfo(width, height, resolution, opacity){
	this.fWidth = width;
	this.fHeight = height;
	this.fResolution = resolution;
	this.fOpacity = opacity;	
}

WebPreviewContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
WebPreviewContentsTypeDependentInfo.constructor = WebPreviewContentsTypeDependentInfo;

//------------------- Decoder/Encoder Section -------------------------------

function Encoder(){
	this.encodeShapeType = function(shapeType){
		var ret;
		switch (shapeType){
		case "CircleShape" :
			ret = 16777216;
			break;
		case "EllipseShape" :
			ret = 16842752;
			break;
		case "RectangleShape" :
			ret = 33554432;
			break;
		case "StarShape" : 
			ret = 50331648;
			break;
		case "PolygonShape" : 
			ret = 67108864;
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
		case "WebPreviewContents" :
			ret = 83886080;
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
		case 16842752 :
			ret = "EllipseShape";
			break;
		case 33554432 :
			ret = "RectangleShape";
			break;
		case 50331648 :
			ret = "StarShape";
			break;
		case 67108864:
			ret = "PolygonShape";
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
		case 83886080 :
			ret = "WebPreviewContents";
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

	this.getMindMap = function(){
		return fMindMap;
	}
	
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
			handleMindObjectPutIntoEvent(eventCode);
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
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
			handleChangeValueOfContentsEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			break;
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
			handleChangeColorOfShapeEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_SHAPE :
			break;
		case CODE_MIND_RESIZE_SHAPE :
			handleResizeShape(eventCode);
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
		var mindMapId = eventCode.MMID;
		var title = eventCode.TT;
		var parentMindObjectId = eventCode.PMOID;
					
		var mindObjectsArrayForDrawing = new Array();
		var edgesArrayForDrawing = new Array();
		
		var relatedMindObjectsInfoArray = new Array();			
		
		
		for(var i=0; i<eventCode.CMOS.length;i++){				
			
			var tempMindObjectId = eventCode.CMOS[i][0];
			var tempChildMindMapId = eventCode.CMOS[i][1];					
			
			
			
			
			var x = eventCode.CMOS[i][2];							
			var y = eventCode.CMOS[i][3];				
			var z = eventCode.CMOS[i][4];				
			
			
			
			
			var tempShapeType = fDecoder.decodeShapeType(eventCode.CMOS[i][5]);				
			var tempShapeTypeDependentInfo;
			
			var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.CMOS[i][5]);
			var tempShapeTypeDependentInfoForDrawing;
			
			
							
			tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType, eventCode.CMOS[i][6]);						
			tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeType, eventCode.CMOS[i][6]);
							
			
			var tempShape = new Shape(tempShapeType, tempShapeTypeDependentInfo);				
			var tempShapeForDrawing = new Shape(tempShapeTypeForDrawing, tempShapeTypeDependentInfoForDrawing);
			
			
			var tempContentsType = fDecoder.decodeContentsType(eventCode.CMOS[i][7]);				
			var tempContentsTypeDependentInfo;
			
			var tempContentsTypeForDrawing = fDecoder.decodeContentsType(eventCode.CMOS[i][7]);				
			var tempContentsTypeDependentInfoForDrawing;
			
			tempContentsTypeDependentInfo = getObjTypeDependentInfo(tempContentsType, eventCode.CMOS[i][8]);
			tempContentsTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempContentsType, eventCode.CMOS[i][8]);
			
			
			var tempContentsValue = eventCode.CMOS[i][9];
			var tempContents = new Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);
			
			var tempContentsValueForDrawing = eventCode.CMOS[i][9];
			var tempContentsForDrawing = new Contents(tempContentsTypeForDrawing, tempContentsTypeDependentInfoForDrawing, tempContentsValueForDrawing);
			
			
			var tempRelatedMindObjects = eventCode.CMOS[i][10];								
			var tempMindObject = new MindObject(tempMindObjectId, tempChildMindMapId, mindMapId, tempShape, tempContents , x, y, z);
			
			mindMapTemp.pushNewMindObject(tempMindObject);
			relatedMindObjectsInfoArray.push(tempRelatedMindObjects);
			
			var tempMindObjectForDrawing = {fX : tempMindObject.fX,
											fY : tempMindObject.fY,
											fZ : tempMindObject.fZ,
											fShape : tempShapeForDrawing,
											fContents : tempContentsForDrawing,
											fMindObjectId : tempMindObject.fMindObjectId							
											};
			
			mindObjectsArrayForDrawing.push(tempMindObjectForDrawing);
			
		}
		
		var maxRelDistance = eventCode.MAXRD;
		var maxMindObjectCount = eventCode.MAXOC;
		
		var limitX = eventCode.LX;
		var limitY = eventCode.LY;
		var limitZ = eventCode.LZ;
		
		
		//MaxRelDistance,MaxObjectCount 처리, 연관 마인드 오브젝트 커넥트 처리
		
		//Related Objects
		for(var i=0; i<relatedMindObjectsInfoArray.length; i++){
			var relatedMindObjectsInfo = relatedMindObjectsInfoArray[i];
			for(var j=0; j<relatedMindObjectsInfo.length; j+=3){
				var isExsist = false;					
				for(var k=0; k<mindMapTemp.getMindObjectOnIndex(i).lenOfRelatedObjectsArray(); k++){						
					if(compareIdValue(relatedMindObjectsInfo[j],
							mindMapTemp.getMindObjectOnIndex(i).getRelatedObjectOnIndex(k).fMindObjectId)){
						isExsist = true;							
						break;
					}
				}
				if(!isExsist){						
					var connectingObj = null;
					
					for(var k=0; k<mindMapTemp.lenOfMindObjectsArray(); k++){
						if(compareIdValue(relatedMindObjectsInfo[j],
								mindMapTemp.getMindObjectOnIndex(k).fMindObjectId)){
							connectingObj = mindMapTemp.getMindObjectOnIndex(k);
							break;
						}
					}
					if(connectingObj != mindMapTemp.getMindObjectOnIndex(i) && connectingObj != null){
						var tempEdgeType = fDecoder.decodeEdgeType(relatedMindObjectsInfo[j+1]);							
						var tempEdgeTypeDependentInfo;
						
						var tempEdgeTypeForDrawing = fDecoder.decodeEdgeType(relatedMindObjectsInfo[j+1]);							
						var tempEdgeTypeDependentInfoForDrawing;		
						
						tempEdgeTypeDependentInfo = getObjTypeDependentInfo(tempEdgeType, relatedMindObjectsInfo[j+2]);
						tempEdgeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempEdgeType, relatedMindObjectsInfo[j+2]);
						
						mindMapTemp.getMindObjectOnIndex(i).connectTo(connectingObj, tempEdgeType, tempEdgeTypeDependentInfo);
						
						var tempEdgeForDrawing = {fFirstMindObject : {fX : mindMapTemp.getMindObjectOnIndex(i).fX,
																	  fY : mindMapTemp.getMindObjectOnIndex(i).fY,
																	  fZ : mindMapTemp.getMindObjectOnIndex(i).fZ,
																	  fMindObjectId : mindMapTemp.getMindObjectOnIndex(i).fMindObjectId							
																	},
													fSecondMindObject : {fX : connectingObj.fX,
																		 fY : connectingObj.fY,
																		 fZ : connectingObj.fZ,
																		 fMindObjectId : connectingObj.fMindObjectId							
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
		mindMapTemp.fTitle = title;
		mindMapTemp.fParentMindObjectId = parentMindObjectId;
		
		mindMapTemp.setMaxRelDistance(maxRelDistance);
		mindMapTemp.setMaxMindObjectCount(maxMindObjectCount);
		mindMapTemp.setLimitX(limitX);
		mindMapTemp.setLimitY(limitY);
		mindMapTemp.setLimitZ(limitZ);
		
		fMindMap = mindMapTemp;
		
		var drawingJob = new Array();
		drawingJob.push(CODE_MIND_MAP_REQUEST_MIND_INFO);
		drawingJob.push(mindObjectsArrayForDrawing);
		drawingJob.push(edgesArrayForDrawing);
		fDrawingObj.pushNewJob(drawingJob);
	};
	
	var handleMindObjectAddEvent = function(eventCode){
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID))
				return;
		}
		
		var tempShape;
		var tempShapeType = fDecoder.decodeShapeType(eventCode.ST);
		var tempShapeTypeDependentInfo;
		
		var tempShapeForDrawing;
		var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.ST);
		var tempShapeTypeDependentInfoForDrawing;	
		
		
		tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType, eventCode.STDI);						
		tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeType, eventCode.STDI);
		
		//Need to Code Generalization
		switch(tempShapeType){
		case "PolygonShape" :
		case "CircleShape" :
			var finalRadius = tempShapeTypeDependentInfoForDrawing.fRadius;
			tempShapeTypeDependentInfoForDrawing.fRadius = 10;
			
			var curRadius = tempShapeTypeDependentInfoForDrawing.fRadius;
			var repeatCount = parseInt((finalRadius - curRadius + 3)/3);
			break;
		case "RectangleShape" :
			var finalWidth = tempShapeTypeDependentInfoForDrawing.fWidth;
			var finalHeight = tempShapeTypeDependentInfoForDrawing.fHeight;
			var whRatio = finalHeight/finalWidth;
			tempShapeTypeDependentInfoForDrawing.fWidth = 10;
			tempShapeTypeDependentInfoForDrawing.fHeight = 10;
			var curWidth = tempShapeTypeDependentInfoForDrawing.fWidth;
			var curHeight = tempShapeTypeDependentInfoForDrawing.fHeight;
			
			var repeatCount = parseInt((finalWidth - curWidth + 3)/3);
		case "StarShape" :
			var finalFirstRadius = tempShapeTypeDependentInfoForDrawing.fFirstRadius;
			var finalSecondRadius = tempShapeTypeDependentInfoForDrawing.fSecondRadius;
			var finalOuterRadius = finalFirstRadius > finalSecondRadius? finalFirstRadius : finalSecondRadius;
			
			tempShapeTypeDependentInfoForDrawing.fFirstRadius = finalFirstRadius > finalSecondRadius? 10 : 5;
			tempShapeTypeDependentInfoForDrawing.fSecondRadius = finalFirstRadius > finalSecondRadius? 5 : 10;
			
			var curOuterRadius = tempShapeTypeDependentInfoForDrawing.fFirstRadius > tempShapeTypeDependentInfoForDrawing.fSecondRadius?
									tempShapeTypeDependentInfoForDrawing.fFirstRadius : tempShapeTypeDependentInfoForDrawing.fSecondRadius;
									
			var fsRatio = finalFirstRadius > finalSecondRadius? (finalSecondRadius / finalFirstRadius) : (finalFirstRadius / finalSecondRadius);
			var repeatCount = parseInt((finalOuterRadius - curOuterRadius + 3)/3);
			
			break;		
		}

		 
		//
		
		tempShape = new Shape(tempShapeType, tempShapeTypeDependentInfo);
		tempShapeForDrawing = new Shape(tempShapeTypeForDrawing, tempShapeTypeDependentInfoForDrawing);
					
		var tempContents;
		var tempContentsType = fDecoder.decodeContentsType(eventCode.CT);
		var tempContentsTypeDependentInfo;
		var tempContentsValue = eventCode.CV;
		
		var tempContentsForDrawing;
		var tempContentsTypeForDrawing = fDecoder.decodeContentsType(eventCode.CT);
		var tempContentsTypeDependentInfoForDrawing;
		var tempContentsValueForDrawing = ""+eventCode.CV;	
		
		
		tempContentsTypeDependentInfo = getObjTypeDependentInfo(tempContentsType, eventCode.CTDI);
		tempContentsTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempContentsType, eventCode.CTDI);

		
		tempContents = new Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);
		
		tempContentsForDrawing = new Contents(tempContentsTypeForDrawing, tempContentsTypeDependentInfoForDrawing, tempContentsValueForDrawing);
		
		var tempMindObject = new MindObject (eventCode.MOID,										//MindObjectID1,2
												eventCode.CMMID,										//ChildMindMapID1,2
												eventCode.MMID,										//MindMapID1,2
												tempShape,											//Shape
												tempContents,										//Contents
												eventCode.X,										//x
												eventCode.Y,										//y
												eventCode.Z											//z
												);
		fMindMap.pushNewMindObject(tempMindObject);
		
		var tempMindObjectForDrawing = {fX : tempMindObject.fX,
										fY : tempMindObject.fY,
										fZ : tempMindObject.fZ,
										fShape : tempShapeForDrawing,
										fContents : tempContentsForDrawing,
										fMindObjectId : tempMindObject.fMindObjectId							
										};
		var drawingJob = new Array();
		drawingJob.push(CODE_MIND_ADD);
		drawingJob.push(tempMindObjectForDrawing);
		fDrawingObj.pushNewJob(drawingJob);


		
		var animWorker = new Worker("AnimationWorker.js");
		
		
		animWorker.onmessage = function (event){
			var data = event.data;
			
			if(data == 0){
				
				switch(tempShapeTypeForDrawing){
				case "PolygonShape" :
				case "CircleShape" :
					if(curRadius > finalRadius){
						tempShapeTypeDependentInfoForDrawing.fRadius = finalRadius;
						}
					else
						tempShapeTypeDependentInfoForDrawing.fRadius = curRadius;
					curRadius += 3;
					break;
				case "RectangleShape" :
					if(curWidth > finalWidth){
						tempShapeTypeDependentInfoForDrawing.fWidth = finalWidth;
						tempShapeTypeDependentInfoForDrawing.fHeight = finalHeight;
						}
					else{
						tempShapeTypeDependentInfoForDrawing.fWidth = curWidth;
						tempShapeTypeDependentInfoForDrawing.fHeight = curHeight;
					}
					curWidth += 3;
					curHeight += 3*whRatio;
					break;
				case "StarShape" :
					if(curOuterRadius > finalOuterRadius){
						tempShapeTypeDependentInfoForDrawing.fFirstRadius = finalFirstRadius;
						tempShapeTypeDependentInfoForDrawing.fSecondRadius = finalSecondRadius;
						}
					else{
						tempShapeTypeDependentInfoForDrawing.fFirstRadius = finalFirstRadius > finalSecondRadius? curOuterRadius : curOuterRadius*fsRatio;
						tempShapeTypeDependentInfoForDrawing.fSecondRadius = finalSecondRadius > finalFirstRadius? curOuterRadius : curOuterRadius*fsRatio;
					}
					curOuterRadius += 3;
					break;
				}
				
				fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
					{fMindObjectId : tempMindObject.fMindObjectId,
					fShape : {fShapeType : tempShapeTypeForDrawing,
								fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
					}}]);
				
			}
			else{
				animWorker.terminate();
				animWorker = null;
			}
			
	
		};
		
		
		animWorker.postMessage({repeatCount : repeatCount,
								interval : 10});
		
		/*for(var i=tempShapeTypeDependentInfoForDrawing.fRadius; i<=curRadius+3; i+=3){
			tempShapeTypeDependentInfoForDrawing.fRadius = i;
			fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
							{fMindObjectId : tempMindObject.fMindObjectId,
							fShape : {fShapeType : tempShapeTypeForDrawing,
										fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
							}}]);
			var delay = 1; // 5 second delay
			var now = new Date();
			var desiredTime = new Date().setSeconds(now.getSeconds() + delay);
console.log(now);
			while (now < desiredTime) {
				now = new Date(); // update the current time
				console.log(now);
			}
		}
		tempShapeTypeDependentInfoForDrawing.fRadius = curRadius;
		fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
						{fMindObjectId : tempMindObject.fMindObjectId,
						fShape : {fShapeType : tempShapeTypeForDrawing,
									fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
		}}]);*/

		
	};
	
	var handleMindObjectDelEvent = function(eventCode){
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)) {
				
				var tempDelMindObject = fMindMap.getMindObjectOnIndex(i);
				
				tempShapeType = "" + tempDelMindObject.fShape.fShapeType;
				tempContentsType = "" + tempDelMindObject.fContents.fContentsType;
				
				tempShapeTypeForDrawing = "" + tempDelMindObject.fShape.fShapeType;
				tempContentsTypeForDrawing = "" + tempDelMindObject.fContents.fContentsType;
				
				var tempDelMindObjectInfoForDrawing = {fShape : {fShapeType : tempShapeTypeForDrawing},
														fContents : {fContentsType : tempContentsTypeForDrawing},
														fMindObjectId : tempDelMindObject.fMindObjectId									
													};
				
				var tempDelEdgeInfoArrayForDrawing = new Array();
				
				for(var j=0; j<tempDelMindObject.lenOfConnectedEdgesArray(); j++){
					var tempDelEdge = tempDelMindObject.getConnectedEdgeOnIndex(j);
					
					tempDelEdgeInfoForDrawing = {fFirstMindObject : {fMindObjectId : tempDelEdge.fFirstMindObject.fMindObjectId},
													fSecondMindObject : {fMindObjectId : tempDelEdge.fSecondMindObject.fMindObjectId},
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
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				
				
				var tempShapeType = "" + fMindMap.getMindObjectOnIndex(i).fShape.fShapeType;
				var tempContentsType = "" + fMindMap.getMindObjectOnIndex(i).fContents.fContentsType;
				
				var pointArray = linearInterpolation(fMindMap.getMindObjectOnIndex(i).fX, 
													fMindMap.getMindObjectOnIndex(i).fY,
													fMindMap.getMindObjectOnIndex(i).fZ,
													eventCode.X,
													eventCode.Y,
													eventCode.Z,
													3);
				
//				for(var pointIndex = 0; pointIndex < pointArray.length; pointIndex++){
//				
//					fMindMap.getMindObjectOnIndex(i).fX = pointArray[pointIndex][0];
//					fMindMap.getMindObjectOnIndex(i).fY = pointArray[pointIndex][1];
//					fMindMap.getMindObjectOnIndex(i).fZ = pointArray[pointIndex][2];					
//					
//					tempMindObjectForDrawing = {fMindObjectId : eventCode.MOID,
//												fX : pointArray[pointIndex][0],
//												fY : pointArray[pointIndex][1],
//												fZ : pointArray[pointIndex][2],
//												fShape : {fShapeType : tempShapeType},
//												fContents : {fContentsType : tempContentsType}												
//												};
//					
//	
//					for(var j=0; j<fMindMap.getMindObjectOnIndex(i).lenOfConnectedEdgesArray(); j++){
//						
//						
//						
//						var tempEdgeForDrawing = {fEdgeType : "" + fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fEdgeType , 
//												  fFirstMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId} ,
//						                          fSecondMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId}
//						
//												};
//						
//						tempEdgeArrayForDrawing.push(tempEdgeForDrawing);
//					}
//					
//					fDrawingObj.pushNewJob([CODE_MIND_MOVE,
//					                        tempMindObjectForDrawing,
//					                        tempEdgeArrayForDrawing]);
//				}
				
				fMindMap.getMindObjectOnIndex(i).fX = eventCode.X;
				fMindMap.getMindObjectOnIndex(i).fY = eventCode.Y;
				fMindMap.getMindObjectOnIndex(i).fZ = eventCode.Z;				
				
				tempMindObjectForDrawing = {fMindObjectId : eventCode.MOID,
											fX : eventCode.X,
											fY : eventCode.Y,
											fZ : eventCode.Z,
											fShape : {fShapeType : tempShapeType},
											fContents : {fContentsType : tempContentsType}												
											};
				

				for(var j=0; j<fMindMap.getMindObjectOnIndex(i).lenOfConnectedEdgesArray(); j++){
					
					
					
					var tempEdgeForDrawing = {fEdgeType : "" + fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fEdgeType , 
											  fFirstMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId} ,
					                          fSecondMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId}
					
											};
					
					tempEdgeArrayForDrawing.push(tempEdgeForDrawing);
				}
				
				fDrawingObj.pushNewJob([CODE_MIND_MOVE,
				                        tempMindObjectForDrawing,
				                        tempEdgeArrayForDrawing,
				                        pointArray]);
				
				break;
			}
		}
	};
	
	var handleMindObjectPutIntoEvent = function(eventCode){
		if(eventCode.MMID == fMindMap.fMindMapId){
			for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
				if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)) {
					
					var tempDelMindObject = fMindMap.getMindObjectOnIndex(i);
					
					tempShapeType = "" + tempDelMindObject.fShape.fShapeType;
					tempContentsType = "" + tempDelMindObject.fContents.fContentsType;
					
					tempShapeTypeForDrawing = "" + tempDelMindObject.fShape.fShapeType;
					tempContentsTypeForDrawing = "" + tempDelMindObject.fContents.fContentsType;
					
					var tempDelMindObjectInfoForDrawing = {fShape : {fShapeType : tempShapeTypeForDrawing},
															fContents : {fContentsType : tempContentsTypeForDrawing},
															fMindObjectId : tempDelMindObject.fMindObjectId									
														};
					
					var tempDelEdgeInfoArrayForDrawing = new Array();
					
					for(var j=0; j<tempDelMindObject.lenOfConnectedEdgesArray(); j++){
						var tempDelEdge = tempDelMindObject.getConnectedEdgeOnIndex(j);
						
						tempDelEdgeInfoForDrawing = {fFirstMindObject : {fMindObjectId : tempDelEdge.fFirstMindObject.fMindObjectId},
														fSecondMindObject : {fMindObjectId : tempDelEdge.fSecondMindObject.fMindObjectId},
														fEdgeType : tempDelEdge.fEdgeType
													};
						
						tempDelEdgeInfoArrayForDrawing.push(tempDelEdgeInfoForDrawing);
					}
					
					fMindMap.getMindObjectOnIndex(i).putInto(null);
					fMindMap.removeMindObjectOnIndex(i);
					
					var drawingJob = new Array();
					drawingJob.push(CODE_MIND_PUT_INTO);
					drawingJob.push(0);
					drawingJob.push(tempDelMindObjectInfoForDrawing);
					drawingJob.push(tempDelEdgeInfoArrayForDrawing);
					
					fDrawingObj.pushNewJob(drawingJob);					
					
					break;
				}
			}
		}
		else if(eventCode.DMMID == fMindMap.fMindMapId){
			for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
				if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID))
					return;
			}
			
			var tempShape;
			var tempShapeType = fDecoder.decodeShapeType(eventCode.ST);
			var tempShapeTypeDependentInfo;
			
			var tempShapeForDrawing;
			var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.ST);
			var tempShapeTypeDependentInfoForDrawing;	
			
			
			tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType, eventCode.STDI);						
			tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeType, eventCode.STDI);			

			
			tempShape = new Shape(tempShapeType, tempShapeTypeDependentInfo);
			tempShapeForDrawing = new Shape(tempShapeTypeForDrawing, tempShapeTypeDependentInfoForDrawing);
						
			var tempContents;
			var tempContentsType = fDecoder.decodeContentsType(eventCode.CT);
			var tempContentsTypeDependentInfo;
			var tempContentsValue = eventCode.CV;
			
			var tempContentsForDrawing;
			var tempContentsTypeForDrawing = fDecoder.decodeContentsType(eventCode.CT);
			var tempContentsTypeDependentInfoForDrawing;
			var tempContentsValueForDrawing = ""+eventCode.CV;	
			
			
			tempContentsTypeDependentInfo = getObjTypeDependentInfo(tempContentsType, eventCode.CTDI);
			tempContentsTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempContentsType, eventCode.CTDI);

			
			tempContents = new Contents(tempContentsType, tempContentsTypeDependentInfo, tempContentsValue);
			
			tempContentsForDrawing = new Contents(tempContentsTypeForDrawing, tempContentsTypeDependentInfoForDrawing, tempContentsValueForDrawing);
			
			var tempMindObject = new MindObject (eventCode.MOID,										//MindObjectID1,2
													eventCode.MOID,										//ChildMindMapID1,2
													eventCode.DMMID,										//MindMapID1,2
													tempShape,											//Shape
													tempContents,										//Contents
													eventCode.X,										//x
													eventCode.Y,										//y
													eventCode.Z											//z
													);
			fMindMap.pushNewMindObject(tempMindObject);
			
			var tempMindObjectForDrawing = {fX : tempMindObject.fX,
											fY : tempMindObject.fY,
											fZ : tempMindObject.fZ,
											fShape : tempShapeForDrawing,
											fContents : tempContentsForDrawing,
											fMindObjectId : tempMindObject.fMindObjectId							
											};
			var drawingJob = new Array();
			drawingJob.push(CODE_MIND_PUT_INTO);
			drawingJob.push(1);
			drawingJob.push(tempMindObjectForDrawing);
			fDrawingObj.pushNewJob(drawingJob);	
		}
		else{
			//do nothing
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
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId, eventCode.MOID)){
				originMindObject = fMindMap.getMindObjectOnIndex(i);
			}
			if( compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId, eventCode.TMOID)){
				targetMindObject = fMindMap.getMindObjectOnIndex(i);
			}
		}
		if(originMindObject == null || targetMindObject == null)
			return;
		
		for(var i=0; i< originMindObject.lenOfRelatedObjectsArray(); i++){
			if(compareIdValue(originMindObject.getRelatedObjectOnIndex(i).fMindObjectId,targetMindObject.fMindObjectId))
				return;
		}
		
		tempEdgeType = fDecoder.decodeEdgeType(eventCode.ET);
		tempEdgeTypeForDrawing = fDecoder.decodeEdgeType(eventCode.ET); 			
		
		
		tempEdgeTypeDependentInfo = getObjTypeDependentInfo(tempEdgeType, eventCode.ETDI);
		tempEdgeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempEdgeType, eventCode.ETDI);
		
		
		
		originMindObject.connectTo(targetMindObject, tempEdgeType, tempEdgeTypeDependentInfo);

		originMindObjectForDrawing = {fX : originMindObject.fX ,
										fY : originMindObject.fY ,
										fZ : originMindObject.fZ ,
										fMindObjectId : originMindObject.fMindObjectId
									};
		targetMindObjectForDrawing = {fX : targetMindObject.fX ,
										fY : targetMindObject.fY ,
										fZ : targetMindObject.fZ ,
										fMindObjectId : targetMindObject.fMindObjectId
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
			
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				originMindObject = fMindMap.getMindObjectOnIndex(i);
				break;
			}		
		}
		
		if(originMindObject == null)
			return;
		
		for(var i=0; i<originMindObject.lenOfConnectedEdgesArray(); i++){
			var currentEdge = originMindObject.getConnectedEdgeOnIndex(i);

			if(compareIdValue(eventCode.TMOID, currentEdge.fFirstMindObject.fMindObjectId)){
				targetEdge = currentEdge;
				targetMindObject = currentEdge.fFirstMindObject;
				break;
			}
			if (compareIdValue(eventCode.TMOID, currentEdge.fSecondMindObject.fMindObjectId)){
				targetEdge = currentEdge;
				targetMindObject = currentEdge.fSecondMindObject;
				break;
			}				
		}
		
		if(targetEdge == null)
			return;
		
		originMindObject.disconnectFrom(targetMindObject);

		tempEdgeForDrawing = {fEdgeType : ""+targetEdge.fEdgeType,
								fFirstMindObject : {fMindObjectId : originMindObject.fMindObjectId},
								fSecondMindObject : {fMindObjectId : targetMindObject.fMindObjectId}
							};
		

		
		
		fDrawingObj.pushNewJob([CODE_MIND_DISCONNECT_FROM,
									tempEdgeForDrawing]);		
	};
	
	var handleChangeColorOfContentsEvent = function(eventCode){
		
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor == undefined)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor = eventCode.CC;
		
		var tempMindObjectForDrawing = {fContents : {fContentsType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsType},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_COLOR_OF_CONTENTS,
		                        tempMindObjectForDrawing,
		                        ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fColor
		                        ]);
		
		
	};
	
	var handleChangeValueOfContentsEvent = function(eventCode){
	
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fContents == undefined ||
			fMindMap.getMindObjectOnIndex(targetIndex).fContents == null)
			return;
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fContents.fValue == undefined || 
			fMindMap.getMindObjectOnIndex(targetIndex).fContents.fValue == null)
			return;
		
		fMindMap.getMindObjectOnIndex(targetIndex).fContents.fValue = eventCode.CV;
		
		var tempMindObjectForDrawing = {fX : fMindMap.getMindObjectOnIndex(targetIndex).fX ,
										fY : fMindMap.getMindObjectOnIndex(targetIndex).fY ,
										fZ : fMindMap.getMindObjectOnIndex(targetIndex).fZ ,
										fContents : {fContentsType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsType,
													 fContentsTypeDependentInfo : fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo,
													 fValue : ""+eventCode.CV},
										fMindObjectId : ""+eventCode.MOID													
										};
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_VALUE_OF_CONTENTS,
								tempMindObjectForDrawing
								]);

	};
	
	var handleChangeColorOfShapeEvent = function(eventCode){
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor == undefined)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor = eventCode.CC;
		
		var tempMindObjectForDrawing = {fShape : {fShapeType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeType},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_COLOR_OF_SHAPE,
		                        tempMindObjectForDrawing,
		                        ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fColor
		                        ]);
		
	};
	
	var handleResizeShape = function(eventCode){
	
		var targetIndex = -1;
		var tempShapeType = fDecoder.decodeShapeType(eventCode.ST);
		var tempShapeTypeDependentInfo = getObjTypeDependentInfo(tempShapeType,eventCode.STDI);
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
	
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fShape == undefined || fMindMap.getMindObjectOnIndex(targetIndex).fShape == null)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).changeShape(new Shape(tempShape,tempShapeTypeDependentInfo));

		var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.ST);
		var tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeTypeForDrawing,eventCode.STDI);
		
		var tempMindObjectForDrawing = {fShape : {fShapeType : ""+tempShapeTypeForDrawing,
													fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
										
		fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
		                        tempMindObjectForDrawing]);
			
	};

	var handleLatestJob = function(){
		if(fJobQ.length == 0 || fMutexLocked == true)
			return;
		fMutexLocked = true;
		var latestJob = fJobQ[0];
		fJobQ.splice(0,1);
		var ret = 0;
		if(fMindMap != null){
			if(latestJob.MMID == fMindMap.fMindMapId) 
				ret = handleEventCode(latestJob);			
			else {
				if(latestJob.Code == CODE_MIND_PUT_INTO) {
					if(latestJob.DMMID == fMindMap.fMindMapId){
						ret = handleEventCode(latestJob);
					}
				}
			}			
		}
		else{
			if(latestJob.Code == CODE_MIND_MAP_REQUEST_MIND_INFO)
				ret = handleEventCode(latestJob);
		}
		if(ret == 0){
			;//오류 메세지 출력 및 MindMap 재 초기화
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
		//Shape
		case "CircleShape" :
			ret = new CircleShapeTypeDependentInfo(parameterArray[0], parameterArray[1]);
			break;
		case "EllipseShape" :
			ret = new EllipseShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
			break;
		case "RectangleShape" :
			ret = new RectangleShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
			break;
		case "StarShape" :
			ret = new StarShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
			break;
		case "PolygonShape" :
			ret = new PolygonShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
			break;
		//Contents
		case "TextContents" :
			ret = new TextContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
			break;
		case "ImageContents" :
			ret = new ImageContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
			break;
		case "MovieContents" :
			ret = new MovieContentsTypeDependentInfo(parameterArray[0], parameterArray[1]);
			break;
		case "WebPreviewContents" :
			ret = new WebPreviewContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
			break;
		//Edge
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
									MMID : mindMapId,									
									X : x,
									Y : y,
									Z : z,
									ST : fEncoder.encodeShapeType(tempShapeType),
									STDI : tempShapeTypeDependentInfoArray,
									CT : fEncoder.encodeContentsType(tempContentsType),
									CTDI : tempContentsTypeDependentInfoArray,
									CV : tempContentsValue});		
		
	};
	this.mindObjectRemoveSend = function(mindMapId,mindObjectId){		
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_DEL,
										MMID : mindMapId,
										MOID : mindObjectId});
	};
	this.mindObjectMoveSend = function(mindMapId, mindObjectId, x, y, z){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_MOVE,
									MMID : mindMapId,
									MOID : mindObjectId,
									X : x,
									Y : y,
									Z : z});		
		
	};
	this.mindObjectPutIntoSend = function(mindMapId, mindObject, destinationMindMapId, x, y, z){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		var tempShapeType = mindObject.fShape.fShapeType;
		var tempShapeTypeDependentInfo = mindObject.fShape.fShapeTypeDependentInfo;
		var tempShapeTypeDependentInfoArray;
		
		
		
		
		tempShapeTypeDependentInfoArray = genArrayForCommu(tempShapeType, tempShapeTypeDependentInfo);
		
		if(tempShapeTypeDependentInfoArray == null){			
			console.log("SocketDataCommuHelperSender - mindObjectPutIntoSend : There is no matched type");			
			return;
		}
		
		
		
		var tempContentsType = mindObject.fContents.fContentsType;
		var tempContentsTypeDependentInfo = mindObject.fContents.fContentsTypeDependentInfo;
		var tempContentsTypeDependentInfoArray;
		var tempContentsValue = mindObject.fContents.fValue;
		
		
		
		
		tempContentsTypeDependentInfoArray = genArrayForCommu(tempContentsType, tempContentsTypeDependentInfo);
		
		if(tempContentsTypeDependentInfoArray == null){			
			console.log("SocketDataCommuHelperSender - mindObjectPutIntoSend : There is no matched type");			
			return;
		}
		
		
		var SendInfo = {Code : CODE_MIND_PUT_INTO,
						MMID : mindMapId,
						MOID : mindObject.fMindObjectId,
						DMMID : destinationMindMapId,
						X : x,
						Y : y,
						Z : z,
						ST : fEncoder.encodeShapeType(tempShapeType),
						STDI : tempShapeTypeDependentInfoArray,
						CT : fEncoder.encodeContentsType(tempContentsType),
						CTDI : tempContentsTypeDependentInfoArray,
						CV : tempContentsValue};	
		
		
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
									MMID : mindMapId,
									MOID : mindObjectId,
									TMOID : targetMindObjectId,
									ET : fEncoder.encodeEdgeType(tempEdgeType),
									ETDI : tempEdgeTypeDependentInfoArray});	
		
		
	};
	this.mindObjectDisconnectFromSend = function(mindMapId, mindObjectId, targetMindObjectId, edgeType){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}		
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_DISCONNECT_FROM,
									MMID : mindMapId,
									MOID : mindObjectId,
									TMOID : targetMindObjectId,
									ET : fEncoder.encodeEdgeType(edgeType)});	
	};
	this.mindObjectChangeColorOfContentsSend = function(mindMapId, mindObjectId, colorCode){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fWSocket.emit('NewEvent',{Code : CODE_MIND_CHANGE_COLOR_OF_CONTENTS,
			MMID : mindMapId,
			MOID : mindObjectId,
			CC : colorCode});	
	};
	this.mindObjectChangeValueOfContentsSend = function(mindMapId, mindObjectId, contentsType, contentsValue){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fWSocket.emit('NewEvent',{Code : CODE_MIND_CHANGE_VALUE_OF_CONTENTS,
			MMID : mindMapId,
			MOID : mindObjectId,
			CT : fEncoder.encodeContentsType(contentsType),
			CV : contentsValue});	
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
			MMID : mindMapId,
			MOID : mindObjectId,
			CC : colorCode});	
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
	this.mindObjectResizeShapeSend = function(mindMapId,mindObjectId, shape){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		var tempShapeTypeDependentInfoArray = genArrayForCommu(shape.fShapeType, shape.fShapeTypeDependentInfo);
		
		fWSocket.emit('NewEvent',{Code : CODE_MIND_RESIZE_SHAPE,
			MMID : mindMapId,
			MOID : mindObjectId,
			ST : fEncoder.encodeShapeType(shape.fShapeType),
			STDI : tempShapeTypeDependentInfoArray});	
		
	};

	this.mindMapRequestMindInfo = function(mindMapId){	
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		fWSocket.emit('NewEvent',{Code : CODE_MIND_MAP_REQUEST_MIND_INFO,
										MMID : mindMapId});
	};
	
	var genArrayForCommu = function(type, typeDependentInfo){
		var ret;
		switch(type){
		//Shape
		case  "CircleShape" :
			ret = [typeDependentInfo.fRadius,	//Radius
                   typeDependentInfo.fColor];	//Color
			break;
		case "EllipseShape" :
			ret = [typeDependentInfo.fWidth,	//Width
                   typeDependentInfo.fHeight,	//Height
				   typeDependentInfo.fColor];	//Color 
			break;
		case  "RectangleShape" :
			ret = [typeDependentInfo.fWidth,	//Width
                   typeDependentInfo.fHeight,	//Height
				   typeDependentInfo.fColor,	//Color
				   typeDependentInfo.fIsRounded];	//IsRounded
			break;
		case  "StarShape" :
			ret = [typeDependentInfo.fNrPoints,	//Nr of Points
                   typeDependentInfo.fFirstRadius,	//First Radius
				   typeDependentInfo.fSecondRadius,	//Second Radius
				   typeDependentInfo.fColor];	//Color
			break;
		case  "PolygonShape" :
			ret = [typeDependentInfo.fNrSides,	//Nr of Sides
                   typeDependentInfo.fRadius,	//Radius
				   typeDependentInfo.fColor];	//Color
			break;
		//Contents
		case "TextContents" :
			ret = [typeDependentInfo.fColor,			//Color
                   typeDependentInfo.fFontFamily,		//FontFamily
                   typeDependentInfo.fFontWeight,		//FontWeight
                   typeDependentInfo.fFontSize];		//FontSize
			break;
		case "ImageContents" :
			ret = [typeDependentInfo.fWidth,			//Width
                   typeDependentInfo.fHeight,			//Height
                   typeDependentInfo.fOpacity];			//Opacity                   
			break;
		case "MovieContents" :
			ret = [typeDependentInfo.fWidth,			//Width
                   typeDependentInfo.fHeight];			//Height                                      
			break;
		case "WebPreviewContents" :
			ret = [typeDependentInfo.fWidth,			//Width
                   typeDependentInfo.fHeight,			//Height
				   typeDependentInfo.fResolution,		//Resolution
                   typeDependentInfo.fOpacity];			//Opacity  
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
		if(loadingInfo.MMID == null){
			;
		}
		else{
			fJobHandler.resetJobHandler();
			fJobHandler.pushNewJob(loadingInfo);
		}
	};
	this.onGetLatestEventRecv = function(newJob){
		if(fJobHandler == null || fWSocket == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		console.log(newJob);
		fJobHandler.pushNewJob(newJob);
	
		/*if(fJobHandler.getMindMap() == null)
			fJobHandler.pushNewJob(newJob);
		else {
			if(newJob.MMID == fJobHandler.getMindMap().fMindMapId)
				fJobHandler.pushNewJob(newJob);
			else{
				if(newJob.Code == CODE_MIND_PUT_INTO)
					
			}
		}
		*/
		//여기에 나중에 MindMapID에 따른 필터 추가 --> MindMapID이 안맞으면 전부 PASS, MindMapID가 맞는데 MindMap이 null이면 임시 잡큐에 push	

		//console.log("push new job");
		//fJobHandler.pushNewJob(newJob);		
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
		console.log(fDrawingJobQ.length);
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
			moveMindObject(drawingJob[1], drawingJob[2], drawingJob[3]);
			break;
		case CODE_MIND_PUT_INTO :
			putIntoMindObject(drawingJob[1], drawingJob[2], drawingJob[3]);
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
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
			changeValueOfContents(drawingJob[1]);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			change
			break;
		case CODE_MIND_CHANGE_COLOR_OF_SHAPE :
			changeColorOfShape(drawingJob[1],drawingJob[2]);
			break;
		case CODE_MIND_CHANGE_SHAPE :
			break;
		case CODE_MIND_CHANGE_PARENT_MIND_MAP :
			break;
		case CODE_MIND_RESIZE_SHAPE :
			resizeShape(drawingJob[1]);
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
			
			fDrawingInterface["draw"+tempShapeType](mindObjectInfoArray[i].fX,											//X
															mindObjectInfoArray[i].fY,									//Y
															mindObjectInfoArray[i].fZ,									//Z
															mindObjectInfoArray[i].fShape.fShapeTypeDependentInfo,		//Info
															mindObjectInfoArray[i].fMindObjectId);						//ObjectID
			
			var tempContentsType =  mindObjectInfoArray[i].fContents.fContentsType;
			
			fDrawingInterface["draw"+tempContentsType](mindObjectInfoArray[i].fX,											//X
															mindObjectInfoArray[i].fY,										//Y
															mindObjectInfoArray[i].fZ,										//Z
															mindObjectInfoArray[i].fContents.fContentsTypeDependentInfo,	//Info
															mindObjectInfoArray[i].fContents.fValue,						//Value
															mindObjectInfoArray[i].fMindObjectId);							//ObjectID
			
		}
		for(i=0; i<edgeObjects.length; i++){
			
			
			var tempEdgeType = edgeObjects[i].fEdgeType;
			
			fDrawingInterface["draw"+tempEdgeType](edgeObjects[i].fFirstMindObject.fX,							//Frist X
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
		
		fDrawingInterface["draw"+mindObject.fShape.fShapeType](mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fShape.fShapeTypeDependentInfo,
														mindObject.fMindObjectId);
		
		fDrawingInterface["draw"+mindObject.fContents.fContentsType](mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fContents.fContentsTypeDependentInfo,
														mindObject.fContents.fValue,
														mindObject.fMindObjectId);		
		
	};
	
	var eraseMindObject = function(delMindObjectInfo, delEdgeInfo){
		
		fDrawingInterface["erase"+delMindObjectInfo.fShape.fShapeType](delMindObjectInfo.fMindObjectId);

		fDrawingInterface["erase"+delMindObjectInfo.fContents.fContentsType](delMindObjectInfo.fMindObjectId);
		
		for(var i=0; i<delEdgeInfo.length; i++){
			fDrawingInterface["erase"+delEdgeInfo[i].fEdgeType](delEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																	delEdgeInfo[i].fSecondMindObject.fMindObjectId);
		}		
	};
	
	var moveMindObject = function(movMindObjectInfo, movEdgeInfo, pointArray){		

		
		for(var i=0; i<pointArray.length ; i++){			
		
			
			fDrawingInterface["move"+movMindObjectInfo.fShape.fShapeType](pointArray[i][0],
																				pointArray[i][1],
																				pointArray[i][2],
																				movMindObjectInfo.fMindObjectId);
			fDrawingInterface["move"+movMindObjectInfo.fContents.fContentsType](pointArray[i][0],
																					pointArray[i][1],
																					pointArray[i][2],
																					movMindObjectInfo.fMindObjectId);
			
			for(var j=0; j<movEdgeInfo.length; j++){
				fDrawingInterface["move"+movEdgeInfo[j].fEdgeType](pointArray[i][0],
																		pointArray[i][1],
																		pointArray[i][2],
																		movEdgeInfo[j].fFirstMindObject.fMindObjectId, 
																		movEdgeInfo[j].fSecondMindObject.fMindObjectId,
																		movMindObjectInfo.fMindObjectId);
			}
		}
		
//		getDrawingFunctionRef(movMindObjectInfo.fShape.fShapeType, "move")(movMindObjectInfo.fX,
//				movMindObjectInfo.fY,
//				movMindObjectInfo.fZ,
//				movMindObjectInfo.fMindObjectId);
//		getDrawingFunctionRef(movMindObjectInfo.fContents.fContentsType, "move")(movMindObjectInfo.fX,
//							movMindObjectInfo.fY,
//							movMindObjectInfo.fZ,
//							movMindObjectInfo.fMindObjectId);
//		
//		for(var i=0; i<movEdgeInfo.length; i++){
//		getDrawingFunctionRef(movEdgeInfo[i].fEdgeType, "move")(movMindObjectInfo.fX,
//				movMindObjectInfo.fY,
//				movMindObjectInfo.fZ,
//				movEdgeInfo[i].fFirstMindObject.fMindObjectId, 
//				movEdgeInfo[i].fSecondMindObject.fMindObjectId,
//				movMindObjectInfo.fMindObjectId);
//		}
		
		
		
	};
	
	var putIntoMindObject = function(flagValue, delMindObjectInfo_or_addMindObjectInfo, delEdgeInfo){
		
		//빠져들어가는 효과로 변경 필요
		if(flagValue == 0){
			var delMindObjectInfo = delMindObjectInfo_or_addMindObjectInfo;
			fDrawingInterface["erase"+delMindObjectInfo.fShape.fShapeType](delMindObjectInfo.fMindObjectId);

			fDrawingInterface["erase"+delMindObjectInfo.fContents.fContentsType](delMindObjectInfo.fMindObjectId);
			
			for(var i=0; i<delEdgeInfo.length; i++){
				fDrawingInterface["erase"+delEdgeInfo[i].fEdgeType](delEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																		delEdgeInfo[i].fSecondMindObject.fMindObjectId);
			}		
		}
		else{
			var mindObject = delMindObjectInfo_or_addMindObjectInfo;
			
			fDrawingInterface["draw"+mindObject.fShape.fShapeType](mindObject.fX, mindObject.fY, mindObject.fZ,
												mindObject.fShape.fShapeTypeDependentInfo,
												mindObject.fMindObjectId);
	
			fDrawingInterface["draw"+mindObject.fContents.fContentsType](mindObject.fX, mindObject.fY, mindObject.fZ,
															mindObject.fContents.fContentsTypeDependentInfo,
															mindObject.fContents.fValue,
															mindObject.fMindObjectId);	
		}
	};
	
	var drawEdge = function(newEdgeInfo){
		fDrawingInterface["draw"+newEdgeInfo.fEdgeType](newEdgeInfo.fFirstMindObject.fX,
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
		fDrawingInterface["erase"+delEdgeInfo.fEdgeType](delEdgeInfo.fFirstMindObject.fMindObjectId,
																delEdgeInfo.fSecondMindObject.fMindObjectId);
	};
	
	var changeColorOfContents = function(mindObjectInfo, colorCode){
		fDrawingInterface["changeColorOf"+mindObjectInfo.fContents.fContentsType](colorCode,
																					mindObjectInfo.fMindObjectId);
	};
	
	var changeValueOfContents = function(mindObjectInfo){
		fDrawingInterface["erase"+mindObjectInfo.fContents.fContentsType](mindObjectInfo.fMindObjectId);
		fDrawingInterface["draw"+mindObjectInfo.fContents.fContentsType](mindObjectInfo.fX,
																				mindObjectInfo.fY,
																				mindObjectInfo.fZ,
																				mindObjectInfo.fContents.fContentsTypeDependentInfo,
																				mindObjectInfo.fContents.fValue,
																				mindObjectInfo.fMindObjectId);
	};
	
	var changeColorOfShape = function(mindObjectInfo, colorCode){
		
		fDrawingInterface["changeColorOf"+mindObjectInfo.fShape.fShapeType](colorCode,
																				mindObjectInfo.fMindObjectId);
	};
	
	var resizeShape = function(mindObjectInfo){
		fDrawingInterface["resize"+mindObjectInfo.fShape.fShapeType](mindObjectInfo.fShape.fShapeTypeDependentInfo,mindObjectInfo.fMindObjectId);
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
		console.log(latestJob);
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
	
	//deprrecated
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
			case "RectangleShape" :
				retFunc = fDrawingInterface.drawRectangleShape;
				break;
			case "StarShape" :
				retFunc = fDrawingInterface.drawStarShape;
				break;
			case "PolygonShape" :
				retFunc = fDrawingInterface.drawPolygonShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.drawTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.drawImageContents;
				break;
			case "MovieContents" :
				retFunc = fDrawingInterface.drawMovieContents;
				break;
			case "WebPreviewContents" :
				retFunc = fDrawingInterface.drawWebPreviewContents;
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
			case "RectangleShape" :
				retFunc = fDrawingInterface.eraseRectangleShape;
				break;
			case "StarShape" :
				retFunc = fDrawingInterface.eraseStarShape;
				break;
			case "PolygonShape" :
				retFunc = fDrawingInterface.erasePolygonShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.eraseTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.eraseImageContents;
				break;
			case "MovieContents" :
				retFunc = fDrawingInterface.eraseMovieContents;
				break;
			case "WebPreviewContents" :
				retFunc = fDrawingInterface.eraseWebPreviewContents;
				break;
			case "SimplePathEdge" :
				retFunc = fDrawingInterface.eraseSimplePathEdge;
				break;
			case "All" :
				retFunc = fDrawingInterface.eraseAll;
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
			case "RectangleShape" :
				retFunc = fDrawingInterface.moveRectangleShape;
				break;
			case "StarShape" :
				retFunc = fDrawingInterface.moveStarShape;
				break;
			case "PolygonShape" :
				retFunc = fDrawingInterface.movePolygonShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.moveTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.moveImageContents;
				break;
			case "MovieContents" :
				retFunc = fDrawingInterface.moveMovieContents;
				break;
			case "WebPreviewContents" :
				retFunc = fDrawingInterface.moveWebPreviewContents;
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
			case "EllipseShape" :
				retFunc = fDrawingInterface.changeColorOfEllipseShape;
				break;
			case "RectangleShape" : 
				retFunc = fDrawingInterface.changeColorOfRectangleShape;
				break;
			case "StarShape" :
				retFunc = fDrawingInterface.changeColorOfStarShape;
				break;
			case "PolygonShape" :
				retFunc = fDrawingInterface.changeColorOfPolygonShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.changeColorOfTextContents;
			}
			break;
		case "changeOpacity" :
			switch(type){
			case "CircleShape" :
				retFunc = fDrawingInterface.changeOpacityOfCircleShape;
				break;
			case "EllipseShape" :
				retFunc = fDrawingInterface.changeOpacityOfEllipseShape;
				break;
			case "RectangleShape" :
				retFunc = fDrawingInterface.changeOpacityOfRectangleShape;
				break;
			case "StarShape" :
				retFunc = fDrawingInterface.changeOpacityOfStarShape;
				break;
			case "PolygonShape" :
				retFunc = fDrawingInterface.changeOpacityOfPolygonShape;
				break;
			case "TextContents" :
				retFunc = fDrawingInterface.changeOpacityOfTextContents;
				break;
			case "ImageContents" :
				retFunc = fDrawingInterface.changeOpacityOfImageContents;
				break;
			case "MovieContents" :
				retFunc = fDrawingInterface.changeOpacityOfMovieContents;
				break;
			case "WebPreviewContents" :
				retFunc = fDrawingInterface.changeOpacityOfWebPreviewContents;
				break;
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
	
	this.resizeCircleShape = function(info,mindObjectId){
	};
	
	this.changeColorOfCircleShape = function(colorCode, mindObjectId){
		
	};
	
	this.changeOpacityOfCircleShape = function(opacity, mindObjectId){
		
	};
	
	this.drawEllipseShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseEllipseShape = function(mindObjectId){
		
	};
	this.moveEllipseShape = function(x, y, z, mindObjectId){
		
	};	
	this.changeColorOfEllipseShape = function(colorCode, mindObjectId){
		
	};
	
	this.changeOpacityOfEllipseShape = function(opacity, mindObjectId){
		
	};
	
	
	this.drawRectangleShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseRectangleShape = function(mindObjectId){
		
	};
	this.moveRectangleShape = function(x, y, z, mindObjectId){
		
	};
	this.resizeRectangleShape = function(info,mindObjectId){
	
	};	
	this.changeColorOfRectangleShape = function(colorCode, mindObjectId){
		
	};
	
	this.changeOpacityOfRectangleShape = function(opacity, mindObjectId){
		
	};
	
	
	this.drawStarShape = function(x, y, z, info, mindObjectId){
		
	};
	this.eraseStarShape = function(mindObjectId){
		
	};
	this.moveStarShape = function(x, y, z, mindObjectId){
		
	};	
	this.resizeStarShape = function(info,mindObjectId){
	
	};	
	this.changeColorOfStarShape = function(colorCode, mindObjectId){
		
	};
	
	this.changeOpacityOfStarShape = function(opacity, mindObjectId){
		
	};
	
	
	
	this.drawPolygonShape = function(x, y, z, info, mindObjectId){
		
	};
	this.erasePolygonShape = function(mindObjectId){
		
	};
	this.movePolygonShape = function(x, y, z, mindObjectId){
		
	};
	this.resizePolygonShape = function(info,mindObjectId){
	
	};		
	this.changeColorOfPolygonShape = function(colorCode, mindObjectId){
		
	};
	
	this.changeOpacityOfPolygonShape = function(opacity, mindObjectId){
		
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
	this.changeOpacityOfTextContents = function(opacity, mindObjectId){
		
	};
	
	this.drawImageContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseImageContents = function(mindObjectId){
		
	};
	this.moveImageContents = function(x, y, z, mindObjectId){
		
	};
	this.changeOpacityOfImageContents = function(opacity, mindObjectId){
		
	};
	
	this.drawMovieContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseMovieContents = function(mindObjectId){
		
	};
	this.moveMovieContents = function(x, y, z, mindObjectId){
		
	};
	this.changeOpacityOfMovieContents = function(opacity, mindObjectId){
		
	};
	
	this.drawWebPreviewContents = function(x, y, z, info, value, mindObjectId){
		
	};
	this.eraseWebPreviewContents = function(mindObjectId){
		
	};
	this.moveWebPreviewContents = function(x, y, z, mindObjectId){
		
	};
	this.changeOpacityOfWebPreviewContents = function(opacity, mindObjectId){
		
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



//------------------- CollisionCheckInterface Section--------------------------------------

function CollisionCheckInterface(){
	this.isColliding = function(firstMindObject, secondMindObject){		
	};
	this.isContaining = function(x, y, z, mindObject){		
	};
}


//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PaperJS////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


//------------------- DrawingInterface Section--------------------------------------
//매개변수 명 변경 필요 (가독성 있게)
function PaperJS_DrawingInterface(backBoneType, canvasName){
	this.fBackBoneType = backBoneType;
	var fCanvasName = canvasName;	

	
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
		drawingObject.fShape = {fShapeTypeDependentInfo : {fRadius : info.fRadius}};
						
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
	this.resizeCircleShape = function(info,mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var scaleRatio = info.fRadius/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fRadius;

				if(scaleRatio != Infinity && !isNaN(scaleRatio)){
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fRadius = info.fRadius;
					fShapeObjects[i].scale(scaleRatio);
					
				
					paper.view.draw();
				}
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
	
	this.changeOpacityOfCircleShape = function(opacity, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].opacity = opacity;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	
	this.drawEllipseShape = function(x, y, z, info, mindObjectId){
		/*var position = new paper.Point(x,y);
		var drawingObject =	new paper.Path.Ellipse({
								center: [x, y],
								radius: [info.fWidth, info.fHeight],
								fillColor: info.fColor
							});	
		drawingObject.fMindObjectId = mindObjectId;
		paper.view.draw();
		
		fShapeObjects.push(drawingObject);*/
	};
	this.eraseEllipseShape = function(mindObjectId){
		/*for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){					
				fShapeObjects[i].remove();
				paper.view.draw();
				
				fShapeObjects.splice(i,1);
				break;
			}
		}*/
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
	this.changeColorOfEllipseShape = function(colorCode, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfEllipseShape = function(opacity, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].opacity = opacity;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	
	this.drawRectangleShape = function(x, y, z, info, mindObjectId){
	
		var position = new paper.Point(x - info.fWidth/2,y - info.fHeight/2);
		var rectangle = new paper.Rectangle(position, new paper.Size(info.fWidth, info.fHeight));
		var drawingObject = null;
		if(info.fIsRounded)
			drawingObject = new paper.Path.Rectangle(rectangle, new paper.Size(10,10));	
		else
			drawingObject = new paper.Path.Rectangle(rectangle);	
			
		drawingObject.strokeColor = info.fColor;
		drawingObject.fillColor = info.fColor;
		drawingObject.fMindObjectId = mindObjectId;
		drawingObject.fShape = {fShapeTypeDependentInfo : {fWidth : info.fWidth,
															fHeight : info.fHeight}};
															

		paper.view.draw();
		
		fShapeObjects.push(drawingObject);
			console.log(fShapeObjects);
		
	};
	this.eraseRectangleShape = function(mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){					
				fShapeObjects[i].remove();
				paper.view.draw();
				
				fShapeObjects.splice(i,1);
				break;
			}
		}		
	};
	this.moveRectangleShape = function(x, y, z, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fShapeObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	this.resizeRectangleShape = function(info,mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				//var scaleRatioVertical = info.fHeight/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fHeight;
				//var scaleRatioHorizontal = info.fWidth/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fWidth;
				var heightFactor = (info.fHeight - fShapeObjects[i].fShape.fShapeTypeDependentInfo.fHeight)/2;
				var widthFactor = (info.fWidth - fShapeObjects[i].fShape.fShapeTypeDependentInfo.fWidth)/2;
				
				fShapeObjects[i].fShape.fShapeTypeDependentInfo.fHeight = info.fHeight;
				fShapeObjects[i].fShape.fShapeTypeDependentInfo.fWidth = info.fWidth;
				
				if(info.fIsRounded){
					fShapeObjects[i].segments[0].point.x -= widthFactor;
					fShapeObjects[i].segments[0].point.y += heightFactor;
					
					fShapeObjects[i].segments[1].point.x -= widthFactor;
					fShapeObjects[i].segments[1].point.y += heightFactor;

					fShapeObjects[i].segments[2].point.x -= widthFactor;
					fShapeObjects[i].segments[2].point.y -= heightFactor;
					
					fShapeObjects[i].segments[3].point.x -= widthFactor;
					fShapeObjects[i].segments[3].point.y -= heightFactor;
					
					fShapeObjects[i].segments[4].point.x += widthFactor;
					fShapeObjects[i].segments[4].point.y -= heightFactor;
					
					fShapeObjects[i].segments[5].point.x += widthFactor;
					fShapeObjects[i].segments[5].point.y -= heightFactor;

					fShapeObjects[i].segments[6].point.x += widthFactor;
					fShapeObjects[i].segments[6].point.y += heightFactor;
					
					fShapeObjects[i].segments[7].point.x += widthFactor;
					fShapeObjects[i].segments[7].point.y += heightFactor;
				}
				else{
					fShapeObjects[i].segments[0].point.x -= widthFactor;
					fShapeObjects[i].segments[0].point.y += heightFactor;
					
					fShapeObjects[i].segments[1].point.x -= widthFactor;
					fShapeObjects[i].segments[1].point.y -= heightFactor;

					fShapeObjects[i].segments[2].point.x += widthFactor;
					fShapeObjects[i].segments[2].point.y -= heightFactor;
					
					fShapeObjects[i].segments[3].point.x += widthFactor;
					fShapeObjects[i].segments[3].point.y += heightFactor;

				}

				
				paper.view.draw();
				/*if(scaleRatioVertical != Infinity && !isNaN(scaleRatioVertical)
					&& scaleRatioHorizontal != Infinity && !isNaN(scaleRatioHorizontal)){
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fHeight = info.fHeight;
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fWidth = info.fWidth;
					//fShapeObjects[i].scale(scaleRatioHorizontal,scaleRatioVertical);
					//console.log(fShapeObjects[i]._bounds.getStrokeBounds.__proto__);
					for(var j=0; j<fShapeObjects[i].segments.length-1; j++){					
						var drawingObject = new paper.Path.Circle(fShapeObjects[i].segments[j].point,10);		
						drawingObject.fillColor =  "#ffffff";
						fShapeObjects[i].segments[j].point.x = fShapeObjects[i].segments[j].point.x+50;
						}
				
					paper.view.draw();
				}*/
				break;
			}
				
		}
	};		
	this.changeColorOfRectangleShape = function(colorCode, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfRectangleShape = function(opacity, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].opacity = opacity;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	
	this.drawStarShape = function(x, y, z, info, mindObjectId){
	
		var position = new paper.Point(x,y);
	
		var drawingObject = new paper.Path.Star(position, info.fNrPoints, info.fFirstRadius, info.fSecondRadius);				

		drawingObject.fillColor = info.fColor;
		drawingObject.fMindObjectId = mindObjectId;
		drawingObject.fShape = {fShapeTypeDependentInfo : {fFirstRadius : info.fFirstRadius,
															fSecondRadius : info.fSecondRadius,
															fNrPoints : info.fNrPoints}};
		paper.view.draw();
		
		fShapeObjects.push(drawingObject);
	
		
	};
	this.eraseStarShape = function(mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){					
				fShapeObjects[i].remove();
				paper.view.draw();
				
				fShapeObjects.splice(i,1);
				break;
			}
		}		
	};
	this.moveStarShape = function(x, y, z, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fShapeObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};	
	this.resizeStarShape = function(info,mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var scaleRatio = info.fFirstRadius/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fFirstRadius;

				if(scaleRatio != Infinity && !isNaN(scaleRatio)){
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fFirstRadius = info.fFirstRadius;
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fSecondRadius = info.fSecondRadius;
					fShapeObjects[i].scale(scaleRatio);
					
				
					paper.view.draw();
				}
				break;
			}
				
		}
	};	
	this.changeColorOfStarShape = function(colorCode, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfStarShape = function(opacity, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].opacity = opacity;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	
	
	this.drawPolygonShape = function(x, y, z, info, mindObjectId){
	
		var position = new paper.Point(x,y);
	
		var drawingObject = new paper.Path.RegularPolygon(position, info.fNrSides, info.fRadius);				

		drawingObject.fillColor = info.fColor;
		drawingObject.fMindObjectId = mindObjectId;
		drawingObject.fShape = drawingObject.fShape = {fShapeTypeDependentInfo : {fRadius : info.fRadius,
																				fNrPoints : info.fNrPoints,
																				fColor : info.fColor}};
		paper.view.draw();
		
		fShapeObjects.push(drawingObject);
	
		
	};
	this.erasePolygonShape = function(mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){					
				fShapeObjects[i].remove();
				paper.view.draw();
				
				fShapeObjects.splice(i,1);
				break;
			}
		}		
	};
	this.movePolygonShape = function(x, y, z, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fShapeObjects[i].position = newPoint;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	this.resizePolygonShape = function(info,mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				var scaleRatio = info.fRadius/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fRadius;

				if(scaleRatio != Infinity && !isNaN(scaleRatio)){
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fRadius = info.fRadius;
					fShapeObjects[i].scale(scaleRatio);
					
				
					paper.view.draw();
				}
				break;
			}
				
		}
	};	
	this.changeColorOfPolygonShape = function(colorCode, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].fillColor = colorCode;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfPolygonShape = function(opacity, mindObjectId){
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				fShapeObjects[i].opacity = opacity;
				
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
		contentsObject.position = new paper.Point(x,y);
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
	
	this.changeOpacityOfTextContents = function(opacity, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId, mindObjectId)){

				fContentsObjects[i].opacity = opacity;
				
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.drawImageContents = function(x, y, z, info, value, mindObjectId){
		var contentsObject = new paper.Raster(value);
		contentsObject.position = new paper.Point(x,y);
		//contentsObject.
		//paper.view.draw();
		//contentsObject.scale((info.fWidth/contentsObject.width),(info.fHeight/contentsObject.height));
		contentsObject.scale(0.7);
		contentsObject.fMindObjectId = mindObjectId;
		paper.view.draw();
		
		fContentsObjects.push(contentsObject);
		contentsObject;
	};
	this.eraseImageContents = function(mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				fContentsObjects[i].remove();				
				paper.view.draw();
				
				fContentsObjects.splice(i,1);
				break;
			}
				
		}
	};
	this.moveImageContents = function(x, y, z, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fContentsObjects[i].position = newPoint;
				//fContentsObjects[i].scale(fContentsObjects[i].width,fContentsObjects[i].height);
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfImageContents = function(opacity, mindObjectId){
		
	};
	
	this.drawMovieContents = function(x, y, z, info, value, mindObjectId){
		
		var newDiv = document.createElement('div');
		newDiv.setAttribute('id',"divvid"+mindObjectId);
		document.body.appendChild(newDiv);
		
		var newVid = document.createElement('video');
		newVid.setAttribute('id',"vid"+mindObjectId);
		newVid.setAttribute('src',value);
		newVid.setAttribute('height',0);
		newVid.setAttribute('width',0);
		//newVid.setAttribute('preload','auto');
		newDiv.appendChild(newVid);
		//newVid.play();
		
		var canvasName = this.fCanvasName;
		var canvas1 = document.getElementById(fCanvasName);
		var ctx = canvas1.getContext('2d');

		
		/*var contentsObject = {};//new paper.Raster("VideoPlay.png");
		contentsObject.fPlayButtonImage = new Kinetic.Image({
			image : "VideoPlay.png",
			offset : {x : x-info.fWidth/2,y-info.fHeight/2},
			width : info.fWidth;
			height : info.fHeight;
		});*/
		var contentsObject = new paper.Raster("VideoPlay.png");
		var scalingStandard = info.fWidth > info.fHeight ? info.fHeight : info.fWidth; 
		//contentsObject.scale(contentsObject.height*0.1);
		contentsObject.position = new paper.Point(x-info.fWidth/2,y-info.fHeight/2);
		contentsObject.fIsPlaying = false;
		contentsObject.fMindObjectId = mindObjectId;
		
		contentsObject.fRealVideo = newVid;
		contentsObject.fRealVideoX = x-info.fWidth/2;
		contentsObject.fRealVideoY = y-info.fHeight/2;
		contentsObject.fRealVideoWidth = info.fWidth;
		contentsObject.fRealVideoHeight = info.fHeight;
		contentsObject.fVirtualVideoController = ctx;
		
		contentsObject.onMouseDown = function(event){
			if(!this.fIsPlaying){
				this.fIsPlaying = true;
				this.source = ("VideoPause.png");
				this.fRealVideo.play();
			}
			else{
				this.fIsPlaying = false;
				this.source = ("VideoPlay.png");
				this.fRealVideo.pause();
			}
		};		
		contentsObject.onFrame = function(event) {
			this.fVirtualVideoController.drawImage(this.fRealVideo, this.fRealVideoX, this.fRealVideoY, this.fRealVideoWidth, this.fRealVideoHeight);
			if(this.fRealVideo.paused && this.fIsPlaying){
				this.fIsPlaying = false;
				this.source = ("VideoPlay.png");
			}
			//this.source = newVid;
			//this.draw();
		}
		fContentsObjects.push(contentsObject);
		
		
	};
	this.eraseMovieContents = function(mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				fContentsObjects[i].fRealVideo.pause();
				
				fContentsObjects[i].remove();				
				paper.view.draw();
				
				fContentsObjects.splice(i,1);
				
				var videoTag = document.getElementById("divvid"+mindObjectId);
				if(videoTag !=null)
					videoTag.parentNode.removeChild(videoTag);
				
				break;
			}
				
		}
	};
	this.moveMovieContents = function(x, y, z, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x-fContentsObjects[i].fRealVideoWidth/2,y-fContentsObjects[i].fRealVideoHeight/2);
				fContentsObjects[i].position = newPoint;
				fContentsObjects[i].fRealVideoX = x-fContentsObjects[i].fRealVideoWidth/2;
				fContentsObjects[i].fRealVideoY = y-fContentsObjects[i].fRealVideoHeight/2;
				/*fContentsObjects[i].fVirtualVideoController.drawImage(fContentsObjects[i].fRealVideo, 
																fContentsObjects[i].fRealVideoX, 
																fContentsObjects[i].fRealVideoY, 
																fContentsObjects[i].fRealVideoWidth, 
															fContentsObjects[i].fRealVideoHeight);*/
				//fContentsObjects[i].scale(fContentsObjects[i].width,fContentsObjects[i].height);
				paper.view.draw();
				break;
			}
				
		}
	};
	
	this.changeOpacityOfMovieContents = function(opacity, mindObjectId){
		
	};
	
	
	this.drawWebPreviewContents = function(x, y, z, info, value, mindObjectId){	
		var webPreviewSrcUrl = "http://"+MEDIA_SERVER_ADDR+":"+WEB_PREVIEW_PORT+"?url="+value+"&resolution="+info.fResolution+"&userId="+currentUserId;		
		var contentsObject = new paper.Raster(webPreviewSrcUrl);
		contentsObject.position = new paper.Point(x,y);
		//contentsObject.
		//paper.view.draw();
		//contentsObject.scale((info.fWidth/contentsObject.width),(info.fHeight/contentsObject.height));
		contentsObject.scale(0.7);
		contentsObject.fMindObjectId = mindObjectId;
		paper.view.draw();
		
		fContentsObjects.push(contentsObject);
		contentsObject;
	};
	this.eraseWebPreviewContents = function(mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				fContentsObjects[i].remove();				
				paper.view.draw();
				
				fContentsObjects.splice(i,1);
				break;
			}
				
		}
	};
	this.moveWebPreviewContents = function(x, y, z, mindObjectId){
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObjectId)){
				var newPoint = new paper.Point(x,y);
				fContentsObjects[i].position = newPoint;
				//fContentsObjects[i].scale(fContentsObjects[i].width,fContentsObjects[i].height);
				paper.view.draw();
				break;
			}
				
		}
	};
	this.changeOpacityOfWebPreviewContents = function(opacity, mindObjectId){
		
	};
		
	
	
	//Edge Section
	this.drawSimplePathEdge = function(startX ,startY, startZ, endX, endY, endZ, info, startMindObjectId, endMindObjectId){
		var drawingObject = new paper.Path.Line(new paper.Point(startX,startY),
				new paper.Point(endX,endY));
		drawingObject.strokeColor = info.fColor;
		//drawingObject.sendToBack();
		drawingObject.moveAbove(paper.project.activeLayer.firstChild);
		//drawingObject.
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
					
				}
				break;
			}			
		}
		paper.view.draw();
	};
	
	//All
	this.eraseAll = function(){
		//for(var i=0; i<fShapeObjects.length;i++){
		while(fShapeObjects.length >0){
			fShapeObjects[0].remove();
			paper.view.draw();
			
			fShapeObjects.splice(0,1);
			//break;			
		}
		
		//for(var i=0; i<fContentsObjects.length;i++){
		while(fContentsObjects.length > 0){
			if(fContentsObjects[0].fRealVideo != undefined)
				fContentsObjects[0].fRealVideo.pause();
			
			fContentsObjects[0].remove();				
			paper.view.draw();
			
			fContentsObjects.splice(0,1);
			//break;				
		}
		
		
		//for(var i=0;i<fEdgeObjects.length; i++){		
		while(fEdgeObjects.length > 0){			
			fEdgeObjects[0].remove();
			paper.view.draw();
			
			fEdgeObjects.splice(0,1);
			
			//break;						
		}
		
	};	
}

PaperJS_DrawingInterface.prototype = new DrawingInterface("default");
PaperJS_DrawingInterface.constructor = PaperJS_DrawingInterface;


function PaperJS_CollisionCheckInterface(){
	this.isColliding = function(firstMindObject, secondMindObject){
		var firstShape = firstMindObject.fShape.fShapeType;
		var firstShapeDependentInfo = firstMindObject.fShape.fShapeTypeDependentInfo;
		var firstObject;
		
		var secondShape = secondMindObject.fShape.fShapeType;
		var secondShapeDependentInfo = secondMindObject.fShape.fShapeTypeDependentInfo;
		var secondObject;
		
		switch (firstShape){
		case "CircleShape" :
			firstObject = new paper.Path.Circle({
				center : [firstMindObject.fX,firstMindObject.fY],
				radius : firstShapeDependentInfo.fRadius,
				strokeColor : 'black'
			});
			break;
		default :
			break;		
		}
		
		switch (secondShape){
		case "CircleShape" :
			secondObject = new paper.Path.Circle({
				center : [secondMindObject.fX,secondMindObject.fY],
				radius : secondShapeDependentInfo.fRadius,
				strokeColor : 'black'
			});
			break;
		default :
			break;		
		}
		//not yer implemented..		
		
	};
	this.isContaining = function(x, y, z, mindObject){
		
		var shapeType = mindObject.fShape.fShapeType;
		var shapeTypeDependentInfo = mindObject.fShape.fShapeTypeDependentInfo;
		var paperObject;		
		
		switch (shapeType){
		case "CircleShape" :
			paperObject = new paper.Path.Circle({
				center : [mindObject.fX, mindObject.fY],
				radius : shapeTypeDependentInfo.fRadius,
				strokeColor : 'black'
			});
			break;
		case "EllipseShape" :
			/*paperObject = new paper.Path.Ellipse({
							center: [mindObject.fX, mindObject.fY],
							radius: [shapeTypeDependentInfo.fWidth, shapeTypeDependentInfo.fHeight],
							fillColor: 'black'
						});*/
			break;
		case "RectangleShape" :
			var tempRectangle = new paper.Rectangle(new paper.Point(mindObject.fX - shapeTypeDependentInfo.fWidth/2,mindObject.fY - shapeTypeDependentInfo.fHeight/2), new paper.Size(shapeTypeDependentInfo.fWidth, shapeTypeDependentInfo.fHeight));
			var tempCornerSize = new paper.Size(10,10);			
			paperObject = new paper.Path.Rectangle(tempRectangle, tempCornerSize);
			break;
		case "StarShape" : 				
			paperObject = new paper.Path.Star({
				center : [mindObject.fX, mindObject.fY],
				points : shapeTypeDependentInfo.fNrPoints,
				radius1 : shapeTypeDependentInfo.fFirstRadius,
				radius2 : shapeTypeDependentInfo.fSecondRadius,				
				strokeColor : 'black'
			});			
			break;
		case "PolygonShape" : 				
			paperObject = new paper.Path.RegularPolygon({
				center : [mindObject.fX, mindObject.fY],
				sides : shapeTypeDependentInfo.fNrSides,
				radius : shapeTypeDependentInfo.fRadius,				
				strokeColor : 'black'
			});			
			break;
		default :
			break;		
		}
		
		var point = new paper.Point(x,y);
		
		var ret = paperObject.contains(point);
		
		paperObject.remove();
		paperObject = null;
		point = null;	
		
		return ret;
	};
}

PaperJS_CollisionCheckInterface.prototype = new PaperJS_CollisionCheckInterface();
PaperJS_CollisionCheckInterface.constructor = PaperJS_CollisionCheckInterface;

//------------------- Utility Section--------------------------------------

function setUpPaperLib(canvasName){
	var canvas  = document.getElementById(canvasName);
	paper.setup(canvas);
}

function initPaperJSMindMap(canvasWidth, canvasHeight, wrappedEventHandler){
	
	//setUpPaperLib(canvasName);
	
	var backgroundPoint = new paper.Point(0,0);
	var backgroundSize = new paper.Size(canvasWidth,canvasHeight);
	
	var background = new paper.Path.Rectangle(backgroundPoint, backgroundSize);
	background.fillColor = "#FFFFFF";//"#C2E2E8";
	
		
	CreatingCircle = new paper.Path.Circle(new paper.Point(100,70), 50);
	CreatingCircle.fillColor = 'black';	
	
	/*for(var i=0; i<CreatingCircle.segments.length; i++)
	{
		var tempObj = new paper.Path.Circle(CreatingCircle.segments[i].point, 10);
		tempObj.fillColor = '#0FFF00';	
		//console.log(CreatingCircle.segments[i]);
	}*/
	
	CreatingImageCircle = new paper.Path.Circle(new paper.Point(300,70), 50);
	CreatingImageCircle.fillColor = 'black';
	
	DeletingCircle = new paper.Path.Circle(new paper.Point(500,70), 50);
	DeletingCircle.fillColor = 'black';	
	
	var rectangle = new paper.Rectangle(new paper.Point(665, 35), new paper.Size(70, 70));
	CreatingRectangle = new paper.Path.Rectangle(rectangle, new paper.Size(10,10));
	CreatingRectangle.strokeColor = '#00FF00';	
	CreatingRectangle.fillColor = '#00FF00';
	
	CreatingStar = new paper.Path.Star(new paper.Point(900, 70), 12, 70,50);
	CreatingStar.fillColor = '#1237F2';
	
	CreatingPolygon = new paper.Path.RegularPolygon(new paper.Point(100, 200), 3, 70);
	CreatingPolygon.fillColor = '2F7321';
	
	/*CreatingEllipse = new paper.Path.Ellipse({
							center: [200, 200],
							radius: [90, 30],
							fillColor: 'black'
						});*/
	
	paper.view.draw();
	
	var layer = paper.project.activeLayer;
	layer.on(wrappedEventHandler);
	
	//document.onkeydown = wrappedEventHandler.keydown;
	//document.adfadf
}

function WrappedPaperJSEventHandler() {
	this.mousedown;
	this.mouseup;
	this.mousedrag;
	this.mousemove;
	this.keydown;
	this.compositionstart;
	this.compositionupdate;
	this.compositionend;
	this.setOnMouseDown = function(onMouseDown){
		this.mousedown = onMouseDown;
	};
	this.setOnMouseUp = function(onMouseUp){
		this.mouseup = onMouseUp;
	};
	this.setOnMouseDrag = function(onMouseDrag){
		this.mousedrag = onMouseDrag;
	};
	this.setOnMouseMove = function(onMouseMove){
		this.mousemove = onMouseMove;
	};
	this.setOnKeyDown = function(onKeyDown){
		this.keydown = onKeydown;
	};
	this.setOnCompositionStart = function(onCompositionStart){
		this.compositionstart = onCompositionStart;
	};
	this.setOnCompositionUpdate = function(onCompositionUpdate){
		this.compositionupdate = onCompositionUpdate;
	};
	this.setOnCompositionEnd = function(onCompositionEnd){
		this.compositionend = onCompositionEnd;
	};
}



