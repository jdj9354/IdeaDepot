
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
addJavascript("/uuid_js/uuid.js");
addJavascript("/Room.js");
addJavascript("/ThinkMineConstants.js");
addJavascript("/ThinkMineObjects.js");
addJavascript("/ThinkMineDefInterface.js");
addJavascript("/ThinkMineDepPaperJS.js");



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


function isThere(url) {
	var req= new AJ(); // XMLHttpRequest object
	try {
		req.open("HEAD", url, false);
		req.send(null);		
		return req.status== 200 ? true : false;
	}
	catch (er) {
		return false;
	}
}

//------------------- OperatonCode Section--------------------------------





const DEFAULT_TYPE_EDGE = "SimplePathEdge";
const DEFAULT_OPACITY_SELECTED_MIND_OBJECT = 0.7;
const DEFAULT_OPACITY_MOVING_MIND_OBJECT = 0.7;





const moveCountLimit = 5;


const TM_SOCKET_MODE = {
	NORMAL_MIND_MAP_CONN : 0,
	NEW_MIND_MAP_CONN : 1
};

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


//------------------- User Auhtentication Section------------------------


function UserAuth(userId){
	var fUserId = userId;
	var fIsAuthenticated = false;
	
	this.getAuthentication = function(userId,passWord){
		fIsAuthenticated = true; //test Code
	};
	
	this.getUserId = function(){
		return fUserId;
	};
	
	this.isAuthenticated = function(){
		return fIsAuthenticated;
	};
}


//------------------- ThinkMineCanvas Section------------------------------

function ThinkMineCanvas(userDefinedDrawingCCInterface){ //MindMap객체를 가지고 이객체를 DrawingObj에개 그리도록 Data ByPass
	
	var moveCount = 0;	
	
	//var fMindMapId;
	var fDrawingCCInterface = userDefinedDrawingCCInterface;
	var fDrawingObj = new DrawingObj(fDrawingCCInterface);
	var fJobHandler = new JobHandler(fDrawingObj);
	var fSocketHelper = null;// = new SocketHelper(fJobHandler);
	//this.fSocketHelper = new SocketHelper(fJobHandler); //Test 코드 임시로 Public으로 설정
	
	
	var fSelectedShapeType = "CircleShape";
	var fSelectedShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(50,new SimpleColorFilling("#FF0000"));
	var fSelectedContentsType = "TextContents";
	var fSelectedContentsTypeDependentInfo = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
	
	//Outter Menu Selection related variables
	

	var fMenuAvailableShape = [ShapeTypeEnum.Circle,
								ShapeTypeEnum.Rectangle,
								ShapeTypeEnum.Star,
								ShapeTypeEnum.Polygon];
								
	var fMenuSelectedShape = fMenuAvailableShape[0];								
	var fMenuInsertedSDI = null;
	//var fMenuInsertedSDI = new CircleShapeTypeDependentInfo(50,"#FF0000");
	
	var fMenuAvailableContents = [ContentsTypeEnum.Text,
									ContentsTypeEnum.Image,
									ContentsTypeEnum.Movie,
									ContentsTypeEnum.WebPreview];
									
	var fMenuSelectedContents = fMenuAvailableContents[0];									
	var fMenuInsertedCDI = null;
	//var fMenuInsertedCDI = new TextContentsTypeDependentInfo("#FFFFFF",'Courier New','bold',25);
	
	var fMenuInsertedCV = "";
	//var fMenuInsertedCV = "Test";
	
	var fObjectAddMode = false;
	
	var fShapeFilling = new SimpleColorFilling("#FFFFFF");
	
	//fObjectAddMode = true;
	var fVirtualMindObject = null;
	var fAddEventStartPointX = -1;
	var fAddEventStartPointY = -1;
	var fAddEventStartPointZ = -1;
	
	//
	
	
	
	//var fIsConnectedToServer = false;
	var fSelectedObject = null;
	var fSelectedObjectOriginalOpacitiy = 1;
	var fMovingObject = null;
	var fIsDragging = false;
	var fLastClickTimeInMillis = 0;
	
	var fIsCompositionEventStarted = false;
	var fIsContentsChanged = false;
	
	var fIsNowResizingVirtually = false;
	
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
	
	this.isAddModeEnabled = function(){
		return fObjectAddMode;
	};
	
	this.setShapeColor = function(color){
		fShapeFilling = new SimpleColorFilling(color);
	};
	
	this.getShapeColor = function(){
		if(fShapeFilling instanceof SimpleColorFilling)
			return fShapeFilling.fColor;
		else
			return null;
	};
	
	this.setMenuSelectedShape = function(shapeIndex){
		//this.enableObjectAddMode();
		if(fVirtualMindObject != null){
			fDrawingCCInterface["erase"+fMenuSelectedShape]("virtual");
			fDrawingCCInterface["erase"+fMenuSelectedContents]("virtual");
			fVirtualMindObject = null;
		}
			
		fMenuSelectedShape = fMenuAvailableShape[shapeIndex];		
	};
	this.getMenuSelectedShape = function(){
		return fMenuSelectedShape;
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
				var tempShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(50,new SimpleColorFilling("#FF0000"));
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo('Courier New','bold',25,new SimpleColorFilling("#FFFFFF"));
				
				tempShape = new Shape(ShapeTypeEnum.Circle,tempShapeTypeDependentInfo);
				tempContents = new Contents(ContentsTypeEnum.Text,tempContentsTypeDependentInfo,"Ok!!!");
				
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
				var tempShapeTypeDependentInfo = new CircleShapeTypeDependentInfo(290,new SimpleColorFilling("#FF0000"));
				
				var tempContents;
				//var tempContentsTypeDependentInfo = new ImageContentsTypeDependentInfo(400,400);
				var tempContentsTypeDependentInfo = new MovieContentsTypeDependentInfo(400,400,new SimpleColorFilling("#FFFFFF"));
				
				tempShape = new Shape(ShapeTypeEnum.Circle,tempShapeTypeDependentInfo);
				//tempContents = new Contents("ImageContents",tempContentsTypeDependentInfo,"http://cfile27.uf.tistory.com/image/0151AC3F51D28D6F2CF37B");
				tempContents = new Contents(ContentsTypeEnum.Movie,tempContentsTypeDependentInfo,"Mr.chu.mp4");
				
				
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
				var tempShapeTypeDependentInfo = new RectangleShapeTypeDependentInfo(70,70,new SimpleColorFilling("#FFFF00"),true);
				
				var tempContents;
				var tempContentsTypeDependentInfo = new WebPreviewContentsTypeDependentInfo(500,500, "1280X840",0.7,new SimpleColorFilling("#FFFFFF")); //TextContentsTypeDependentInfo("#000000",'Courier New','bold',25);
				
				tempShape = new Shape(ShapeTypeEnum.Rectangle,tempShapeTypeDependentInfo);
				tempContents = new Contents(ContentsTypeEnum.WebPreview ,tempContentsTypeDependentInfo,"http://www.melon.com");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			else if(CreatingStar.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new StarShapeTypeDependentInfo(5,200,100,new SimpleColorFilling("#0FEF1F"));
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo('Courier New','bold',25,new SimpleColorFilling("#2FF1F3"));
				
				tempShape = new Shape(ShapeTypeEnum.Star,tempShapeTypeDependentInfo);
				tempContents = new Contents(ContentsTypeEnum.Text,tempContentsTypeDependentInfo,"This is a Star Shape");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			else if(CreatingPolygon.contains(new paper.Point(x,y))){
				var tempShape;
				var tempShapeTypeDependentInfo = new PolygonShapeTypeDependentInfo(12,200,new SimpleColorFilling("#FF0F0F"));
				
				var tempContents;
				var tempContentsTypeDependentInfo = new TextContentsTypeDependentInfo('Courier New','bold',25,new SimpleColorFilling("#2FF1F3"));
				
				tempShape = new Shape(ShapeTypeEnum.Polyon,tempShapeTypeDependentInfo);
				tempContents = new Contents(ContentsTypeEnum.Text,tempContentsTypeDependentInfo,"This is a Polygon Shape");
				
				this.addMindObject(x,y,z,tempShape,tempContents);
			}
			// Test Code Block end
			else {

				if(fSelectedObject != null){
					if(fDrawingCCInterface.isCirclesOnShapeContaining(fSelectedObject.fMindObjectId, x,y,z)){
						fIsNowResizingVirtually = true;
						
						if(fSelectedObject.fShape.fShapeType == ShapeTypeEnum.Star){
							var distanceFromCenter = distanceOfTwoPoints(fSelectedObject.fX, fSelectedObject.fY,fSelectedObject.fZ
																			, x, y, z);
								
							fSelectedObject.isFirstCircleVertex = true;
							if(Math.abs(distanceFromCenter - fSelectedObject.fShape.fShapeTypeDependentInfo.fFirstRadius)
									> Math.abs(distanceFromCenter - fSelectedObject.fShape.fShapeTypeDependentInfo.fSecondRadius))
								fSelectedObject.isFirstCircleVertex = false;
						}
						
						return;
					}
				}
			
				for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
					if(fDrawingCCInterface.isContaining(x,y,z,MindMap.getMindObjectOnIndex(i))){
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
				if(fDrawingCCInterface.isContaining(x,y,z,MindMap.getMindObjectOnIndex(i))){
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
			if(fIsNowResizingVirtually){
				fIsNowResizingVirtually = false;
				
				if(fSelectedObject != null){
					if(fSelectedObject.fShape.fShapeType == ShapeTypeEnum.Star)
						delete fSelectedObject.isFirstCircleVertex;
				}				
				return;
			}
		
			for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
				if(fDrawingCCInterface.isContaining(x,y,0,MindMap.getMindObjectOnIndex(i))){
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
						
							fDrawingCCInterface.changeOpacityOfCircleShape(0.5,curSelectedObject.fMindObjectId);
							fDrawingCCInterface.changeOpacityOfTextContents(0.5,curSelectedObject.fMindObjectId);								
							
							fDrawingCCInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
							fDrawingCCInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
							
							fDrawingCCInterface.eraseCirclesOnShapeVertex(fSelectedObject.fMindObjectId);
							fDrawingCCInterface.drawCirclesOnShapeVertex(curSelectedObject.fMindObjectId,5,SHAPE_VERTEX_COLOR);
							
							fSelectedObject = curSelectedObject;
							
							var applyButton = document.getElementById('ApplyButton');
							var contentsEditor = document.getElementById('ContentsEditor');
							
							var changeValueOfContentsRef = this.changeValueOfContents;
							applyButton.onclick = function (){
								changeValueOfContentsRef(fSelectedObject.fMindObjectId, fSelectedObject.fContents.fContentsType, contentsEditor.value);
							};
							
						}
						else{
		
							/*fDrawingCCInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
							fDrawingCCInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
							
							fDrawingCCInterface.eraseCirclesOnShapeVertex(fSelectedObject.fMindObjectId);
							
							resetTMCanvas();
							
							
							this.onDoubleMouseDownInterface(x,y,z);*/
							
							return;
						}
					
						//fDrawingInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
						//fDrawingInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);

					}
					else{
						fSelectedObject = curSelectedObject;
						
						fDrawingCCInterface.changeOpacityOfCircleShape(0.5,fSelectedObject.fMindObjectId);
						fDrawingCCInterface.changeOpacityOfTextContents(0.5,fSelectedObject.fMindObjectId);		
						
						fDrawingCCInterface.drawCirclesOnShapeVertex(fSelectedObject.fMindObjectId,5,SHAPE_VERTEX_COLOR);
					
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
						fDrawingCCInterface.changeOpacityOfCircleShape(1,fSelectedObject.fMindObjectId);
						fDrawingCCInterface.changeOpacityOfTextContents(1,fSelectedObject.fMindObjectId);
						
						fDrawingCCInterface.eraseCirclesOnShapeVertex(fSelectedObject.fMindObjectId);
								
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
					if(DeletingCircle.contains(new paper.Point(x,y))){				
						this.deleteMindObject(fMovingObject.fMindObjectId);						
					}
					else{
						for(var i=0; i< MindMap.lenOfMindObjectsArray(); i++){
							if(fDrawingCCInterface.isContaining(x,y,0,MindMap.getMindObjectOnIndex(i)) && 
									MindMap.getMindObjectOnIndex(i) != fMovingObject){
								this.putIntoMindObject(fMovingObject, MindMap.getMindObjectOnIndex(i).fMindObjectId);
								break;;
							}
						}	
					}
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
				
				fDrawingCCInterface["erase"+fMenuSelectedShape]("virtual");
				fDrawingCCInterface["erase"+fMenuSelectedContents]("virtual");
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
			
			if(fMovingObject == null){
				if(fIsNowResizingVirtually){					
					var shapeType = fSelectedObject.fShape.fShapeType;
					var diff_fromCenter_x = fSelectedObject.fX - x;
					var diff_fromCenter_y = fSelectedObject.fY - y;
					var diff_fromCenter_z = fSelectedObject.fZ - z;
					
					var newSTDI = null;
					var newShape = null;
									
					switch(shapeType){
						case ShapeTypeEnum.Circle :
							var newRadius = distanceOfTwoPoints(fSelectedObject.fX, fSelectedObject.fY,fSelectedObject.fZ
																, x, y, z);
							var prevFilling = fSelectedObject.fShape.fShapeTypeDependentInfo.fFilling;															
							newSTDI = new CircleShapeTypeDependentInfo(newRadius,prevFilling);						
							break;
						case ShapeTypeEnum.Ellipse :
							break;
						case ShapeTypeEnum.Rectangle :
							var newWidth = Math.abs(fSelectedObject.fX - x)*2;
							var newHeight = Math.abs(fSelectedObject.fY - y)*2;
							
							var prevFilling = fSelectedObject.fShape.fShapeTypeDependentInfo.fFilling;
							var prevIsRounded = fSelectedObject.fShape.fShapeTypeDependentInfo.fIsRounded;
							
							newSTDI = new RectangleShapeTypeDependentInfo(newWidth,newHeight,prevFilling,prevIsRounded);						
							break;
						case ShapeTypeEnum.Star :
							var newRadius = distanceOfTwoPoints(fSelectedObject.fX, fSelectedObject.fY,fSelectedObject.fZ
																, x, y, z);
								
							/*var isFirstCircleVertex = true;
							if(Math.abs(newRadius - fSelectedObject.fShape.fShapeTypeDependentInfo.fFirstRadius)
									> Math.abs(newRadius - fSelectedObject.fShape.fShapeTypeDependentInfo.fSecondRadius))
								isFirstCircleVertex = false;*/							
							
							var prevFilling = fSelectedObject.fShape.fShapeTypeDependentInfo.fFilling;
							var prevNrPoints = fSelectedObject.fShape.fShapeTypeDependentInfo.fNrPoints;
							
							if(fSelectedObject.isFirstCircleVertex)
								newSTDI = new StarShapeTypeDependentInfo(prevNrPoints, newRadius, fSelectedObject.fShape.fShapeTypeDependentInfo.fSecondRadius, prevFilling);
							else
								newSTDI = new StarShapeTypeDependentInfo(prevNrPoints, fSelectedObject.fShape.fShapeTypeDependentInfo.fFirstRadius, newRadius , prevFilling);
							break;
						case ShapeTypeEnum.Polygon :
							var newRadius = distanceOfTwoPoints(fSelectedObject.fX, fSelectedObject.fY,fSelectedObject.fZ
																, x, y, z);
							var prevFilling = fSelectedObject.fShape.fShapeTypeDependentInfo.fFilling;	
							var prevNrSides = fSelectedObject.fShape.fShapeTypeDependentInfo.fNrSides;	
							
							newSTDI = new PolygonShapeTypeDependentInfo(prevNrSides,newRadius,prevFilling);
							break;						
					}
					if(newSTDI == null)
						return;
					newShape = new Shape(shapeType,newSTDI);
					this.resizeShape(fSelectedObject.fMindObjectId,newShape);
					return;
					
				}
				return;			
			}
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
						//this.connectMindObject(fMovingObject.fMindObjectId,MindMap.getMindObjectOnIndex(i).fMindObjectId, EdgeTypeEnum.SimplePath, new SimplePathEdgeTypeDependentInfo(8,this.getShapeColor()));
						this.connectMindObject(fMovingObject.fMindObjectId,MindMap.getMindObjectOnIndex(i).fMindObjectId, EdgeTypeEnum.OrientedPath, new OrientedPathEdgeTypeDependentInfo(fMovingObject.fMindObjectId,true,8,this.getShapeFilling()));
						
					}
					else if(Distance !=0 && Distance > maxRelDistanceBySquare && isConnectedMindObject){
						//console.log("disconnect");
						this.disconnectMindObject(fMovingObject.fMindObjectId,
								MindMap.getMindObjectOnIndex(i).fMindObjectId, EdgeTypeEnum.OrientedPath);
					}
				}
				
			}
		}
		else{
			if(fVirtualMindObject == null){
			
				switch(fMenuSelectedShape){

				case ShapeTypeEnum.Circle :
					fMenuInsertedSDI = new CircleShapeTypeDependentInfo(10,this.getShapeFilling());
					break;
				case ShapeTypeEnum.Rectangle :
					fMenuInsertedSDI = new RectangleShapeTypeDependentInfo(10, 10, this.getShapeFilling(), true);
					break;	
				case ShapeTypeEnum.Star :
					fMenuInsertedSDI = new StarShapeTypeDependentInfo(5, 10, 5,this.getShapeFilling());
					break;hh
				case ShapeTypeEnum.Polygon :
					fMenuInsertedSDI = new PolygonShapeTypeDependentInfo(3, 1,this.getShapeFilling());
					break;							
				}
				
				fVirtualMindObject = {fX : x,
										fY : y,
										fZ : z,
										fShape:{fShapeTypeDependentInfo:fMenuInsertedSDI}};
				
				fAddEventStartPointX = x;
				fAddEventStartPointY = y;
				fAddEventStartPointZ = z;
				

				
								
				fDrawingCCInterface["draw"+fMenuSelectedShape](x,y,z,fMenuInsertedSDI,"virtual");
				fDrawingCCInterface["draw"+fMenuSelectedContents](x,y,z,fMenuInsertedCDI,fMenuInsertedCV,"virtual");
				
				fDrawingCCInterface["changeOpacityOf"+fMenuSelectedShape](0.5,"virtual");
				fDrawingCCInterface["changeOpacityOf"+fMenuSelectedContents](0.5,"virtual");
			}
			else{

				
				var newX;
				var newY;
				var newZ;
				
				switch(fMenuSelectedShape){
				case ShapeTypeEnum.Polygon :
				case ShapeTypeEnum.Circle :
				
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
				case ShapeTypeEnum.Rectangle :
					var xDiff = x - fAddEventStartPointX;
					var yDiff = y - fAddEventStartPointY;
					var zDiff = z - fAddEventStartPointZ;
					
					newX = (x + fAddEventStartPointX)/2;
					newY = (y + fAddEventStartPointY)/2;
					newZ = (z + fAddEventStartPointZ)/2;
					
					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fWidth = xDiff>0?xDiff:-xDiff;
					fVirtualMindObject.fShape.fShapeTypeDependentInfo.fHeight = yDiff>0?yDiff:-yDiff;
					
						
					break;
					
				case ShapeTypeEnum.Star :
				
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
				
				fDrawingCCInterface["move"+fMenuSelectedShape](newX,newY,newZ,"virtual");
				fDrawingCCInterface["move"+fMenuSelectedContents](newX,newY,newZ,"virtual");
				
				fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
										{fMindObjectId : "virtual",
										fShape : {fShapeType : fMenuSelectedShape,
													fShapeTypeDependentInfo : fVirtualMindObject.fShape.fShapeTypeDependentInfo
										}},
										[]]);
				
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
	
	/*this.connectToServer = function(userAuth){
		var ret = false;
		if(userAuth == null || userAuth == undefined){
			;
		}
		else{
			if(userAuth.isAddModeEnabled()){
				;
			}
			else{
				fSocketHelper = new SocketHelper(fJobHandler,userAuth);
				ret = fSocketHelper.connectToServer();
			}
		}		

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
	};*/
	this.initWithMindMap = function(mindMapId,userAuth){

		if(userAuth == null || userAuth == undefined){
			console.log("You should get userAuth");
			return;
		}
		else{
			if(!userAuth.isAuthenticated()){
				console.log("You should get userAuth");
				return;
			}
			else{
				fSocketHelper = new SocketHelper(fJobHandler,userAuth, TM_SOCKET_MODE.NORMAL_MIND_MAP_CONN);
				fSocketHelper.establishRoomConnection(mindMapId);
			}
		}		

		/*if(ret)
			fIsConnectedToServer = true;
		else{
			fIsConnectedToServer = false;
			console.log("Failed to connect to ThinkMine Server");
		}*/	
	
		
	
		//fMindMapId = mindMapId;
		fMovingObject = null;
		fSelectedObject = null;
		
		//fSocketHelper.fSocketDataCommuHelperSender.mindMapRequestMindInfo(mindMapId);
	};
	
	
	
	
	this.initWithNewMindMap = function(userAuth){
		
		
		if(userAuth == null || userAuth == undefined){
			console.log("You should get userAuth");
			return;
		}
		else{
			if(!userAuth.isAuthenticated()){
				console.log("You should get userAuth");
				return;
			}
			else{
				fSocketHelper = new SocketHelper(fJobHandler,userAuth,TM_SOCKET_MODE.NEW_MIND_MAP_CONN);
				fSocketHelper.establishRoomConnectionWithNewMM();
			}
		}		

		/*if(ret)
			fIsConnectedToServer = true;
		else{
			fIsConnectedToServer = false;
			console.log("Failed to connect to ThinkMine Server");
		}*/	
	
		
	
		//fMindMapId = mindMapId;
		fMovingObject = null;
		fSelectedObject = null;
		
		//fSocketHelper.fSocketDataCommuHelperSender.mindMapRequestMindInfo(mindMapId);
	};
	
	this.destroyCurrentMindMap = function(){
		if(fSocketHelper != null){
			fSocketHelper.destroyRoomConnection();
			fSocketHelper = null;
		}
			
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
																			UUID.genV4().hexString,
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
	
	this.changeFillingOfContents = function(mindObjectId, filling){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - changeColorOfContents Error : mindObjectId is invalid");
			return;		
		}
		
		if(filling == null || filling == undefined || typeof(filling) != "string"){
			console.log("ThinkMineCanvas - changeColorOfContents Error : filling is invalid");
			return;
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeFillingOfContentsSend(fJobHandler.getMindMap().fMindMapId,
																						 mindObjectId,
																						 filling);		
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
	
	
	this.changeFillingOfShape = function(mindObjectId, filling){
		if(mindObjectId == null || mindObjectId == undefined){
			console.log("ThinkMineCanvas - changeColorOfShape Error : mindObjectId is invalid");
			return;		
		}
		
		if(filling == null || filling == undefined || typeof(filling) != "string"){
			console.log("ThinkMineCanvas - changeColorOfShape Error : filling is invalid");
			return;
		}
		
		fSocketHelper.fSocketDataCommuHelperSender.mindObjectChangeFillingOfShapeSend(fJobHandler.getMindMap().fMindMapId,
																						 mindObjectId,
																						 filling);		
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
	
	
	this.changeDrawingCCInterface = function (newDrawingCCInterface){
		fDrawingCCInterface = newDrawingCCInterface;
	};
	
};

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
	
	this.getDrawingObj = function(){
		return fDrawingObj;
	};
	
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
		case CODE_MIND_MAP_REQUEST_NEW_MIND_MAP : 
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
		case CODE_MIND_CHANGE_FILLING_OF_CONTENTS :
			handleChangeFillingOfContentsEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
			handleChangeValueOfContentsEvent(eventCode);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			break;
		case CODE_MIND_CHANGE_FILLING_OF_SHAPE :
			handleChangeFillingOfShapeEvent(eventCode);
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
		drawingJob.push(eventCode.Code);
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


		var finalStatusInfo;
		var progressStatusInfo;
		var interval;
		var objData;
		
		switch(tempShapeTypeForDrawing){
		case ShapeTypeEnum.Polygon :
		case ShapeTypeEnum.Circle :
			finalStatusInfo = {};
			finalStatusInfo.fRadius = tempShapeTypeDependentInfoForDrawing.fRadius;
			
			progressStatusInfo = tempShapeTypeDependentInfoForDrawing;
			progressStatusInfo.fRadius = 9;

			interval = 1;

			objData = {definedFuncSetName : "DefinableAnimInfoFunc_CircleShapeCreation" 
							,progressStatusInfo : progressStatusInfo
							,finalStatusInfo : finalStatusInfo
							,interval : interval};			
			

			
			break;
		case ShapeTypeEnum.Ellipse :
			break;
		case ShapeTypeEnum.Rectangle :
			finalStatusInfo = {};
			finalStatusInfo.fWidth = tempShapeTypeDependentInfoForDrawing.fWidth;
			finalStatusInfo.fHeight = tempShapeTypeDependentInfoForDrawing.fHeight;
			
			progressStatusInfo = tempShapeTypeDependentInfoForDrawing;
			progressStatusInfo.fWidth = 10;
			progressStatusInfo.fHeight = 10;

			interval = 1;

			objData = {definedFuncSetName : "DefinableAnimInfoFunc_RectangleShapeCreation" 
							,progressStatusInfo : progressStatusInfo
							,finalStatusInfo : finalStatusInfo
							,interval : interval};	
			break;
		case ShapeTypeEnum.Star :
			finalStatusInfo = {};
			finalStatusInfo.fFirstRadius = tempShapeTypeDependentInfoForDrawing.fFirstRadius;
			finalStatusInfo.fSecondRadius = tempShapeTypeDependentInfoForDrawing.fSecondRadius;
			
			progressStatusInfo = tempShapeTypeDependentInfoForDrawing;			
			progressStatusInfo.fFirstRadius = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? 10 : 5;
			progressStatusInfo.fSecondRadius = finalStatusInfo.fFirstRadius < finalStatusInfo.fSecondRadius? 10 : 5;

			interval = 1;

			objData = {definedFuncSetName : "DefinableAnimInfoFunc_StarShapeCreation" 
							,progressStatusInfo : progressStatusInfo
							,finalStatusInfo : finalStatusInfo
							,interval : interval};	
			break;
		}		
		
		
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
			tempShapeTypeDependentInfoForDrawing = event.data.info;
			
			
			if(data.flag == 0){
				
				fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
					{fMindObjectId : tempMindObject.fMindObjectId,
					fShape : {fShapeType : tempShapeTypeForDrawing,
								fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
					}},
					[]]);
				
			}
			else{
				animWorker.terminate();
				animWorker = null;
			}
			
	
		};	


		animWorker.postMessage(objData);
		
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
				
				var tempShapeType = "" + tempDelMindObject.fShape.fShapeType;
				var tempContentsType = "" + tempDelMindObject.fContents.fContentsType;
				
				var tempShapeTypeForDrawing = "" + tempDelMindObject.fShape.fShapeType;
				var tempShapeTypeDependentInfoForDrawing = tempDelMindObject.fShape.fShapeTypeDependentInfo;
				var tempContentsTypeForDrawing = "" + tempDelMindObject.fContents.fContentsType;
				
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
				
				
				//here
				fMindMap.getMindObjectOnIndex(i).removeMindObject();
				fMindMap.removeMindObjectOnIndex(i);
				
				var finalStatusInfo;
				var progressStatusInfo;
				var interval;
				var objData;
				
				switch(tempShapeTypeForDrawing){
				case ShapeTypeEnum.Polygon :
				case ShapeTypeEnum.Circle :
					finalStatusInfo = {};
					finalStatusInfo.fRadius = 0;
					
					progressStatusInfo = tempShapeTypeDependentInfoForDrawing;

					interval = 1;

					objData = {definedFuncSetName : "DefinableAnimInfoFunc_CircleShapeDeletion" 
									,progressStatusInfo : progressStatusInfo
									,finalStatusInfo : finalStatusInfo
									,interval : interval};			
					

					
					break;
				case ShapeTypeEnum.Ellipse :
					break;
				case ShapeTypeEnum.Rectangle :
					finalStatusInfo = {};
					finalStatusInfo.fWidth = 0;
					finalStatusInfo.fHeight = 0;
					
					progressStatusInfo = tempShapeTypeDependentInfoForDrawing;

					interval = 1;

					objData = {definedFuncSetName : "DefinableAnimInfoFunc_RectangleShapeDeletion" 
									,progressStatusInfo : progressStatusInfo
									,finalStatusInfo : finalStatusInfo
									,interval : interval};	
					break;
				case ShapeTypeEnum.Star :
					finalStatusInfo = {};
					finalStatusInfo.fFirstRadius = 0;
					finalStatusInfo.fSecondRadius = 0;
					
					progressStatusInfo = tempShapeTypeDependentInfoForDrawing;			

					interval = 1;

					objData = {definedFuncSetName : "DefinableAnimInfoFunc_StarShapeDeletion" 
									,progressStatusInfo : progressStatusInfo
									,finalStatusInfo : finalStatusInfo
									,interval : interval};	
					break;
				}		
				
				

				
				var animWorker = new Worker("AnimationWorker.js");
				
				
				animWorker.onmessage = function (event){
					var data = event.data;
					tempShapeTypeDependentInfoForDrawing = event.data.info;
					
					
					if(data.flag == 0){
						
						fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
							{fMindObjectId : tempDelMindObjectInfoForDrawing.fMindObjectId,
							fShape : {fShapeType : tempShapeTypeForDrawing,
										fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
							}},
							[]]);
						
					}
					else{
						animWorker.terminate();
						animWorker = null;
						
						var drawingJob = new Array();
						drawingJob.push(CODE_MIND_DEL);
						drawingJob.push(tempDelMindObjectInfoForDrawing);
						drawingJob.push(tempDelEdgeInfoArrayForDrawing);
						
						fDrawingObj.pushNewJob(drawingJob);		
					}
					
			
				};	


				animWorker.postMessage(objData);
				
			
				
				break;
			}
		}
		
	};
	
	var handleMindObjectMoveEvent = function(eventCode){
		var tempEdgeArrayForDrawing = [];
		
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
				
/*				for(var pointIndex = 0; pointIndex < pointArray.length; pointIndex++){
				
					fMindMap.getMindObjectOnIndex(i).fX = pointArray[pointIndex][0];
					fMindMap.getMindObjectOnIndex(i).fY = pointArray[pointIndex][1];
					fMindMap.getMindObjectOnIndex(i).fZ = pointArray[pointIndex][2];					
					
					tempMindObjectForDrawing = {fMindObjectId : eventCode.MOID,
												fX : pointArray[pointIndex][0],
												fY : pointArray[pointIndex][1],
												fZ : pointArray[pointIndex][2],
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
					                        tempEdgeArrayForDrawing]);
				}*/
				
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
											  fFirstMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId,
																	fX : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fX,
																	fY : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fY,
																	fZ : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fFirstMindObject.fZ} ,
					                          fSecondMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId,
																	fX : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fX,
																	fY : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fY,
																	fZ : fMindMap.getMindObjectOnIndex(i).getConnectedEdgeOnIndex(j).fSecondMindObject.fZ}
					
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
	
	var handleChangeFillingOfContentsEvent = function(eventCode){
		
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fFilling == undefined)
			return;
		else
			fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsTypeDependentInfo.fFilling = eventCode.F;
		
		var tempMindObjectForDrawing = {fContents : {fContentsType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fContents.fContentsType},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_FILLING_OF_CONTENTS,
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
	
	var handleChangeFillingOfShapeEvent = function(eventCode){
		var targetIndex = -1;
		
		for(var i=0; i<fMindMap.lenOfMindObjectsArray(); i++){
			if(compareIdValue(fMindMap.getMindObjectOnIndex(i).fMindObjectId,eventCode.MOID)){
				targetIndex = i;
			}
		}
		
		if(targetIndex == -1)
			return;			
		
		if(fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fFilling == undefined)
			return;
		else{
			fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fFilling = eventCode.F;
		}
		
		var tempMindObjectForDrawing = {fShape : {fShapeType : ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeType},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
		
		
		fDrawingObj.pushNewJob([CODE_MIND_CHANGE_FILLING_OF_SHAPE,
		                        tempMindObjectForDrawing,
		                        ""+fMindMap.getMindObjectOnIndex(targetIndex).fShape.fShapeTypeDependentInfo.fFilling
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
			fMindMap.getMindObjectOnIndex(targetIndex).changeShape(new Shape(tempShapeType,tempShapeTypeDependentInfo));

		var tempShapeTypeForDrawing = fDecoder.decodeShapeType(eventCode.ST);
		var tempShapeTypeDependentInfoForDrawing = getObjTypeDependentInfo(tempShapeTypeForDrawing,eventCode.STDI);
		
		var tempMindObjectForDrawing = {fShape : {fShapeType : ""+tempShapeTypeForDrawing,
													fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing},
										fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).fMindObjectId						
										};
		
		var tempEdgeArrayForDrawing = [];										
						
						
		for(var j=0; j<fMindMap.getMindObjectOnIndex(targetIndex).lenOfConnectedEdgesArray(); j++){			
			
			var tempEdgeForDrawing = {fEdgeType : "" + fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fEdgeType , 
										  fFirstMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fFirstMindObject.fMindObjectId,
																fX : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fFirstMindObject.fX,
																fY : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fFirstMindObject.fY,
																fZ : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fFirstMindObject.fZ} ,
										  fSecondMindObject : {fMindObjectId : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fSecondMindObject.fMindObjectId,
																fX : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fSecondMindObject.fX,
																fY : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fSecondMindObject.fY,
																fZ : fMindMap.getMindObjectOnIndex(targetIndex).getConnectedEdgeOnIndex(j).fSecondMindObject.fZ}
				
										};
				
				tempEdgeArrayForDrawing.push(tempEdgeForDrawing);
		}
										
		fDrawingObj.pushNewJob([CODE_MIND_RESIZE_SHAPE,
		                        tempMindObjectForDrawing,
								tempEdgeArrayForDrawing]);
			
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
			if(latestJob.Code == CODE_MIND_MAP_REQUEST_MIND_INFO || latestJob.Code == CODE_MIND_MAP_REQUEST_NEW_MIND_MAP)
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
	
	var getObjTypeDependentInfo = window.getObjTypeDependentInfo;
}

//------------------- SocketCommunication Section--------------------------------------

function SocketHelper(jobHandler,userAuth, mode) {
	
	var fJobHandler = jobHandler;
	//var fWSocket = null;
	
	var fUserAuth = userAuth;
	
	var fRoom = new Room(THINK_MINE_RDWRAPPER_PARENT_SERVER_ADDR,
						THINK_MINE_RDWRAPPER_PARENT_SOCKET_IO_SERVER_PORT,
						fUserAuth.getUserId());
	
	this.fSocketDataCommuHelperSender = new SocketDataCommuHelperSender(fJobHandler, fRoom);
	this.fSocketDataCommuHelperRecv = new SocketDataCommuHelperRecv(fJobHandler, fRoom);
	
	var callBackInterface = this.fSocketDataCommuHelperRecv;
	var self = this;
	
	if(mode == TM_SOCKET_MODE.NORMAL_MIND_MAP_CONN){
		fRoom.roomJoinedCallBack = function(data){
			self.fSocketDataCommuHelperSender.mindMapRequestMindInfo(data.roomName);
		};
	}
	else if(mode == TM_SOCKET_MODE.NEW_MIND_MAP_CONN){
		fRoom.roomJoinedCallBack = function(data){
			self.fSocketDataCommuHelperSender.mindMapRequestNewMindMap(data.roomName);
		};
	}
	
	fRoom.messageCallBack = function(message){

		if(message.m.Code == CODE_MIND_MAP_REQUEST_MIND_INFO || message.m.Code == CODE_MIND_MAP_REQUEST_NEW_MIND_MAP){
			callBackInterface.onLoadMindMapRecv(message.m);
		}
		else{
			callBackInterface.onGetLatestEventRecv(message.m);
		}
	};
	
	this.establishRoomConnection = function(mindMapId){
		fRoom.joinRoom(mindMapId);
	};
	
	this.establishRoomConnectionWithNewMM = function(){
		var mindMapId = "test";//UUID.genV4().hexString;
		console.log(mindMapId);
		fRoom.joinRoom(mindMapId);
	};
	
	this.destroyRoomConnection = function(){
		fRoom.leaveRoom();
		fWSocket = null;
		this.fSocketDataCommuHelperSender.setWSocket(null);
		this.fSocketDataCommuHelperRecv.setWSocket(null);
	};

	/*this.connectToServer = function(){
		
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
			if(e.Code == CODE_MIND_MAP_REQUEST_MIND_INFO || e.Code == CODE_MIND_MAP_REQUEST_NEW_MIND_MAP){
				callBackInterface.onLoadMindMapRecv(e);
			}
			else{
				callBackInterface.onGetLatestEventRecv(e);
			}
	
					
		});
		
		
		
		
		
		console.log("Succeeded to connect to Server");
		return true;
	};*/
	/*this.disconnectFromServer = function(){
		fWSocket.disconnect();
		fWSocket = null;
		this.fSocketDataCommuHelperSender.setWSocket(null);
		this.fSocketDataCommuHelperRecv.setWSocket(null);
	};*/

}

function SocketDataCommuHelperSender (jobHandler,room) {
	var fJobHandler  = jobHandler;	
	var fRoom = room;
	var fEncoder = new Encoder();
	var fDecoder = new Decoder();
	
	this.setFRoom = function (room){
		fRoom = room;
	};
	this.getFRoom = function (){
		return fRoom;
	};
	
	this.mindObjectCreateSend = function(mindMapId, mindObjectId, x, y, z, shape, contents){
		if(fJobHandler == null || fRoom == null){
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
		
		
		fRoom.publicToCR({Code : CODE_MIND_ADD,
							MMID : mindMapId,
							MOID : mindObjectId,									
							X : x,
							Y : y,
							Z : z,
							ST : fEncoder.encodeShapeType(tempShapeType),
							STDI : tempShapeTypeDependentInfoArray,
							CT : fEncoder.encodeContentsType(tempContentsType),
							CTDI : tempContentsTypeDependentInfoArray,
							CV : tempContentsValue},OPERATION_TYPE.CREATE);	
	};
	this.mindObjectRemoveSend = function(mindMapId,mindObjectId){		
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.publicToCR({Code : CODE_MIND_DEL,
							MMID : mindMapId,
							MOID : mindObjectId},OPERATION_TYPE.DELETE);
		
		/*fWSocket.emit('NewEvent',{Code : CODE_MIND_DEL,
										MMID : mindMapId,
										MOID : mindObjectId});*/
	};
	this.mindObjectMoveSend = function(mindMapId, mindObjectId, x, y, z){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.publicToCR({Code : CODE_MIND_MOVE,
							MMID : mindMapId,
							MOID : mindObjectId,
							X : x,
							Y : y,
							Z : z},OPERATION_TYPE.UPDATE);	
	
	};
	this.mindObjectPutIntoSend = function(mindMapId, mindObject, destinationMindMapId, x, y, z){
		if(fJobHandler == null || fRoom == null){
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
		
		fRoom.publicToCR(SendInfo,OPERATION_TYPE.UPDATE);
		//fWSocket.emit('NewEvent',SendInfo);
	};
	this.mindObjectPullOutSend = function(mindMapId, mindObjectId, parentMindMapId, x, y, z){	
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		fRoom.publicToCR(SendInfo,OPERATION_TYPE.UPDATE);
		//fWSocket.emit('NewEvent',SendInfo);
	};
	this.mindObjectConnectToSend = function(mindMapId, mindObjectId, targetMindObjectId, edgeType, edgeTypeDependentInfo){
		if(fJobHandler == null || fRoom == null){
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

		fRoom.publicToCR({Code : CODE_MIND_CONNECT_TO,
							MMID : mindMapId,
							MOID : mindObjectId,
							TMOID : targetMindObjectId,
							ET : fEncoder.encodeEdgeType(tempEdgeType),
							ETDI : tempEdgeTypeDependentInfoArray},OPERATION_TYPE.CREATE);
	};
	this.mindObjectDisconnectFromSend = function(mindMapId, mindObjectId, targetMindObjectId, edgeType){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}		
		
		fRoom.publicToCR({Code : CODE_MIND_DISCONNECT_FROM,
							MMID : mindMapId,
							MOID : mindObjectId,
							TMOID : targetMindObjectId,
							ET : fEncoder.encodeEdgeType(edgeType)},OPERATION_TYPE.DELETE);
	};
	this.mindObjectChangeFillingOfContentsSend = function(mindMapId, mindObjectId, filling){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.publicToCR({Code : CODE_MIND_CHANGE_COLOR_OF_CONTENTS,
							MMID : mindMapId,
							MOID : mindObjectId,
							F : filling},OPERATION_TYPE.UPDATE);
	};
	this.mindObjectChangeValueOfContentsSend = function(mindMapId, mindObjectId, contentsType, contentsValue){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.publicToCR({Code : CODE_MIND_CHANGE_VALUE_OF_CONTENTS,
							MMID : mindMapId,
							MOID : mindObjectId,
							CT : fEncoder.encodeContentsType(contentsType),
							CV : contentsValue},OPERATION_TYPE.UPDATE);
	};
	this.mindObjectChangeContentsSend = function(mindMapId, mindObjectId, contentsType, contents){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}

	};
	this.mindObjectChangeFillingOfShapeSend = function(mindMapId, mindObjectId, filling){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.publicToCR({Code : CODE_MIND_CHANGE_FILLING_OF_SHAPE,
							MMID : mindMapId,
							MOID : mindObjectId,
							F : filling},OPERATION_TYPE.UPDATE);
	};	
	this.mindObjectChangeShape = function(mindMapId, mindObjectId, shapeType){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		fRoom.publicToCR(SendInfo,OPERATION_TYPE.UPDATE);
	};
	this.mindObjectChangeParentMindMapSend = function(mindMapId, mindObjectId, targetMindMapId){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		var SendInfo = "";
		
		fRoom.publicToCR(SendInfo,OPERATION_TYPE.UPDATE);
	};
	this.mindObjectResizeShapeSend = function(mindMapId,mindObjectId, shape){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		var tempShapeTypeDependentInfoArray = genArrayForCommu(shape.fShapeType, shape.fShapeTypeDependentInfo);

		fRoom.publicToCR({Code : CODE_MIND_RESIZE_SHAPE,
							MMID : mindMapId,
							MOID : mindObjectId,
							ST : fEncoder.encodeShapeType(shape.fShapeType),
							STDI : tempShapeTypeDependentInfoArray},OPERATION_TYPE.UPDATE);			
	};

	this.mindMapRequestMindInfo = function(mindMapId){	
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		fRoom.privateToSelf({Code : CODE_MIND_MAP_REQUEST_MIND_INFO,
							MMID : mindMapId},OPERATION_TYPE.READ);
	};	
	
	this.mindMapRequestNewMindMap = function(mindMapId){	
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		
		
		fRoom.privateToSelf({Code : CODE_MIND_MAP_REQUEST_NEW_MIND_MAP,
								MMID : mindMapId},OPERATION_TYPE.CREATE);
	};
	
	var genArrayForCommu = window.genArrayForCommu;
}



function SocketDataCommuHelperRecv (jobHandler,room) {
	var fJobHandler = jobHandler;
	var fRoom = room;
	
	this.setFRoom = function(room){
		fRoom = room;
	};
	this.getFRoom = function (){
		return fRoom;
	};
	
	this.onLoadMindMapRecv = function(loadingInfo){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}
		if(loadingInfo.MMID == null){
			;
		}
		else{

			//Expanding effect
			var finalStatusInfo;
			var progressStatusInfo;
			var interval;
			var objData;
			
			var mindMap = fJobHandler.getMindMap();
			
			//In case of Initial State
			if(mindMap == null){
				fJobHandler.resetJobHandler();
				fJobHandler.pushNewJob(loadingInfo);
				
				return;
			}
			
			var limitX = mindMap.getLimitX();
			var limitY = mindMap.getLimitY();
			var limitZ = mindMap.getLimitZ();
			
			var maxLimit = limitX > limitY ? limitX : limitY;
			maxLimit = maxLimit > limitZ ? maxLimit : limitZ;
			
			
			var selectedObject;
			for(var i=0; i<mindMap.lenOfMindObjectsArray(); i++){
				if(mindMap.getMindObjectOnIndex(i).fMindObjectId == loadingInfo.MMID)
					selectedObject = mindMap.getMindObjectOnIndex(i);
			}
			
			if(selectedObject == null || selectedObject == undefined)
				return;
			
			var tempShapeTypeDependentInfoForDrawing = selectedObject.fShape.fShapeTypeDependentInfo;
			
			
			switch(selectedObject.fShape.fShapeType){
			case ShapeTypeEnum.Polygon :
			case ShapeTypeEnum.Circle :
				finalStatusInfo = {};

				
				finalStatusInfo.fRadius = maxLimit;
				
				progressStatusInfo = tempShapeTypeDependentInfoForDrawing;

				interval = 1;

				objData = {definedFuncSetName : "DefinableAnimInfoFunc_CircleShapeExpansion" 
								,progressStatusInfo : progressStatusInfo
								,finalStatusInfo : finalStatusInfo
								,interval : interval};			
				

				
				break;
			case ShapeTypeEnum.Ellipse :
				break;
			case ShapeTypeEnum.Rectangle :			
				var whRatio = selectedObject.fShape.fShapeTypeDependentInfo.fHeight/selectedObject.fShape.fShapeTypeDependentInfo.fWidth;
				
				finalStatusInfo = {};
				if(whRatio >= 1){
					finalStatusInfo.fWidth = maxLimit / whRatio;
					finalStatusInfo.fHeight = maxLimit;
				}
				else{
					finalStatusInfo.fWidth = maxLimit;
					finalStatusInfo.fHeight = maxLimit * whRatio;					
				}				
				
				progressStatusInfo = tempShapeTypeDependentInfoForDrawing;

				interval = 1;

				objData = {definedFuncSetName : "DefinableAnimInfoFunc_RectangleShapeExpansion" 
								,progressStatusInfo : progressStatusInfo
								,finalStatusInfo : finalStatusInfo
								,interval : interval};	
				break;
			case ShapeTypeEnum.Star :
				finalStatusInfo = {};
				finalStatusInfo.fFirstRadius = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? maxLimit : maxLimit - 5;
				finalStatusInfo.fSecondRadius = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? maxLimit - 5 : maxLimit;
				
				progressStatusInfo = tempShapeTypeDependentInfoForDrawing;			

				interval = 1;

				objData = {definedFuncSetName : "DefinableAnimInfoFunc_StarShapeExpansion" 
								,progressStatusInfo : progressStatusInfo
								,finalStatusInfo : finalStatusInfo
								,interval : interval};	
				break;
			}
			
			var animWorker = new Worker('AnimationWorker.js');
			var hasFinished = false;
			var current_Obj = this;
			
			animWorker.onmessage = function (event){
				var data = event.data;
				tempShapeTypeDependentInfoForDrawing = event.data.info;
				
				
				if(data.flag == 0){
					
					fJobHandler.getDrawingObj().pushNewJob([CODE_MIND_RESIZE_SHAPE,
						{fMindObjectId : selectedObject.fMindObjectId,
						fShape : {fShapeType : selectedObject.fShape.fShapeType,
									fShapeTypeDependentInfo : tempShapeTypeDependentInfoForDrawing
						}},
						[]]);				
					
				}
				else{
					animWorker.terminate();
					hasFinished = true;
					animWorker = null;
					
					
					setTimeout(function(){
									fJobHandler.resetJobHandler();
									fJobHandler.pushNewJob(loadingInfo);}, 300);
					
					
				}
				
		
			};	


			animWorker.postMessage(objData);		


		}
	};
	this.onGetLatestEventRecv = function(newJob){
		if(fJobHandler == null || fRoom == null){
			console.log("SocketDataCommuHelperSender : Object is not Initialized");
			return;
		}		
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

function DrawingObj(drawingCCInterface){
	
	
	var fDrawingCCInterface = drawingCCInterface;
	var fDrawingJobQ = null;
	var fWorker = null;
	var fIsStarted = false;
	var fMutexLocked = false;
	
	
	this.resetDrawingObj = function(){

		
		if(fIsStarted){
			fWorker.terminate();
			fWorker = null;		
		}
		
		fDrawingCCInterface.eraseAll();
		
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
		case CODE_MIND_MAP_REQUEST_NEW_MIND_MAP :
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
		case CODE_MIND_CHANGE_FILLING_OF_CONTENTS :
			changeFillingOfContents(drawingJob[1],drawingJob[2]);
			break;
		case CODE_MIND_CHANGE_VALUE_OF_CONTENTS : 
			changeValueOfContents(drawingJob[1]);
			break;
		case CODE_MIND_CHANGE_CONTENTS :
			change
			break;
		case CODE_MIND_CHANGE_FILLING_OF_SHAPE :
			changeFillingOfShape(drawingJob[1],drawingJob[2]);
			break;
		case CODE_MIND_CHANGE_SHAPE :
			break;
		case CODE_MIND_CHANGE_PARENT_MIND_MAP :
			break;
		case CODE_MIND_RESIZE_SHAPE :
			resizeShape(drawingJob[1],drawingJob[2]);
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
			
			fDrawingCCInterface["draw"+tempShapeType](mindObjectInfoArray[i].fX,											//X
															mindObjectInfoArray[i].fY,									//Y
															mindObjectInfoArray[i].fZ,									//Z
															mindObjectInfoArray[i].fShape.fShapeTypeDependentInfo,		//Info
															mindObjectInfoArray[i].fMindObjectId);						//ObjectID
			
			var tempContentsType =  mindObjectInfoArray[i].fContents.fContentsType;
			
			
			fDrawingCCInterface["draw"+tempContentsType](mindObjectInfoArray[i].fX,											//X
															mindObjectInfoArray[i].fY,										//Y
															mindObjectInfoArray[i].fZ,										//Z
															mindObjectInfoArray[i].fContents.fContentsTypeDependentInfo,	//Info
															mindObjectInfoArray[i].fContents.fValue,						//Value
															mindObjectInfoArray[i].fMindObjectId);							//ObjectID
			
		}
		for(i=0; i<edgeObjects.length; i++){
			
			
			var tempEdgeType = edgeObjects[i].fEdgeType;
			
			var firstObjectCoord = fDrawingCCInterface.getIntersectionFromCenter(edgeObjects[i].fSecondMindObject.fX,					
																					edgeObjects[i].fSecondMindObject.fY,					
																					edgeObjects[i].fSecondMindObject.fZ,
																					edgeObjects[i].fFirstMindObject.fMindObjectId);
																					
			var secondObjectCoord = fDrawingCCInterface.getIntersectionFromCenter(edgeObjects[i].fFirstMindObject.fX,					
																					edgeObjects[i].fFirstMindObject.fY,					
																					edgeObjects[i].fFirstMindObject.fZ,
																					edgeObjects[i].fSecondMindObject.fMindObjectId);
			
			fDrawingCCInterface["draw"+tempEdgeType](firstObjectCoord[0],							//Frist X
														firstObjectCoord[1],						//First Y
														firstObjectCoord[2],						//First Z
														secondObjectCoord[0],					//Second X
														secondObjectCoord[1],					//Second Y
														secondObjectCoord[2],					//Second Z
														edgeObjects[i].fEdgeTypeDependentInfo, 					//Info
														edgeObjects[i].fFirstMindObject.fMindObjectId,			//FirstID
														edgeObjects[i].fSecondMindObject.fMindObjectId);		//SecondID
		}
	};
	
	var drawMindObject = function(mindObject){
		
		fDrawingCCInterface["draw"+mindObject.fShape.fShapeType](mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fShape.fShapeTypeDependentInfo,
														mindObject.fMindObjectId);
		
		fDrawingCCInterface["draw"+mindObject.fContents.fContentsType](mindObject.fX, mindObject.fY, mindObject.fZ,
														mindObject.fContents.fContentsTypeDependentInfo,
														mindObject.fContents.fValue,
														mindObject.fMindObjectId);		
		
	};
	
	var eraseMindObject = function(delMindObjectInfo, delEdgeInfo){
	
		fDrawingCCInterface.eraseCirclesOnShapeVertex(delMindObjectInfo.fMindObjectId);
		
		fDrawingCCInterface["erase"+delMindObjectInfo.fShape.fShapeType](delMindObjectInfo.fMindObjectId);
		fDrawingCCInterface["erase"+delMindObjectInfo.fContents.fContentsType](delMindObjectInfo.fMindObjectId);
		
		for(var i=0; i<delEdgeInfo.length; i++){
			fDrawingCCInterface["erase"+delEdgeInfo[i].fEdgeType](delEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																	delEdgeInfo[i].fSecondMindObject.fMindObjectId);
		}		
		
	};
	
	var moveMindObject = function(movMindObjectInfo, movEdgeInfo, pointArray){		

		
		for(var i=0; i<pointArray.length ; i++){			
			
			
			
			fDrawingCCInterface["move"+movMindObjectInfo.fShape.fShapeType](pointArray[i][0],
																				pointArray[i][1],
																				pointArray[i][2],
																				movMindObjectInfo.fMindObjectId);
			fDrawingCCInterface["move"+movMindObjectInfo.fContents.fContentsType](pointArray[i][0],
																					pointArray[i][1],
																					pointArray[i][2],
																					movMindObjectInfo.fMindObjectId);
																					
			fDrawingCCInterface.syncCirclesOnShapeVertex(movMindObjectInfo.fMindObjectId);
			
			for(var j=0; j<movEdgeInfo.length; j++){
				var connectedMindObj = compareIdValue(movMindObjectInfo.fMindObjectId,movEdgeInfo[j].fFirstMindObject.fMindObjectId)?
										movEdgeInfo[j].fSecondMindObject : movEdgeInfo[j].fFirstMindObject;
										
				var intersectCoord = fDrawingCCInterface.getIntersectionFromCenter(connectedMindObj.fX,
																					connectedMindObj.fY,
																					connectedMindObj.fZ,
																					movMindObjectInfo.fMindObjectId);
				var intersectCoord2 = fDrawingCCInterface.getIntersectionFromCenter(movMindObjectInfo.fX,
																					movMindObjectInfo.fY,
																					movMindObjectInfo.fZ,
																					connectedMindObj.fMindObjectId);

				if(intersectCoord == null || intersectCoord2 == null)
					continue;
																								
										
				fDrawingCCInterface["move"+movEdgeInfo[j].fEdgeType](intersectCoord[0],
																		intersectCoord[1],
																		intersectCoord[2],
																		movEdgeInfo[j].fFirstMindObject.fMindObjectId, 
																		movEdgeInfo[j].fSecondMindObject.fMindObjectId,
																		movMindObjectInfo.fMindObjectId);
				

				
				

				fDrawingCCInterface["move"+movEdgeInfo[j].fEdgeType](intersectCoord2[0],
																		intersectCoord2[1],
																		intersectCoord2[2],
																		movEdgeInfo[j].fFirstMindObject.fMindObjectId, 
																		movEdgeInfo[j].fSecondMindObject.fMindObjectId,
																		connectedMindObj.fMindObjectId);
				
				
			}			
		}	
	};
	
	var putIntoMindObject = function(flagValue, delMindObjectInfo_or_addMindObjectInfo, delEdgeInfo){
		
		//빠져들어가는 효과로 변경 필요
		if(flagValue == 0){
			var delMindObjectInfo = delMindObjectInfo_or_addMindObjectInfo;
			fDrawingCCInterface["erase"+delMindObjectInfo.fShape.fShapeType](delMindObjectInfo.fMindObjectId);

			fDrawingCCInterface["erase"+delMindObjectInfo.fContents.fContentsType](delMindObjectInfo.fMindObjectId);
			
			for(var i=0; i<delEdgeInfo.length; i++){
				fDrawingCCInterface["erase"+delEdgeInfo[i].fEdgeType](delEdgeInfo[i].fFirstMindObject.fMindObjectId, 
																		delEdgeInfo[i].fSecondMindObject.fMindObjectId);
			}		
		}
		else{
			var mindObject = delMindObjectInfo_or_addMindObjectInfo;
			
			fDrawingCCInterface["draw"+mindObject.fShape.fShapeType](mindObject.fX, mindObject.fY, mindObject.fZ,
												mindObject.fShape.fShapeTypeDependentInfo,
												mindObject.fMindObjectId);
	
			fDrawingCCInterface["draw"+mindObject.fContents.fContentsType](mindObject.fX, mindObject.fY, mindObject.fZ,
															mindObject.fContents.fContentsTypeDependentInfo,
															mindObject.fContents.fValue,
															mindObject.fMindObjectId);	
		}
	};
	
	var drawEdge = function(newEdgeInfo){
		
		var firstIntersects = fDrawingCCInterface.getIntersectionFromCenter(newEdgeInfo.fSecondMindObject.fX,
																			newEdgeInfo.fSecondMindObject.fY,
																			newEdgeInfo.fSecondMindObject.fZ,
																			newEdgeInfo.fFirstMindObject.fMindObjectId);
																			
		var secondIntersects = fDrawingCCInterface.getIntersectionFromCenter(newEdgeInfo.fFirstMindObject.fX,
																			newEdgeInfo.fFirstMindObject.fY,
																			newEdgeInfo.fFirstMindObject.fZ,
																			newEdgeInfo.fSecondMindObject.fMindObjectId);
																			
		if(firstIntersects == null || secondIntersects == null)
			return;
		
		fDrawingCCInterface["draw"+newEdgeInfo.fEdgeType](firstIntersects[0],
															firstIntersects[1],
															firstIntersects[2],
															secondIntersects[0],
															secondIntersects[1],
															secondIntersects[2],
															newEdgeInfo.fEdgeTypeDependentInfo,
															newEdgeInfo.fFirstMindObject.fMindObjectId,
															newEdgeInfo.fSecondMindObject.fMindObjectId);
	};
	
	var eraseEdge = function(delEdgeInfo){
		fDrawingCCInterface["erase"+delEdgeInfo.fEdgeType](delEdgeInfo.fFirstMindObject.fMindObjectId,
																delEdgeInfo.fSecondMindObject.fMindObjectId);
	};
	
	var changeFillingOfContents = function(mindObjectInfo, filling){
		fDrawingCCInterface["changeFillingOf"+mindObjectInfo.fContents.fContentsType](filling,
																					mindObjectInfo.fMindObjectId);
	};
	
	var changeValueOfContents = function(mindObjectInfo){
		fDrawingCCInterface["erase"+mindObjectInfo.fContents.fContentsType](mindObjectInfo.fMindObjectId);
		fDrawingCCInterface["draw"+mindObjectInfo.fContents.fContentsType](mindObjectInfo.fX,
																				mindObjectInfo.fY,
																				mindObjectInfo.fZ,
																				mindObjectInfo.fContents.fContentsTypeDependentInfo,
																				mindObjectInfo.fContents.fValue,
																				mindObjectInfo.fMindObjectId);
	};
	
	var changeFillingOfShape = function(mindObjectInfo, filling){
		
		fDrawingCCInterface["changeFillingOf"+mindObjectInfo.fShape.fShapeType](filling,
																				mindObjectInfo.fMindObjectId);
	};
	
	var resizeShape = function(mindObjectInfo,movEdgeInfo){	
		fDrawingCCInterface["resize"+mindObjectInfo.fShape.fShapeType](mindObjectInfo.fShape.fShapeTypeDependentInfo,mindObjectInfo.fMindObjectId);
		fDrawingCCInterface.syncCirclesOnShapeVertex(mindObjectInfo.fMindObjectId);		
								
		for(var j=0; j<movEdgeInfo.length; j++){
			var connectedMindObj = compareIdValue(mindObjectInfo.fMindObjectId,movEdgeInfo[j].fFirstMindObject.fMindObjectId)?
									movEdgeInfo[j].fSecondMindObject : movEdgeInfo[j].fFirstMindObject;
									
			var intersectCoord = fDrawingCCInterface.getIntersectionFromCenter(connectedMindObj.fX,
																				connectedMindObj.fY,
																				connectedMindObj.fZ,
																				mindObjectInfo.fMindObjectId);
			
			if(intersectCoord == null)
				continue;
			
			fDrawingCCInterface["move"+movEdgeInfo[j].fEdgeType](intersectCoord[0],
																	intersectCoord[1],
																	intersectCoord[2],
																	movEdgeInfo[j].fFirstMindObject.fMindObjectId, 
																	movEdgeInfo[j].fSecondMindObject.fMindObjectId,
																	mindObjectInfo.fMindObjectId);
			

			
			
			/*intersectCoord = fDrawingCCInterface.getIntersectionFromCenter(mindObjectInfo.fX,
																				mindObjectInfo.fY,
																				mindObjectInfo.fZ,
																				connectedMindObj.fMindObjectId);
			fDrawingCCInterface["move"+movEdgeInfo[j].fEdgeType](intersectCoord[0],
																	intersectCoord[1],
																	intersectCoord[2],
																	movEdgeInfo[j].fFirstMindObject.fMindObjectId, 
																	movEdgeInfo[j].fSecondMindObject.fMindObjectId,
																	connectedMindObj.fMindObjectId);*/
			
			
		}
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
}

