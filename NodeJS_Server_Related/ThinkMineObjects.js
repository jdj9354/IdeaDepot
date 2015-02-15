
const ShapeTypeEnum = {
	Circle : "CircleShape",
	Ellipse : "EllipseShape",
	Rectangle : "RectangleShape",
	Star : "StarShape",
	Polygon : "PolygonShape",	
};

const ContentsTypeEnum = {
	Text : "TextContents",
	Image : "ImageContents",
	Movie : "MovieContents",
	WebPreview : "WebPreviewContents"	
};

const EdgeTypeEnum = {
	SimplePath : "SimplePathEdge"
};


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



var getObjTypeDependentInfo = function(type, parameterArray){
	var ret;
	switch (type){
	//Shape
	case ShapeTypeEnum.Circle :
		ret = new CircleShapeTypeDependentInfo(parameterArray[0], parameterArray[1]);
		break;
	case ShapeTypeEnum.Ellipse :
		ret = new EllipseShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
		break;
	case ShapeTypeEnum.Rectangle :
		ret = new RectangleShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ShapeTypeEnum.Star :
		ret = new StarShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ShapeTypeEnum.Polygon :
		ret = new PolygonShapeTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
		break;
	//Contents
	case ContentsTypeEnum.Text :
		ret = new TextContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	case ContentsTypeEnum.Image :
		ret = new ImageContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2]);
		break;
	case ContentsTypeEnum.Movie :
		ret = new MovieContentsTypeDependentInfo(parameterArray[0], parameterArray[1]);
		break;
	case ContentsTypeEnum.WebPreview :
		ret = new WebPreviewContentsTypeDependentInfo(parameterArray[0], parameterArray[1], parameterArray[2], parameterArray[3]);
		break;
	//Edge
	case EdgeTypeEnum.SimplePath :
		ret = new SimplePathEdgeTypeDependentInfo(parameterArray[0], parameterArray[1]);
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
			   typeDependentInfo.fColor];	//Color
		break;
	case ShapeTypeEnum.Ellipse :
		ret = [typeDependentInfo.fWidth,	//Width
			   typeDependentInfo.fHeight,	//Height
			   typeDependentInfo.fColor];	//Color 
		break;
	case  ShapeTypeEnum.Rectangle :
		ret = [typeDependentInfo.fWidth,	//Width
			   typeDependentInfo.fHeight,	//Height
			   typeDependentInfo.fColor,	//Color
			   typeDependentInfo.fIsRounded];	//IsRounded
		break;
	case  ShapeTypeEnum.Star :
		ret = [typeDependentInfo.fNrPoints,	//Nr of Points
			   typeDependentInfo.fFirstRadius,	//First Radius
			   typeDependentInfo.fSecondRadius,	//Second Radius
			   typeDependentInfo.fColor];	//Color
		break;
	case  ShapeTypeEnum.Polygon :
		ret = [typeDependentInfo.fNrSides,	//Nr of Sides
			   typeDependentInfo.fRadius,	//Radius
			   typeDependentInfo.fColor];	//Color
		break;
	//Contents
	case ContentsTypeEnum.Text :
		ret = [typeDependentInfo.fColor,			//Color
			   typeDependentInfo.fFontFamily,		//FontFamily
			   typeDependentInfo.fFontWeight,		//FontWeight
			   typeDependentInfo.fFontSize];		//FontSize
		break;
	case ContentsTypeEnum.Image :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight,			//Height
			   typeDependentInfo.fOpacity];			//Opacity                   
		break;
	case ContentsTypeEnum.Movie :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight];			//Height                                      
		break;
	case ContentsTypeEnum.WebPreview :
		ret = [typeDependentInfo.fWidth,			//Width
			   typeDependentInfo.fHeight,			//Height
			   typeDependentInfo.fResolution,		//Resolution
			   typeDependentInfo.fOpacity];			//Opacity  
		break;
	case EdgeTypeEnum.SimplePath :
		ret = [typeDependentInfo.fWidth, typeDependentInfo.fColor];
		break;
	default :
		ret = null;
		break;
	}
	return ret;
};


if(typeof module != "undefined"){
	if(module != null){
		module.exports.ContentsTypeEnum= ContentsTypeEnum;
		module.exports.EdgeTypeEnum= EdgeTypeEnum;
		module.exports.Encoder = Encoder;
		module.exports.Decoder = Decoder;
		module.exports.MindMap= MindMap;
		module.exports.MindObject= MindObject;
		module.exports.Edge= Edge;
		module.exports.EdgeTypeDependentInfo= EdgeTypeDependentInfo;
		module.exports.SimplePathEdgeTypeDependentInfo= SimplePathEdgeTypeDependentInfo;
		module.exports.Shape= Shape;
		module.exports.ShapeTypeDependentInfo= ShapeTypeDependentInfo;
		module.exports.CircleShapeTypeDependentInfo= CircleShapeTypeDependentInfo;
		module.exports.EllipseShapeTypeDependentInfo= EllipseShapeTypeDependentInfo;
		module.exports.RectangleShapeTypeDependentInfo= RectangleShapeTypeDependentInfo;
		module.exports.StarShapeTypeDependentInfo= StarShapeTypeDependentInfo;
		module.exports.PolygonShapeTypeDependentInfo= PolygonShapeTypeDependentInfo;
		module.exports.Contents= Contents;
		module.exports.ContentsTypeDependentInfo= ContentsTypeDependentInfo;
		module.exports.TextContentsTypeDependentInfo= TextContentsTypeDependentInfo;
		module.exports.ImageContentsTypeDependentInfo= ImageContentsTypeDependentInfo;
		module.exports.MovieContentsTypeDependentInfo= MovieContentsTypeDependentInfo;
		module.exports.WebPreviewContentsTypeDependentInfo= WebPreviewContentsTypeDependentInfo;
		module.exports.getObjTypeDependentInfo= getObjTypeDependentInfo;
		module.exports.genArrayForCommu= genArrayForCommu;
	}
}
