

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
		return 30;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.fRadius = 9;
		progressStatusInfo.direction = 1;
		progressStatusInfo.delta = (finalStatusInfo.fRadius - 9)/25;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=27)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_CircleShapeDeletion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.direction = 1;
		progressStatusInfo.delta = (progressStatusInfo.fRadius - finalStatusInfo.fRadius)/50;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=10)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.count++;
	}
};


const DefinableAnimInfoFunc_CircleShapeExpansion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.delta = ( progressStatusInfo.fRadius - finalStatusInfo.fRadius)/70;
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

const DefinableAnimInfoFunc_RectangleShapeDeletion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.direction = 1;
		progressStatusInfo.delta = (progressStatusInfo.fWidth - finalStatusInfo.fWidth)/50;
		progressStatusInfo.whRatio = progressStatusInfo.fHeight/progressStatusInfo.fWidth;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=10)
			progressStatusInfo.direction = -1;
			
		progressStatusInfo.fWidth += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.fHeight += progressStatusInfo.delta * progressStatusInfo.direction * progressStatusInfo.whRatio;
		
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_RectangleShapeExpansion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.delta = (finalStatusInfo.fWidth - progressStatusInfo.fWidth)/70;
		progressStatusInfo.whRatio = finalStatusInfo.fHeight/finalStatusInfo.fWidth;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
			
		progressStatusInfo.fWidth += progressStatusInfo.delta;
		progressStatusInfo.fHeight += progressStatusInfo.delta * progressStatusInfo.whRatio;
		
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
			
		
		var fsRatio = progressStatusInfo.fSecondRadius / progressStatusInfo.fFirstRadius;
					

		progressStatusInfo.fFirstRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.fSecondRadius += progressStatusInfo.delta * fsRatio * progressStatusInfo.direction;
		
		progressStatusInfo.count++;
	}
};

const DefinableAnimInfoFunc_StarShapeDeletion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.direction = 1;
		var deltaFactor = finalStatusInfo.fFirstRadius > finalStatusInfo.fSecondRadius? finalStatusInfo.fFirstRadius : finalStatusInfo.fSecondRadius;
		var deletaFactorInit = progressStatusInfo.fFirstRadius > progressStatusInfo.fSecondRadius? progressStatusInfo.fFirstRadius : progressStatusInfo.fSecondRadius;
		progressStatusInfo.delta = (deletaFactorInit - deltaFactor)/50;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
		if(progressStatusInfo.count>=10)
			progressStatusInfo.direction = -1;
			
		
		var fsRatio = progressStatusInfo.fSecondRadius / progressStatusInfo.fFirstRadius;
					

		progressStatusInfo.fFirstRadius += progressStatusInfo.delta * progressStatusInfo.direction;
		progressStatusInfo.fSecondRadius += progressStatusInfo.delta * fsRatio * progressStatusInfo.direction;
		
		progressStatusInfo.count++;
	}
};



const DefinableAnimInfoFunc_StarShapeExpansion = {
	getRepeatCount : function (progressStatusInfo, finalStatusInfo){
		return 70;
	},
	initStatusInfo : function(progressStatusInfo, finalStatusInfo){
		progressStatusInfo.delta = (finalStatusInfo.fFirstRadius - progressStatusInfo.fFirstRadius)/70;
		progressStatusInfo.count = 0;
		//finalStatusInfo.fRadius = 0;
	},
	updateStatusInfo : function(progressStatusInfo, finalStatusInfo){
			
		progressStatusInfo.fFirstRadius += progressStatusInfo.delta;
		progressStatusInfo.fSecondRadius += progressStatusInfo.delta;
		
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
functionContainer.set("DefinableAnimInfoFunc_CircleShapeDeletion",DefinableAnimInfoFunc_CircleShapeDeletion);
functionContainer.set("DefinableAnimInfoFunc_CircleShapeExpansion",DefinableAnimInfoFunc_CircleShapeExpansion);

functionContainer.set("DefinableAnimInfoFunc_RectangleShapeCreation",DefinableAnimInfoFunc_RectangleShapeCreation);
functionContainer.set("DefinableAnimInfoFunc_RectangleShapeDeletion",DefinableAnimInfoFunc_RectangleShapeDeletion);
functionContainer.set("DefinableAnimInfoFunc_RectangleShapeExpansion",DefinableAnimInfoFunc_RectangleShapeExpansion);

functionContainer.set("DefinableAnimInfoFunc_StarShapeCreation",DefinableAnimInfoFunc_StarShapeCreation);
functionContainer.set("DefinableAnimInfoFunc_StarShapeDeletion",DefinableAnimInfoFunc_StarShapeDeletion);
functionContainer.set("DefinableAnimInfoFunc_StarShapeExpansion",DefinableAnimInfoFunc_StarShapeExpansion);

function EllipseShapeMOCAnimationInfoGenerator(shapeType, shapeTypeDendentInfo){
	var fShapeType = shapeType;
	var fShapeTypeDependentInfo = shapeTypeDendentInfo;
};
