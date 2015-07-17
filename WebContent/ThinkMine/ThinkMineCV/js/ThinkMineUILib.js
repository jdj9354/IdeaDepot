if(!window.ThinkMine)
	ThinkMine = {};
if(!ThinkMine.Lib)
	ThinkMine.Lib = {};
if(!ThinkMine.Lib.ExternalUI)
	ThinkMine.Lib.ExternalUI = {};
	

	
ThinkMine.Lib.ExternalUI.SpectrumColorPicker = new function(undefined){
	var fSpectrumDivName = null;
	var fSpectrumDiv = null;		
	
	var fTmCanvas = null;
	
	var fRed = 0;
	var fGreen = 0;
	var fBlue = 0;
	var fAlpha = 0;
	
	this.attach = function(spectrumDivName,tmCanvas) {
		if(fSpectrumDivName != null){
			console.log("SpectrumDivName was already attached");
			return;			
		}
		
		
		fSpectrumDivName = spectrumDivName;
		fSpectrumDiv = document.getElementById(fSpectrumDivName);
		
		var curColorVal = $("#"+fSpectrumDivName).spectrum("get").toRgb();
		fRed = curColorVal.r;
		fGreen = curColorVal.g;
		fBlue = curColorVal.b;
		fAlpha = curColorVal.a;
		
		ThinkMine.Lib.ExternalUI.ColorPickerRedInput.setRedValue(fRed);
		ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.setGreenValue(fGreen);
		ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.setBlueValue(fBlue);
		ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.setAlphaValue(fAlpha);
		
		fTmCanvas = tmCanvas;

		$("#"+fSpectrumDivName).on('move.spectrum', function(e,color) {
									var rgb = color.toRgb();
									ThinkMine.Lib.ExternalUI.ColorPickerRedInput.setRedValue(rgb.r);
									ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.setGreenValue(rgb.g);
									ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.setBlueValue(rgb.b);
									ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.setAlphaValue(rgb.a);
									
									fRed = rgb.r;
									fGreen = rgb.g;
									fBlue = rgb.b;
									fAlpha = rgb.a;
									
									fTmCanvas.setShapeFilling({
														fFillType:FillingTypeEnum.SimpleColor,
														r:rgb.r,
														g:rgb.g,
														b:rgb.b,
														a:rgb.a});									
								});						
	};
	this.getRedValue = function(){
		return fRed;
	};
	this.getGreenValue = function(){
		return fGreen;
	};
	this.getBlueValue = function(){
		return fBlue;
	};
	this.getAlphaValue = function(){
		return fAlpha;
	};
}
ThinkMine.Lib.ExternalUI.ColorPickerRedInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;	
	var self = this;
	
	var fColorPickerName = null;
	var hiddenColorInput = null;
	
	this.attach = function(inputTextName, colorPickerName) {
		if(fInputTextName != null){
			fInputElement.onkeypress = null;
			fInputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		fInputElement = document.getElementById(fInputTextName);
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputTextName);
			return;
		}		
		fInputElement.onkeypress = validateNumber;
		fInputElement.onkeyup = onKeyUp;
		fInputElement.value = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getRedValue();
		
		fColorPickerName = colorPickerName;
		hiddenColorInput = $('#'+fColorPickerName).siblings('.sp-container').find('.sp-input');		
	};
	this.setRedValue = function(value){
		if(fInputElement == null || fInputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			fInputElement.value = value;
		}
	};
	this.getRedValue = function(){
		return fInputElement.value;

	};
	var onValueChanged = function(){
		var color = {r : ThinkMine.Lib.ExternalUI.ColorPickerRedInput.getRedValue(),
					 g : ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.getGreenValue(),
					 b : ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.getBlueValue(),
					 a : ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.getAlphaValue()
		};
		var colorString;
		if (color.a == 1.0){
			colorString = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
		}
		else{							
			colorString = "rgba(" + color.r+ "," + color.g + "," + color.b + "," + color.a + ")";
		}
		hiddenColorInput[0].value = colorString;			
		hiddenColorInput.trigger('change');		
	};
	function validateNumber(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	}
	
	function preventLargerThan255(){
		var element = document.getElementById(fInputTextName);
		if(parseInt(element.value) > 255)
			element.value = 255;
	}	
	function onKeyUp(){
		preventLargerThan255();
		onValueChanged();
	}	
}

ThinkMine.Lib.ExternalUI.ColorPickerGreenInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	var self = this;
	
	var fColorPickerName = null;
	var fColorPickerJQObj = null;
	
	this.attach = function(inputTextName, colorPickerName) {
		if(fInputTextName != null){
			fInputElement.onkeypress = null;
			fInputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		fInputElement = document.getElementById(fInputTextName);
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputTextName);
			return;
		}		
		fInputElement.onkeypress = validateNumber;
		fInputElement.onkeyup = onKeyUp;
		fInputElement.value = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getGreenValue();
		
		fColorPickerName = colorPickerName;
		hiddenColorInput = $('#'+fColorPickerName).siblings('.sp-container').find('.sp-input');		
	};
	this.setGreenValue = function(value){
		if(fInputElement == null || fInputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			fInputElement.value = value;
		}
	};
	this.getGreenValue = function(){
		return fInputElement.value;

	};
	var onValueChanged = function(){
		var color = {r : ThinkMine.Lib.ExternalUI.ColorPickerRedInput.getRedValue(),
					 g : ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.getGreenValue(),
					 b : ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.getBlueValue(),
					 a : ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.getAlphaValue()
		};
		var colorString;
		if (color.a == 1.0){
			colorString = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
		}
		else{							
			colorString = "rgba(" + color.r+ "," + color.g + "," + color.b + "," + color.a + ")";
		}
		hiddenColorInput[0].value = colorString;			
		hiddenColorInput.trigger('change');		
	};
	function validateNumber(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	}
	
	function preventLargerThan255(){
		var element = document.getElementById(fInputTextName);
		if(parseInt(element.value) > 255)
			element.value = 255;
	}	
	function onKeyUp(){
		preventLargerThan255();
		onValueChanged();
	}	
}

ThinkMine.Lib.ExternalUI.ColorPickerBlueInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	var self = this;
	
	var fColorPickerName = null;
	var fColorPickerJQObj = null;
	
	this.attach = function(inputTextName, colorPickerName) {
		if(fInputTextName != null){
			fInputElement.onkeypress = null;
			fInputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		fInputElement = document.getElementById(fInputTextName);
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputTextName);
			return;
		}		
		fInputElement.onkeypress = validateNumber;
		fInputElement.onkeyup = onKeyUp;
		fInputElement.value = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getBlueValue();
		
		fColorPickerName = colorPickerName;
		hiddenColorInput = $('#'+fColorPickerName).siblings('.sp-container').find('.sp-input');		
	};
	this.setBlueValue = function(value){
		if(fInputElement == null || fInputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			fInputElement.value = value;
		}
	};
	this.getBlueValue = function(){
		return fInputElement.value;
	};
	var onValueChanged = function(){
		var color = {r : ThinkMine.Lib.ExternalUI.ColorPickerRedInput.getRedValue(),
					 g : ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.getGreenValue(),
					 b : ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.getBlueValue(),
					 a : ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.getAlphaValue()
		};
		var colorString;
		if (color.a == 1.0){
			colorString = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
		}
		else{							
			colorString = "rgba(" + color.r+ "," + color.g + "," + color.b + "," + color.a + ")";
		}
		hiddenColorInput[0].value = colorString;			
		hiddenColorInput.trigger('change');		
	};
	function validateNumber(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	}
	
	function preventLargerThan255(){
		var element = document.getElementById(fInputTextName);
		if(parseInt(element.value) > 255)
			element.value = 255;
	}	
	function onKeyUp(){
		preventLargerThan255();
		onValueChanged();
	}
}

ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	var self = this;
	
	var fColorPickerName = null;
	var fColorPickerJQObj = null;
	
	this.attach = function(inputTextName, colorPickerName) {
		if(fInputTextName != null){
			fInputElement.onkeypress = null;
			fInputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		fInputElement = document.getElementById(fInputTextName);
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputTextName);
			return;
		}		
		fInputElement.onkeypress = validateNumber;
		fInputElement.onkeyup = onKeyUp;
		fInputElement.value = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getAlphaValue();
		
		fColorPickerName = colorPickerName;
		hiddenColorInput = $('#'+fColorPickerName).siblings('.sp-container').find('.sp-input');		
	};
	this.setAlphaValue = function(value){
		if(fInputElement == null || fInputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >1)
				return;
			fInputElement.value = value;
		}
	};
	this.getAlphaValue = function(){
		return fInputElement.value;

	};
	var onValueChanged = function(){
		var color = {r : ThinkMine.Lib.ExternalUI.ColorPickerRedInput.getRedValue(),
					 g : ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.getGreenValue(),
					 b : ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.getBlueValue(),
					 a : ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.getAlphaValue()
		};
		var colorString;
		if (color.a == 1.0){
			colorString = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
		}
		else{							
			colorString = "rgba(" + color.r+ "," + color.g + "," + color.b + "," + color.a + ")";
		}
		hiddenColorInput[0].value = colorString;			
		hiddenColorInput.trigger('change');		
	};
	function validateNumber(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if ((charCode != 46) && (charCode > 31 && (charCode < 48 || charCode > 57)))
			return false;
		if(charCode == 46 && fInputElement.value.lastIndexOf(".") != -1)
			return false;
		return true;
	}
	
	function preventLargerThanOne(){
		var element = document.getElementById(fInputTextName);
		if(parseFloat(element.value) > 1.0)
			element.value = 1.0;
	}	
	function onKeyUp(){
		preventLargerThanOne();
		onValueChanged();
	}
}

ThinkMine.Lib.ExternalUI.GradientColorPicker = new function(undefined){
	var fGradXDivName = null;
	var fGradXDiv = null;
	var fTmCanvas = null;		
	
	var fAngle = 0;
	var fStopInfo = [];
	
	this.attach = function(gradXDivName,tmCanvas) {
		if(fGradXDivName != null){
			console.log("GradXDiv was already attached");
			return;		
		}
		
		
		fGradXDivName = gradXDivName;
		fGradXDiv = document.getElementById(gradXDivName);
		
		fTmCanvas = tmCanvas;
		
		if(fGradXDiv == null || fGradXDiv == undefined){
			console.log("There is no such gradX element " + gradXDivName);
			return;
		}			
		gradx.gx("#"+fGradXDivName).change = onChangeCallBack;	
		gradx.direction=90-fAngle;
		gradx.apply_style(gradx.panel, gradx.get_style_value());
	};
	
	this.setAngle = function(angle){
		fAngle = angle;
		gradx.direction=90-fAngle;
		gradx.apply_style(gradx.panel, gradx.get_style_value());
	};
	
	var onChangeCallBack = function(slider){
		for(var i=0; i<slider.length; i++){
			var rgbaArray = parseColor(slider[i][0]);
			var rgbaObj = {r : parseInt(rgbaArray[0]),
							g : parseInt(rgbaArray[1]),
							b : parseInt(rgbaArray[2])
							};
			if(rgbaArray.length == 3)
				rgbaObj.a = 1.0;
			else
				rgbaObj.a = parseFloat(rgbaArray[3]);
			
			var offset = slider[i][1]/100;
			fStopInfo[i*2] = rgbaObj;
			fStopInfo[i*2+1] = offset;
		}
		var passingInfo = {fAngle : fAngle,
							fStopInfo : fStopInfo
							};
		fTmCanvas.setShapeFilling(passingInfo);
	};
	var parseColor = function (input) {
		return input.split("(")[1].split(")")[0].split(",");
	}
}

ThinkMine.Lib.ExternalUI.AnglePicker = new function(undefined){
	var fAngleCanvasName = null;
	var fAngleCanvas = null;
	var fTmCanvas = null;		
	
	var fAngle = 90;
	
	this.attach = function(angleCanvasName,tmCanvas) {
		if(fAngleCanvasName != null){
			console.log("fAngleCanvas was already attached");
			return;		
		}
		
		
		fAngleCanvasName = angleCanvasName;
		fAngleCanvas = document.getElementById(fAngleCanvasName);
		fAngleCanvas.notifyAngleChange = function(angle){
			fAngle = angle;
			tmCanvas.setAngle(fAngle);
			ThinkMine.Lib.ExternalUI.GradientColorPicker.setAngle(fAngle);
		};
		
		fTmCanvas = tmCanvas;
		
		if(fAngleCanvas == null || fAngleCanvas == undefined){
			console.log("There is no such angle Canvas element " + fAngleCanvas);
			return;
		}			
	};	

	this.getAngle = function(){
		return fAngle;
	};
}




ThinkMine.Lib.ExternalUI.RecentColor = new function(undefined){
	var fRecentColorDivName = null;
	var fRecentColorDivElement = null;
	var numRecentColors = 0;
	var countRecentColors = 0;
	
	var recentCanvasArray = null;
	
	var fTmCanvas = null;
	
	
	this.attach = function(recentColorDivName, tmCanvas) {		
		
		fRecentColorDivName = recentColorDivName;
		
		fRecentColorDivElement = document.getElementById(fRecentColorDivName);
		
		if(fRecentColorDivName == null || fRecentColorDivElement == undefined){
			console.log("There is no such fRecentColorDivElement element " + fRecentColorDivName);
			return;
		}
		
		recentCanvasArray = fRecentColorDivElement.getElementsByTagName("canvas");
		numRecentColors = recentCanvasArray.length;		
		
		fTmCanvas = tmCanvas;
		
		
		for(var i=0; i<numRecentColors; i++){	
			
			var fMouseUP = function(){
				var tempColorInfo = this.colorInfo;						
				
				var fRedString  = tempColorInfo.r.toString(16);
				var fGreenString  = tempColorInfo.g.toString(16);
				var fBlueString  = tempColorInfo.b.toString(16);					
				
				fTmCanvas.setShapeColor("#"+(fRedString.length == 1? "0"+fRedString : fRedString)
									+(fGreenString.length == 1? "0"+fGreenString : fGreenString)
									+(fBlueString.length == 1? "0"+fBlueString : fBlueString));	
			};			
			
			recentCanvasArray[i].addEventListener('mouseup', fMouseUP, false);
			recentCanvasArray[i].colorInfo = {color : 'rgb(255,255,255)',
												r : 255,
												g : 255,
												b : 255};
		}
				
	};

	this.updateRecentColor = function(usedR, usedG, usedB){
		var color = 'rgb(' + usedR + ',' + usedG + ',' + usedB + ')';
		
		var colorIdx = countRecentColors;
		
		if(countRecentColors < numRecentColors){
			recentCanvasArray[countRecentColors].colorInfo = {color : color,
															r : usedR,
															g : usedG,
															b : usedB};
			countRecentColors ++;
		}
		else{
			for(var i=0; i<recentCanvasArray.length-1; i++){
				recentCanvasArray[i].colorInfo = recentCanvasArray[i+1].colorInfo;
			}
			recentCanvasArray[countRecentColors-1].colorInfo = {color : color,
															r : usedR,
															g : usedG,
															b : usedB};
		}
		
		for(var i=0; i<countRecentColors; i++){			
			var canvas = recentCanvasArray[i];
			var context = canvas.getContext('2d');
			
			context.clearRect(0,0,canvas.width,canvas.height);
			
			context.beginPath();
			context.fillStyle = recentCanvasArray[i].colorInfo.color;
			context.fillRect(0, 0, canvas.width,canvas.height);
			context.strokeRect(0, 0, canvas.width,canvas.height);			
		}
	};
}


ThinkMine.Lib.ExternalUI.CircleImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	
	this.sendInfoToTmCanvas = function(){				
		
		if(fTmCanvas.isAddModeEnabled()){
			if (fTmCanvas.getMenuSelectedShape() == "CircleShape"){
				fTmCanvas.disableObjectAddMode();
			}
			else{
				fTmCanvas.setMenuSelectedShape(0);
			}

		}
		else {
			fTmCanvas.enableObjectAddMode();
			fTmCanvas.setMenuSelectedShape(0);
		}
			
		//Currently Test Code
		fTmCanvas.setMenuSelectedContents(0);
		fTmCanvas.setMenuInsertedCDI(new TextContentsTypeDependentInfo('Courier New','bold',25, new SimpleColorFilling("#FFFFFF")));
		fTmCanvas.setMenuInsertedCV("UI Interaction Test");
		//Currently Test Code
		
	};
}

ThinkMine.Lib.ExternalUI.RectangleImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		
		if(fTmCanvas.isAddModeEnabled()){
			if (fTmCanvas.getMenuSelectedShape() == "RectangleShape"){
				fTmCanvas.disableObjectAddMode();
			}
			else{
				fTmCanvas.setMenuSelectedShape(1);
			}

		}
		else {
			fTmCanvas.enableObjectAddMode();
			fTmCanvas.setMenuSelectedShape(1);
		}
			
		//Currently Test Code
		fTmCanvas.setMenuSelectedContents(0);
		fTmCanvas.setMenuInsertedCDI(new TextContentsTypeDependentInfo('Courier New','bold',25, new SimpleColorFilling("#FFFFFF")));
		fTmCanvas.setMenuInsertedCV("UI Interaction Test");
		//Currently Test Code
		
	};
}


ThinkMine.Lib.ExternalUI.StarImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		
		if(fTmCanvas.isAddModeEnabled()){
			if (fTmCanvas.getMenuSelectedShape() == "StarShape"){
				fTmCanvas.disableObjectAddMode();
			}
			else{
				fTmCanvas.setMenuSelectedShape(2);
			}

		}
		else {
			fTmCanvas.enableObjectAddMode();
			fTmCanvas.setMenuSelectedShape(2);
		}
			
		//Currently Test Code
		fTmCanvas.setMenuSelectedContents(0);
		fTmCanvas.setMenuInsertedCDI(new TextContentsTypeDependentInfo('Courier New','bold',25,new SimpleColorFilling("#FFFFFF")));
		fTmCanvas.setMenuInsertedCV("UI Interaction Test");
		//Currently Test Code
		
	};
}


ThinkMine.Lib.ExternalUI.PolygonImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		
		if(fTmCanvas.isAddModeEnabled()){
			if (fTmCanvas.getMenuSelectedShape() == "PolygonShape"){
				fTmCanvas.disableObjectAddMode();
			}
			else{
				fTmCanvas.setMenuSelectedShape(3);
			}

		}
		else {
			fTmCanvas.enableObjectAddMode();
			fTmCanvas.setMenuSelectedShape(3);
		}
			
		//Currently Test Code
		fTmCanvas.setMenuSelectedContents(0);
		fTmCanvas.setMenuInsertedCDI(new TextContentsTypeDependentInfo('Courier New','bold',25,new SimpleColorFilling("#FFFFFF")));
		fTmCanvas.setMenuInsertedCV("UI Interaction Test");
		//Currently Test Code
		
	};
}


ThinkMine.Lib.ExternalUI.TextContentsImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(0);		
	};
}

ThinkMine.Lib.ExternalUI.ImageContentsImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(1);		
	};
}

ThinkMine.Lib.ExternalUI.MovieContentsImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(2);		
	};
}


ThinkMine.Lib.ExternalUI.SoundContentsImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(3);		
	};
}

ThinkMine.Lib.ExternalUI.WebPreviewContentsImageButton = new function(undefined){
	var fImageButtonName = null;
	var fImageButtonElement = null;
	var fTmCanvas = null;

	this.attach = function(imageButtonName, tmCanvas) {
		if(fImageButtonName != null){
			fImageButtonElement.onclick = null;
		}
		
		fImageButtonName = imageButtonName;		
		fImageButtonElement = document.getElementById(fImageButtonName);
		fTmCanvas = tmCanvas;
		
		if(fImageButtonElement == null || fImageButtonElement == undefined){
			console.log("There is no such fImageButtonElement element " + fInputTextName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(4);		
	};
}
