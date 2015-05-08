
const ShapeTypeEnum = {
	Circle : "CircleShape",
	Ellipse : "EllipseShape",
	Rectangle : "RectangleShape",
	Star : "StarShape",
	Polygon : "PolygonShape",	
};

const FillingTypeEnum = {	
	SimpleColor : "SimpleColorFill",
	Gradient : "GradientFill",
	LinearGradient : "LinearGradientFill",
	RadialGradient : "RadialGradientFill",	
};

const ContentsTypeEnum = {
	Text : "TextContents",
	Image : "ImageContents",
	Movie : "MovieContents",
	WebPreview : "WebPreviewContents"	
};

const EdgeTypeEnum = {
	SimplePath : "SimplePathEdge",
	OrientedPath : "OrientedPathEdge"
};

function compareIdValue(firstIdValue,secondIdValue){
	if(firstIdValue == secondIdValue)
		return true;
	else
		return false;
}

function Encoder(){
	this.encodeShapeType = function(shapeType){
		var ret;
		switch (shapeType){
		case ShapeTypeEnum.Circle :
			ret = 16777216;
			break;
		case ShapeTypeEnum.Ellipse :
			ret = 16842752;
			break;
		case ShapeTypeEnum.Rectangle :
			ret = 33554432;
			break;
		case ShapeTypeEnum.Star : 
			ret = 50331648;
			break;
		case ShapeTypeEnum.Polygon : 
			ret = 67108864;
			break;
		default :
			ret = 0;
			break;		
		}
		return ret;
	}
	this.encodeFillingType = function(fillingType){
		var ret;
		switch (fillingType){
		case FillingTypeEnum.SimpleColor :
			ret = 16777216;
			break;
		case FillingTypeEnum.Gradient :
			ret = 33554432;
			break;
		case FillingTypeEnum.LinearGradient : 
			ret = 50331648;
			break;
		case FillingTypeEnum.RadialGradient : 
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
		case ContentsTypeEnum.Text :
			ret = 16777216;
			break;
		case ContentsTypeEnum.Image :
			ret = 33554432;
			break;
		case "SoundContents" :
			ret = 50331648;
			break;
		case ContentsTypeEnum.Movie :
			ret = 67108864;
			break;
		case ContentsTypeEnum.WebPreview :
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
		case EdgeTypeEnum.SimplePath :
			ret = 16777216;
			break;
		case EdgeTypeEnum.OrientedPath :
			ret = 16777217;
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
			ret = ShapeTypeEnum.Circle;
			break;
		case 16842752 :
			ret = ShapeTypeEnum.Ellipse;
			break;
		case 33554432 :
			ret = ShapeTypeEnum.Rectangle;
			break;
		case 50331648 :
			ret = ShapeTypeEnum.Star;
			break;
		case 67108864:
			ret = ShapeTypeEnum.Polygon;
			break;
		default :
			ret = null;
			break;		
		}
		return ret;
	}
	this.decodeFillingType = function(fillingType){
		var ret;
		switch (fillingType){
		case 16777216 :
			ret = FillingTypeEnum.SimpleColor ;
			break;
		case 33554432 :
			ret = FillingTypeEnum.Gradient;
			break;
		case 50331648  : 
			ret = FillingTypeEnum.LinearGradient;
			break;
		case 67108864 : 
			ret = FillingTypeEnum.RadialGradient;
			break;
		default :
			ret = 0;
			break;		
		}
		return ret;		
	}
	this.decodeContentsType = function(contentsType){
		var ret;
		switch(contentsType){
		case 16777216 :
			ret = ContentsTypeEnum.Text;
			break;
		case 33554432 :
			ret = ContentsTypeEnum.Image;
			break;
		case 50331648 :
			ret = "SoundContents";
			break;
		case 67108864 :
			ret = ContentsTypeEnum.Movie;
			break;
		case 83886080 :
			ret = ContentsTypeEnum.WebPreview;
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
			ret = EdgeTypeEnum.SimplePath;
			break;
		case 16777217 :
			ret = EdgeTypeEnum.OrientedPath;
			break;
		default :
			ret = null;
			break;		
		}
		return ret;
	}
}

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
		while(fRelatedObjects.length!=0){
			var frontRelObject = fRelatedObjects[0];

			for(var j=0; j<frontRelObject.lenOfRelatedObjectsArray();j++){
				if(frontRelObject.getRelatedObjectOnIndex(j) == this){
					frontRelObject.removeRelatedObjectOnIndex(j);
					break;
				}
			}	
			for(var j=0; j<frontRelObject.lenOfConnectedEdgesArray();j++){
				if(frontRelObject.getConnectedEdgeOnIndex(j).indexOfComponent(this) != -1){
					frontRelObject.removeConnectedEdgeOnIndex(j);
					break;
				}
			}
			this.removeRelatedObjectOnIndex(0);		
		}	
	
		while(fConnectedEdges.length!=0){
			this.removeConnectedEdgeOnIndex(0);
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
		
		this.fX = x;
		this.fY = y;
		this.fZ = z;

		
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
	

	this.changeFillingOfContents = function(filling){
		this.fContents.fContentsTypeDependentInfo.fFilling = filling;
	};
	this.changeContents = function(contents){
		this.fContents = contents;
	};
	this.changeFillingOfShape = function(filling){
		this.fShape.fShapeTypeDependentInfo.fFilling = filling;
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
	this.fFilling;
}

function SimplePathEdgeTypeDependentInfo(width, filling){
	this.fWidth = width;
	this.fFilling = filling;
}
SimplePathEdgeTypeDependentInfo.prototype = new EdgeTypeDependentInfo();
SimplePathEdgeTypeDependentInfo.constructor = SimplePathEdgeTypeDependentInfo;


function OrientedPathEdgeTypeDependentInfo(originId, bidirectional,  width, filling){
	this.fOriginId = originId;
	this.fBidirectional = bidirectional;
	this.fWidth = width;
	this.fFilling = filling;
}
OrientedPathEdgeTypeDependentInfo.prototype = new EdgeTypeDependentInfo();
OrientedPathEdgeTypeDependentInfo.constructor = OrientedPathEdgeTypeDependentInfo;


//------------------- Shape Section------------------------------------



function Shape (shapeType, shapeTypeDependentInfo){	
	this.fShapeType = shapeType;	
	this.fShapeTypeDependentInfo = shapeTypeDependentInfo;
}

function ShapeTypeDependentInfo() {
	this.fFilling;
	this.fOpacity;
}

function CircleShapeTypeDependentInfo(radius, filling, opacity){
	this.fRadius = radius;
	this.fFilling = filling;
	this.fOpacity = opacity;
}
CircleShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
CircleShapeTypeDependentInfo.constructor = CircleShapeTypeDependentInfo; 

function EllipseShapeTypeDependentInfo(width, height, filling, opacity){
	this.fWidth = width;
	this.fHeight = height;
	this.fFilling = filling;
	this.fOpacity = opacity;
}
EllipseShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
EllipseShapeTypeDependentInfo.constructor = EllipseShapeTypeDependentInfo; 


function RectangleShapeTypeDependentInfo(width, height, filling, opacity, isRounded){
	this.fWidth = width;
	this.fHeight = height;
	this.fFilling = filling;
	this.fOpacity = opacity;
	this.fIsRounded = isRounded;
}
RectangleShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
RectangleShapeTypeDependentInfo.constructor = RectangleShapeTypeDependentInfo; 



function StarShapeTypeDependentInfo(nrPoints, firstRadius, secondRadius, filling, opacity){
	this.fNrPoints = nrPoints;
	this.fFirstRadius = firstRadius;
	this.fSecondRadius = secondRadius;
	this.fFilling = filling;
	this.fOpacity = opacity;
}
StarShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
StarShapeTypeDependentInfo.constructor = StarShapeTypeDependentInfo; 



function PolygonShapeTypeDependentInfo(nrSides, radius, filling, opacity){
	this.fNrSides = nrSides;
	this.fRadius = radius;
	this.fFilling = filling;
	this.fOpacity = opacity;
}
PolygonShapeTypeDependentInfo.prototype = new ShapeTypeDependentInfo();
PolygonShapeTypeDependentInfo.constructor = PolygonShapeTypeDependentInfo; 


//------------------- Filling Section------------------------------------
function Filling(){
	this.fFillType;
	this.fFillInfo;
}

function SimpleColorFilling(color){
	this.fFillType = FillingTypeEnum.SimpleColor;
	this.fFillInfo = {fColor : color};	
}
SimpleColorFilling.prototype = new Filling();
SimpleColorFilling.constructor = SimpleColorFilling; 

function GradientFilling(){
	this.fFillType = FillingTypeEnum.Gradient;
	this.fFillInfo = {fStopInfoArray : null}; //Even Index : rgb color (#xxxxxx), Odd Index : offset (0.0 ~ 1.0)
}
GradientFilling.prototype = new Filling();
GradientFilling.constructor = GradientFilling; 


function LinearGradientFilling(startX,startY,startZ,endX,endY,endZ,stopInfoArray){
	this.fFillType = FillingTypeEnum.LinearGradient;
	
	this.fFillInfo = {};
	
	this.fFillInfo.fStartX = startX;
	this.fFillInfo.fStartY = startY;
	this.fFillInfo.fStartZ = startZ;
	
	this.fFillInfo.fEndX = endX;
	this.fFillInfo.fEndY = endY;
	this.fFillInfo.fEndZ = endZ;
	
	this.fFillInfo.fStopInfoArray = stopInfoArray; //Even Index : rgb color (#xxxxxx), Odd Index : offset (0.0 ~ 1.0)
}
LinearGradientFilling.prototype = new GradientFilling();
LinearGradientFilling.constructor = LinearGradientFilling; 

function RadialGradientFilling(originX,originY,originZ,radiusX,radiusY,radiusZ,stopInfoArray){
	this.fFillType = FillingTypeEnum.RadialGradient;
	
	this.fFillInfo = {};
	
	this.fFillInfo.fOriginX = originX;
	this.fFillInfo.fOriginY = originY;
	this.fFillInfo.fOriginZ = originZ;
	
	this.fFillInfo.fRadiusX = radiusX;
	this.fFillInfo.fRadiusY = radiusY;
	this.fFillInfo.fRadiusZ = radiusZ;
	
	this.fFillInfo.fStopInfoArray = stopInfoArray; //Even Index : rgb color (#xxxxxx), Odd Index : offset (0.0 ~ 1.0)

}
RadialGradientFilling.prototype = new GradientFilling();
RadialGradientFilling.constructor = RadialGradientFilling; 

//------------------- Contents Section------------------------------------



function Contents(contentsType, contentsTypeDependentInfo, value){
	this.fContentsType = contentsType;
	this.fContentsTypeDependentInfo = contentsTypeDependentInfo;
	this.fValue = value;	
}

function ContentsTypeDependentInfo(){
	this.fFilling;
}

function TextContentsTypeDependentInfo(fontFamily, fontWeight, fontSize, filling){
	this.fFilling = filling;
	this.fFontFamily = fontFamily;
	this.fFontWeight = fontWeight;
	this.fFontSize = fontSize;
}

TextContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
TextContentsTypeDependentInfo.constructor = TextContentsTypeDependentInfo;


function ImageContentsTypeDependentInfo(width, height, opacity, filling){
	this.fFilling = filling;
	this.fWidth = width;
	this.fHeight = height;
	this.fOpacity = opacity;	
}

ImageContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
ImageContentsTypeDependentInfo.constructor = ImageContentsTypeDependentInfo;

function MovieContentsTypeDependentInfo(width, height, filling){
	this.fFilling = filling;
	this.fWidth = width;
	this.fHeight = height;	
}

MovieContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
MovieContentsTypeDependentInfo.constructor = MovieContentsTypeDependentInfo;

function WebPreviewContentsTypeDependentInfo(width, height, resolution, opacity, filling){
	this.fFilling = filling;
	this.fWidth = width;
	this.fHeight = height;
	this.fResolution = resolution;
	this.fOpacity = opacity;	
}

WebPreviewContentsTypeDependentInfo.prototype = new ContentsTypeDependentInfo();
WebPreviewContentsTypeDependentInfo.constructor = WebPreviewContentsTypeDependentInfo;



var getObjTypeDependentInfo = function(type, parameterArray){
	var ret;
	switch (type){
	//Shape
	case ShapeTypeEnum.Circle :
		ret = new CircleShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
		break;
	case ShapeTypeEnum.Ellipse :
		ret = new EllipseShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ShapeTypeEnum.Rectangle :
		ret = new RectangleShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3], parameterArray[4]);
		break;
	case ShapeTypeEnum.Star :
		ret = new StarShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3], parameterArray[4]);
		break;
	case ShapeTypeEnum.Polygon :
		ret = new PolygonShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	//Contents
	case ContentsTypeEnum.Text :
		ret = new TextContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ContentsTypeEnum.Image :
		ret = new ImageContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ContentsTypeEnum.Movie :
		ret = new MovieContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
		break;
	case ContentsTypeEnum.WebPreview :
		ret = new WebPreviewContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3], parameterArray[4]);
		break;
	//Edge
	case EdgeTypeEnum.SimplePath :
		ret = new SimplePathEdgeTypeDependentInfo(parameterArray[0], parameterArray[1]);
		break;
	case EdgeTypeEnum.OrientedPath :
		ret =  new OrientedPathEdgeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	}
	return ret;
}

var genArrayForCommu = function(type, typeDependentInfo){
	var ret;
	switch(type){
	//Shape
	case  ShapeTypeEnum.Circle :
		ret = [typeDependentInfo.fRadius,	//Radius
			   typeDependentInfo.fFilling,	//Filling
			   typeDependentInfo.fOpacity];	//Opacity
		break;
	case ShapeTypeEnum.Ellipse :
		ret = [typeDependentInfo.fWidth,	//Width
			   typeDependentInfo.fHeight,	//Height
			   typeDependentInfo.fFilling,	//Filling
			   typeDependentInfo.fOpacity];	//Opacity 
		break;
	case  ShapeTypeEnum.Rectangle :
		ret = [typeDependentInfo.fWidth,	//Width
			   typeDependentInfo.fHeight,	//Height
			   typeDependentInfo.fFilling,	//Filling
			   typeDependentInfo.fOpacity,	//Opacity
			   typeDependentInfo.fIsRounded];	//IsRounded
		break;
	case  ShapeTypeEnum.Star :
		ret = [typeDependentInfo.fNrPoints,	//Nr of Points
			   typeDependentInfo.fFirstRadius,	//First Radius
			   typeDependentInfo.fSecondRadius,	//Second Radius
			   typeDependentInfo.fFilling,	//Filling
			   typeDependentInfo.fOpacity];	//Opacity
		break;
	case  ShapeTypeEnum.Polygon :
		ret = [typeDependentInfo.fNrSides,	//Nr of Sides
			   typeDependentInfo.fRadius,	//Radius
			   typeDependentInfo.fFilling,	//Filling
			   typeDependentInfo.fOpacity];	//Opacity
		break;
	//Contents
	case ContentsTypeEnum.Text :
		ret = [typeDependentInfo.fFontFamily,		//FontFamily
			   typeDependentInfo.fFontWeight,		//FontWeight
			   typeDependentInfo.fFontSize,			//FontSize
			   typeDependentInfo.fFilling];			//Filling
			   		
		break;
	case ContentsTypeEnum.Image :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight,			//Height
			   typeDependentInfo.fOpacity,			//Opacity                   
			   typeDependentInfo.fFilling];			//Filling
		break;
	case ContentsTypeEnum.Movie :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight,			//Height   
			   typeDependentInfo.fFilling];			//Filling
		break;
	case ContentsTypeEnum.WebPreview :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight,			//Height
			   typeDependentInfo.fResolution,		//Resolution
			   typeDependentInfo.fOpacity,			//Opacity  
			   typeDependentInfo.fFilling];			//Filling
		break;
	case EdgeTypeEnum.SimplePath :
		ret = [typeDependentInfo.fWidth, typeDependentInfo.fFilling];
		break;
	case EdgeTypeEnum.OrientedPath :
		ret = [	typeDependentInfo.fOriginId,
				typeDependentInfo.fBidirectional,
				typeDependentInfo.fWidth, 
				typeDependentInfo.fFilling];
		break;
	default :
		ret = null;
		break;
	}
	return ret;
};	

if(typeof module != "undefined"){
	if(module != null){
		module.exports.ShapeTypeEnum = ShapeTypeEnum;
		module.exports.FillingTypeEnum = FillingTypeEnum;
		module.exports.ContentsTypeEnum = ContentsTypeEnum;
		module.exports.EdgeTypeEnum = EdgeTypeEnum;
		module.exports.compareIdValue = compareIdValue;
		module.exports.Encoder = Encoder;
		module.exports.Decoder = Decoder;
		module.exports.MindMap = MindMap;
		module.exports.MindObject = MindObject;		
		
		module.exports.Edge = Edge;
		module.exports.EdgeTypeDependentInfo = EdgeTypeDependentInfo;
		module.exports.SimplePathEdgeTypeDependentInfo = SimplePathEdgeTypeDependentInfo;
		module.exports.OrientedPathEdgeTypeDependentInfo = OrientedPathEdgeTypeDependentInfo;		
		
		module.exports.Shape = Shape;
		module.exports.ShapeTypeDependentInfo = ShapeTypeDependentInfo;
		module.exports.CircleShapeTypeDependentInfo = CircleShapeTypeDependentInfo;
		module.exports.EllipseShapeTypeDependentInfo = EllipseShapeTypeDependentInfo;
		module.exports.RectangleShapeTypeDependentInfo = RectangleShapeTypeDependentInfo;
		module.exports.StarShapeTypeDependentInfo = StarShapeTypeDependentInfo;
		module.exports.PolygonShapeTypeDependentInfo = PolygonShapeTypeDependentInfo;		
		
		module.exports.Filling = Filling;
		module.exports.SimpleColorFilling = SimpleColorFilling;
		module.exports.GradientFilling = GradientFilling;
		module.exports.LinearGradientFilling = LinearGradientFilling;
		module.exports.RadialGradientFilling = RadialGradientFilling;
		
		module.exports.Contents = Contents;
		module.exports.ContentsTypeDependentInfo = ContentsTypeDependentInfo;
		module.exports.TextContentsTypeDependentInfo = TextContentsTypeDependentInfo;
		module.exports.ImageContentsTypeDependentInfo = ImageContentsTypeDependentInfo;
		module.exports.MovieContentsTypeDependentInfo = MovieContentsTypeDependentInfo;
		module.exports.WebPreviewContentsTypeDependentInfo = WebPreviewContentsTypeDependentInfo;		
		
		module.exports.getObjTypeDependentInfo = getObjTypeDependentInfo;
		module.exports.genArrayForCommu = genArrayForCommu;
	}
}
