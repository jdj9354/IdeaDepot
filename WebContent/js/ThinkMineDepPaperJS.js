

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PaperJS////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


//------------------- DrawingCCInterface Section--------------------------------------
//매개변수 명 변경 필요 (가독성 있게)
function PaperJS_DrawingCCInterface(backBoneType, canvasName){
	this.fBackBoneType = backBoneType;
	var fCanvasName = canvasName;	

	
	//To Maintain Shape,Contents,Edge Objects...
	var fShapeObjects = new Array();
	var fContentsObjects = new Array();
	var fEdgeObjects = new Array();
	
	var verticesOnShape = null;
	
	
	
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
				//var scaleRatio = info.fFirstRadius/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fFirstRadius;
				/*if(scaleRatio == 1)
					scaleRatio = info.fSecondRadius/fShapeObjects[i].fShape.fShapeTypeDependentInfo.fSecondRadius;*/
					
				//if(scaleRatio != Infinity && !isNaN(scaleRatio)){
					/*fShapeObjects[i].fShape.fShapeTypeDependentInfo.fFirstRadius = info.fFirstRadius;
					fShapeObjects[i].fShape.fShapeTypeDependentInfo.fSecondRadius = info.fSecondRadius;
					fShapeObjects[i].scale(scaleRatio);*/
				var position = new paper.Point(fShapeObjects[i].position.x,fShapeObjects[i].position.y);	
				
				
				
				var tempStar = new paper.Path.Star(position, info.fNrPoints, info.fFirstRadius, info.fSecondRadius);	
				tempStar.position = position;
				
				
				for(var j=0; j<fShapeObjects[i].segments.length; j++)
					tempStar.segments[j].drawingObject = fShapeObjects[i].segments[j].drawingObject;
				
				fShapeObjects[i].segments = tempStar.segments;
				

				
				for(var j=0; j<fShapeObjects[i].segments.length; j++)
					fShapeObjects[i].segments[j].drawingObject = tempStar.segments[j].drawingObject;				
				
				if(verticesOnShape != null)
					verticesOnShape = fShapeObjects[i].segments;
				tempStar.remove();

				/*fShapeObjects[i].opacity = opacity
				fShapeObjects[i].fillColor = info.fColor;
				fShapeObjects[i].fMindObjectId = mindObjectId;
				fShapeObjects[i].fShape = {fShapeTypeDependentInfo : {fFirstRadius : info.fFirstRadius,
																	fSecondRadius : info.fSecondRadius,
																	fNrPoints : info.fNrPoints}};*/
				paper.view.draw();
				//}
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
		drawingObject.strokeWidth = info.fWidth;
		//drawingObject.sendToBack();
		//drawingObject.moveAbove(paper.project.activeLayer.firstChild);
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
	
	this.drawOrientedPathEdge = function(startX ,startY, startZ, endX, endY, endZ, info, startMindObjectId, endMindObjectId){
		var startPoint = new paper.Point(startX,startY);
		var endPoint = new paper.Point(endX,endY);
		var drawingObject;
		
		var th;
		var b = info.fWidth;
		var D = distanceOfTwoPoints(startX ,startY, startZ, endX, endY, endZ);
		var A = 10;
		var x;
		var y;
		
		if(startMindObjectId == info.fOriginId){
			x = startX;
			y = startY;
			th = Math.atan2(endY-startY,endX-startX);
			
			drawingObject = new paper.Path.Line(startPoint,endPoint);

			drawingObject.fStartMindObjectId = startMindObjectId;
			drawingObject.fEndMindObjectId = endMindObjectId;
		}			
		else{
			x = endX;
			y = endY;
			th = Math.atan2(startY-endY,startX-endX);
			
			drawingObject = new paper.Path.Line(endPoint,startPoint);

			drawingObject.fStartMindObjectId = endMindObjectId;
			drawingObject.fEndMindObjectId = startMindObjectId;
		}
		
		drawingObject.strokeColor = info.fColor;
		drawingObject.strokeWidth = info.fWidth;
		
		var newPoint1 = new paper.Point(Math.trunc((D-A)*Math.cos(th)-(b/2)*Math.sin(th)) + x,
										Math.trunc((D-A)*Math.sin(th)+(b/2)*Math.cos(th)) + y);
		
		var newPoint2 = new paper.Point(Math.trunc((D-A)*Math.cos(th)+(b/2)*Math.sin(th)) + x,
										Math.trunc((D-A)*Math.sin(th)-(b/2)*Math.cos(th)) + y);
										
		var newPoint3 = new paper.Point(drawingObject.lastSegment.point.x,drawingObject.lastSegment.point.y);
		var newPoint4 = new paper.Point((newPoint1.x+newPoint2.x)/2,(newPoint1.y+newPoint2.y)/2);
		
		drawingObject.lastSegment.point.x = (newPoint1.x+newPoint2.x)/2;
		drawingObject.lastSegment.point.y = (newPoint1.y+newPoint2.y)/2;
		
		drawingObject.add(newPoint1);
		drawingObject.add(newPoint3);		
		drawingObject.add(newPoint2);		
		drawingObject.add(newPoint4);
		
		drawingObject.bidirectional = info.fBidirectional;
		
		if(info.fBidirectional){
			if(startMindObjectId == info.fOriginId){
				x = endX;
				y = endY;
				th = Math.atan2(startY-endY,startX-endX);
				//th = Math.atan2(endX-startX,endY-startY);
			}			
			else{
				x = startX;
				y = startY;
				th = Math.atan2(endY-startY,endX-startX);				
				//th = Math.atan2(startX-endX,startY-endY);
			}
			
			var newPoint1 = new paper.Point(Math.trunc((D-A)*Math.cos(th)-(b/2)*Math.sin(th)) + x,
											Math.trunc((D-A)*Math.sin(th)+(b/2)*Math.cos(th)) + y);
			
			var newPoint2 = new paper.Point(Math.trunc((D-A)*Math.cos(th)+(b/2)*Math.sin(th)) + x,
											Math.trunc((D-A)*Math.sin(th)-(b/2)*Math.cos(th)) + y);
											
			var newPoint3 = new paper.Point(drawingObject.firstSegment.point.x,drawingObject.firstSegment.point.y);
			var newPoint4 = new paper.Point((newPoint1.x+newPoint2.x)/2,(newPoint1.y+newPoint2.y)/2);
			
			drawingObject.firstSegment.point.x = (newPoint1.x+newPoint2.x)/2;
			drawingObject.firstSegment.point.y = (newPoint1.y+newPoint2.y)/2;
			
			drawingObject.insert(0,newPoint1);
			drawingObject.insert(0,newPoint3);		
			drawingObject.insert(0,newPoint2);		
			drawingObject.insert(0,newPoint4);
		}
		
		paper.view.draw();
		
		fEdgeObjects.push(drawingObject);
	};
	this.eraseOrientedPathEdge = function(startMindObjectId, endMindObjectId){
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
	this.moveOrientedPathEdge = function(x, y, z, startMindObjectId, endMindObjectId, movingMindObjectId){
		for(var i=0;i<fEdgeObjects.length; i++){  
			if( ((compareIdValue(fEdgeObjects[i].fStartMindObjectId, startMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, endMindObjectId)))
					||
				((compareIdValue(fEdgeObjects[i].fStartMindObjectId, endMindObjectId)) && (compareIdValue(fEdgeObjects[i].fEndMindObjectId, startMindObjectId))) ) {			
				
				var movingSegmentObject = null;
				var movingSegmentObjectIdx = 0;
				var standardSegmentObjectIdx = 0;
				
				var fixedSegmentObject = null;
				var fixedSegmentObjectIdx = 0;
	
				var rotationAngle = null;

				
				if(compareIdValue(movingMindObjectId, fEdgeObjects[i].fStartMindObjectId)){
					if(fEdgeObjects[i].bidirectional){						
						movingSegmentObjectIdx = 4;		
						standardSegmentObjectIdx = 2;
					}
					else{
						movingSegmentObjectIdx = 0;
						standardSegmentObjectIdx = 0;
					}
					
					movingSegmentObject = fEdgeObjects[i].segments[standardSegmentObjectIdx];
					fixedSegmentObject = fEdgeObjects[i].segments[fEdgeObjects[i].segments.length-3];
						
					
					var originalVector = new paper.Point(movingSegmentObject.point.x - fixedSegmentObject.point.x, 
														movingSegmentObject.point.y - fixedSegmentObject.point.y);
					
					var movedVector = new paper.Point(x - fixedSegmentObject.point.x, 
														y - fixedSegmentObject.point.y);
						
					var rotationAngle = originalVector.getDirectedAngle(movedVector);

					for(var j=0; j<fEdgeObjects[i].segments.length; j++){
						fEdgeObjects[i].segments[j].point = fEdgeObjects[i].segments[j].point.rotate(rotationAngle,fixedSegmentObject.point);
					}
					
					var diff_X = fEdgeObjects[i].segments[standardSegmentObjectIdx].point.x - x;
					var diff_Y = fEdgeObjects[i].segments[standardSegmentObjectIdx].point.y - y;
					
					for(var j=movingSegmentObjectIdx;j>=0; j--){
						fEdgeObjects[i].segments[j].point.x -= diff_X;
						fEdgeObjects[i].segments[j].point.y -= diff_Y;
					}
				}
				else if(compareIdValue(movingMindObjectId, fEdgeObjects[i].fEndMindObjectId)){						
					
				
					if(fEdgeObjects[i].bidirectional)						
						fixedSegmentObjectIdx = 2;					
					else
						fixedSegmentObjectIdx = 0;
					
					movingSegmentObject = fEdgeObjects[i].segments[fEdgeObjects[i].segments.length-3];
					fixedSegmentObject = fEdgeObjects[i].segments[fixedSegmentObjectIdx];
						
					var originalMovingSegmentX = movingSegmentObject.point.x;
					var originalMovingSegmentY = movingSegmentObject.point.y;
					
					var originalVector = new paper.Point(movingSegmentObject.point.x - fixedSegmentObject.point.x, 
														movingSegmentObject.point.y - fixedSegmentObject.point.y);
					
					var movedVector = new paper.Point(x - fixedSegmentObject.point.x, 
														y - fixedSegmentObject.point.y);
						
					var rotationAngle = originalVector.getDirectedAngle(movedVector);
					
					for(var j=0; j<fEdgeObjects[i].segments.length; j++){
						fEdgeObjects[i].segments[j].point = fEdgeObjects[i].segments[j].point.rotate(rotationAngle,fixedSegmentObject.point);
					}

					var diff_X = fEdgeObjects[i].segments[fEdgeObjects[i].segments.length-3].point.x - x;
					var diff_Y = fEdgeObjects[i].segments[fEdgeObjects[i].segments.length-3].point.y - y;
					
					for(var j=fEdgeObjects[i].segments.length-5; j<fEdgeObjects[i].segments.length; j++){
						fEdgeObjects[i].segments[j].point.x -= diff_X;
						fEdgeObjects[i].segments[j].point.y -= diff_Y;
					}
					
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
	
	
	this.drawCirclesOnShapeVertex = function(mindObjectId, circleRadius, circleColor){
		var targetShape = null;
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				targetShape = fShapeObjects[i];
				break;
			}				
		}
		
		if(targetShape == null)
			return;
		
		for(var i=0; i<targetShape.segments.length; i++){					
			var drawingObject = new paper.Path.Circle(targetShape.segments[i].point,circleRadius);		
			drawingObject.fillColor =  circleColor;
			
			targetShape.segments[i].drawingObject = drawingObject;			
		}
		
		verticesOnShape = targetShape.segments;
		
		paper.view.draw();
	};
	
	this.moveCirclesOnShapeVertex = function(mindObjectId, central_x, central_y, central_z){
		var targetShape = null;
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				targetShape = fShapeObjects[i];
				break;
			}				
		}
		
		if(targetShape == null || targetShape.segments[i].drawingObject == undefined)
			return;
		
		
		for(var i=0; i<targetShape.segments.length; i++){
			var x_diff = targetShape.position.x - central_x;
			var y_diff = targetShape.position.y - central_y;
			
			var newX = targetShape.segments[i].drawingObject.position.x - x_diff;
			var newY = targetShape.segments[i].drawingObject.position.y - y_diff;			
			
			var newPoint = new paper.Point(newX,newY);	
			targetShape.segments[i].drawingObject.position = newPoint;
		}
		paper.view.draw();		
	};
	this.syncCirclesOnShapeVertex = function(mindObjectId){
		
		if(verticesOnShape == null)
			return;
		
		for(var i=0; i<verticesOnShape.length; i++){								
			verticesOnShape[i].drawingObject.position = verticesOnShape[i].point;
		}
		paper.view.draw();
	}
	
	this.isCirclesOnShapeContaining = function(mindObjectId, x, y, z){
		var isContaining = false;
		
		if(verticesOnShape == null)
			return false;
		
		for(var i=0; i<verticesOnShape.length; i++){								
			if(verticesOnShape[i].drawingObject.contains(new paper.Point(x,y)))
				isContaining = true;
		}
		return isContaining;
		
	};
	
	
	this.eraseCirclesOnShapeVertex = function(mindObjectId){
		var targetShape = null;
		
		if(verticesOnShape == null)
			return;
		
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				targetShape = fShapeObjects[i];
				break;
			}				
		}
		
		if(targetShape == null)
			return;
		
		for(var i=0; i<targetShape.segments.length; i++){								
			targetShape.segments[i].drawingObject.remove();
			delete targetShape.segments[i].drawingObject;
		}
		verticesOnShape = null;
		
		paper.view.draw();		
	};
	
	this.isColliding = function(firstMindObject, secondMindObject) {
		//Need to be implemented..
	};
	this.isContaining = function(x, y, z, mindObject){
	
		var shapeRet = false;
		var contentsRet = false;
		
		var point = new paper.Point(x,y);
		
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObject.fMindObjectId)){					
				shapeRet = fShapeObjects[i].contains(point);
				break;
			}
		}
		
		for(var i=0; i<fContentsObjects.length;i++){
			if(compareIdValue(fContentsObjects[i].fMindObjectId,mindObject.fMindObjectId)){					
				contentsRet = fContentsObjects[i].contains(point);
				break;
			}
		}
		point = null;	
		
		return (shapeRet || contentsRet);
	};
	
	this.getIntersectionFromCenter = function(x, y, z, mindObjectId){
		var targetShape = null;
		
		for(var i=0; i<fShapeObjects.length;i++){
			if(compareIdValue(fShapeObjects[i].fMindObjectId,mindObjectId)){
				targetShape = fShapeObjects[i];
				break;
			}				
		}
		if(targetShape == null)
			return null;
		
		var from = new paper.Point(x,y);
		var to = targetShape.position;
		var tempPath = new paper.Path.Line(from,to);
		
		var interSection = targetShape.getIntersections(tempPath);		
		var ret = null;
		if(interSection.length == 0)
			ret = [x,y,z];
		else
			ret = [interSection[0].point.x,interSection[0].point.y,0];
		
		
		tempPath.remove();
		tempPath = null;
		from = null;
		
		return ret;		
	};
}

PaperJS_DrawingCCInterface.prototype = new DrawingCCInterface("default");
PaperJS_DrawingCCInterface.constructor = PaperJS_DrawingCCInterface;




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