

function runAnimation(repeatCount, interval){
	
	if(repeatCount == 0){
		postMessage(1);
		
		return;
	}
	postMessage(0);
	setTimeout(function(){runAnimation(repeatCount,interval);},interval);
	repeatCount--;
	//runParse();
}

self.addEventListener('message', function(e){

	var DAI = new DefinableAnimationInfo(e.data.finalStatusInfo,e.data.progressStatusInfo,functionContainer.get(e.data.definedFuncSetName));			
	var AIG = new AnimationInfoGenerator(DAI,e.data.interval);
	
	
	AIG.init();
	AIG.runAnim();

	/*var data = e.data;
	
	var tempShapeType = e.data.fShape.fShapeType;
	var tempShapeTypeDependentInfoForDrawing = e.data.fShape.fShapeTypeDependentInfo;
	var repeatCount = 10;
	var increaseFactor = 0;
	var increaseLimit = 0;
	switch(tempShapeType){
	case "PolygonShape" :
	case "CircleShape" :
		var finalRadius = tempShapeTypeDependentInfoForDrawing.fRadius;
		tempShapeTypeDependentInfoForDrawing.fRadius = 0;			
		var curRadius = tempShapeTypeDependentInfoForDrawing.fRadius;
		increaseFactor = (finalRadius - curRadius)/repeatCount;
		increateLimit
		//repeatCount = parseInt(((finalRadius - curRadius)*1.3 + 3)/3);
		break;
	case "RectangleShape" :
		var finalWidth = tempShapeTypeDependentInfoForDrawing.fWidth;
		var finalHeight = tempShapeTypeDependentInfoForDrawing.fHeight;
		var whRatio = finalHeight/finalWidth;
		tempShapeTypeDependentInfoForDrawing.fWidth = 10;
		tempShapeTypeDependentInfoForDrawing.fHeight = 10;
		var curWidth = tempShapeTypeDependentInfoForDrawing.fWidth;
		var curHeight = tempShapeTypeDependentInfoForDrawing.fHeight;
		
		repeatCount = parseInt(((finalWidth - curWidth)*1.3 + 3)/3);
		break;
	case "StarShape" :
		var finalFirstRadius = tempShapeTypeDependentInfoForDrawing.fFirstRadius;
		var finalSecondRadius = tempShapeTypeDependentInfoForDrawing.fSecondRadius;
		var finalOuterRadius = finalFirstRadius > finalSecondRadius? finalFirstRadius : finalSecondRadius;
		
		tempShapeTypeDependentInfoForDrawing.fFirstRadius = finalFirstRadius > finalSecondRadius? 10 : 5;
		tempShapeTypeDependentInfoForDrawing.fSecondRadius = finalFirstRadius > finalSecondRadius? 5 : 10;
		
		var curOuterRadius = tempShapeTypeDependentInfoForDrawing.fFirstRadius > tempShapeTypeDependentInfoForDrawing.fSecondRadius?
								tempShapeTypeDependentInfoForDrawing.fFirstRadius : tempShapeTypeDependentInfoForDrawing.fSecondRadius;
								
		var fsRatio = finalFirstRadius > finalSecondRadius? (finalSecondRadius / finalFirstRadius) : (finalFirstRadius / finalSecondRadius);
		repeatCount = parseInt(((finalOuterRadius - curOuterRadius)*1.3 + 3)/3);
		
		break;		
	}

	runAnimation(data.repeatCount, data.interval);*/
},false);


function AnimationInfoGenerator(definableAnimationInfo, interval){

	
	var fInitRepeatCountFunc = definableAnimationInfo.getRepeatCount;
	var fInitShapeInfoFunc = definableAnimationInfo.initStatusInfo;
	var fUpdateFunc = definableAnimationInfo.updateStatusInfo;
	var fGetProgressStatusInfo = definableAnimationInfo.getProgressStatusInfo;

	var fRepeatCount = 10;
	//var fIncreaseFactor = 0;
	//var fIncreaseLimit = 0;
	var fInterval = interval;
	var isStarted = false;
	
	this.init = function(){
		if(isStarted){
			console.log("The animation is already started");
			return;
		}
		
		if((/*fProgressStatusInfo == null || fProgressStatusInfo == null || */fInitRepeatCountFunc == null
			|| fInitShapeInfoFunc == null || fUpdateFunc == null)
			
			||
			
			(/*fProgressStatusInfo == undefined || fProgressStatusInfo == undefined || */fInitRepeatCountFunc == undefined
			|| fInitShapeInfoFunc == undefined || fUpdateFunc == undefined) ){
			
			console.log("AnimationInfo is not sufficient");
			return;
		}
		
		fRepeatCount = fInitRepeatCountFunc();
		
		fInitShapeInfoFunc();
		
	};
	this.runAnim = function(){
		if(!isStarted)
			isStarted = !isStarted;
		
		if(fRepeatCount == 0){
			postMessage({flag : 1, info : fGetProgressStatusInfo()});
			
			return;
		}
		postMessage({flag : 0, info : fGetProgressStatusInfo()});
		fUpdateFunc();
		fRepeatCount--;	
		console.log("a");
		var passingObj = this;
		setTimeout(function(){passingObj.runAnim();},fInterval);
				
	};
	
	
};

function DefinableAnimationInfo (finalStatusInfo, progressStatusInfo, definableAnimInfoFunc){
	var fFinalStatusInfo = finalStatusInfo;
	var fProgressStatusInfo = progressStatusInfo;
	var fDefinableAnimInfoFunc = definableAnimInfoFunc;
	
	this.getRepeatCount = function(){
		return fDefinableAnimInfoFunc.getRepeatCount(fProgressStatusInfo,fFinalStatusInfo);		
	};
	
	this.initStatusInfo = function(){
		fDefinableAnimInfoFunc.initStatusInfo(fProgressStatusInfo,fFinalStatusInfo);
	};
	this.updateStatusInfo = function(){
		return fDefinableAnimInfoFunc.updateStatusInfo(fProgressStatusInfo,fFinalStatusInfo);
	};
	
	this.getProgressStatusInfo = function(){
		return fProgressStatusInfo;
	};
};

function DefinableAnimInfoFunc (){
	this.getRepeatCount = null;
	this.initStatusInfo = null;
	this.updateStatusInfo = null;
};

const DefinableAnimInfoFunc_CircleShapeCreation = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.fRadius = 9;
		progressStatusInfo.direction = 1;
		progressStatusInfo.delta = (finalStatusInfo.fRadius - 9)/50;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=60)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_CircleShapeExpantion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.delta = (finalStatusInfo.fRadius - progressStatusInfo.fRadius)/70;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
			
		progressStatusInfo.fRadius += progressStatusInfo.delta;
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_RectangleShapeCreation = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.fWidth = 10;
		progressStatusInfo.fHeight = 10;
		progressStatusInfo.direction = 1;
		progressStatusInfo.delta = (finalStatusInfo.fWidth - 10)/50;
		progressStatusInfo.whRatio = finalStatusInfo.fHeight/finalStatusInfo.fWidth;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=60)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fWidth += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.fHeight += progressStatusInfo.delta * progressStatusInfo.direction * progressStatusInfo.whRatio;
		
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_StarShapeCreation = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.fFirstRadius = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? 10 : 5;
		progressStatusInfo.fSecondRadius = finalStatusInfo.fFirstRadius < finalStatusInfo.fSecondRadius? 10 : 5;
		progressStatusInfo.direction = 1;
		var deltaFactor = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? finalStatusInfo.fFirstRadius : finalStatusInfo.fSecondRadius;
		progressStatusInfo.delta = (deltaFactor - 10)/50;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=60)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fFirstRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.fSecondRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		
		progressStatusInfo.count++;
	}
};




var functionContainer = {
	set : function(name,functionSet){
		this[name] = functionSet;
	},
	get : function(name){
		return this[name];
	}
};

functionContainer.set("DefinableAnimInfoFunc_CircleShapeCreation",DefinableAnimInfoFunc_CircleShapeCreation);
functionContainer.set("DefinableAnimInfoFunc_CircleShapeExpantion",DefinableAnimInfoFunc_CircleShapeExpantion);
functionContainer.set("DefinableAnimInfoFunc_RectangleShapeCreation",DefinableAnimInfoFunc_RectangleShapeCreation);
functionContainer.set("DefinableAnimInfoFunc_StarShapeCreation",DefinableAnimInfoFunc_StarShapeCreation);

function EllipseShapeMOCAnimationInfoGenerator(shapeType, shapeTypeDendentInfo){
	var fShapeType = shapeType;
	var fShapeTypeDependentInfo = shapeTypeDendentInfo;
};
