function DrawingCCInterface(backBoneType){
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

	this.drawOrientedPathEdge = function(startX ,startY, startZ, endX, endY, endZ, info, startMindObjectId, endMindObjectId){
		
	};
	this.eraseOrientedPathEdge = function(startMindObjectId, endMindObjectId){
		
	};
	this.moveOrientedPathEdge = function(x, y, z, startMindObjectId, endMindObjectId, movingMindObjectId){
		
	};
	
	//All
	this.eraseAll = function(){
		
	};
	
	this.drawCirclesOnShapeVertex = function(mindObjectId, circleRadius, circleColor){
		
	};
	
	this.moveCirclesOnShapeVertex = function(mindObjectId, central_x, central_y, central_z){
		
	};
	
	this.isCirclesOnShapeContaining = function(mindObjectId, x, y, z){
	};
	
	this.eraseCirclesOnShapeVertex = function(mindObjectId){
		
	};
	
	this.isColliding = function(firstMindObject, secondMindObject){		
	};
	this.isContaining = function(x, y, z, mindObject){		
	};
	this.getIntersectionFromCenter = function(x, y, z, mindObjectId){
	};
}