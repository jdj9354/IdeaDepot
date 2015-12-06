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
	
	var fFillingInfo = {};
	
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
		
		fFillingInfo = {
						fFillType:FillingTypeEnum.SimpleColor,
						r:fRed,
						g:fGreen,
						b:fBlue,
						a:fAlpha};		
		
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
									
									fFillingInfo = {
													fFillType:FillingTypeEnum.SimpleColor,
													r:rgb.r,
													g:rgb.g,
													b:rgb.b,
													a:rgb.a};				
									
									ThinkMine.Lib.ExternalUI.ShapeColorCPCanvas.changeCanvasColor(fFillingInfo);						
									ThinkMine.Lib.ExternalUI.TextColorCPCanvas.changeCanvasColor(fFillingInfo);						
								});				
									
		$("#"+fSpectrumDivName).on('dragstop.spectrum', function(e,color) {
			var rgb = color.toRgb();
			ThinkMine.Lib.ExternalUI.CPRecentColor.updateRecentColor(rgb.r,rgb.g,rgb.b,rgb.a);
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
	this.getFillingInfo = function(){
		return fFillingInfo;
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

ThinkMine.Lib.ExternalUI.GradientPicker = new function(undefined){
	var fGradXDivName = null;
	var fGradXDiv = null;
	var fTmCanvas = null;		
	
	var fFillType;
	var fAngle = 0;
	var fStopInfo = [];
	
	var fFillingInfo = {};
	
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

		gradx.change  = onChangeCallBack;	
		gradx.direction=fAngle;
		gradx.apply_style(gradx.panel, gradx.get_style_value());
	};
	
	this.setAngle = function(angle){
		fAngle = angle;
		gradx.direction=fAngle;
		gradx.apply_style(gradx.panel, gradx.get_style_value());
	};
	
	this.getFillingInfo = function(){
		return fFillingInfo;
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
		fFillType = gradx.type == "linear" ? FillingTypeEnum.LinearGradient : FillingTypeEnum.RadialGradient;
		fFillingInfo = {fFillType : fFillType,
							fAngle : fAngle,
							fStopInfo : fStopInfo
							};
		ThinkMine.Lib.ExternalUI.ShapeGradientCanvas.changeCanvasColor(fFillingInfo);
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
			ThinkMine.Lib.ExternalUI.GradientPicker.setAngle(fAngle);
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




ThinkMine.Lib.ExternalUI.CPRecentColor = new function(undefined){
	var fRecentColorDivName = null;
	var fRecentColorDivElement = null;
	var numRecentColors = 0;
	var countRecentColors = 0;
	
	var recentCanvasArray = null;
	
	var fColorPickerName = null;
	var hiddenColorInput = null;
	
	
	this.attach = function(recentColorDivName, colorPickerName) {		
		
		fRecentColorDivName = recentColorDivName;		
		fRecentColorDivElement = document.getElementById(fRecentColorDivName);
		
		if(fRecentColorDivName == null || fRecentColorDivElement == undefined){
			console.log("There is no such fRecentColorDivElement element " + fRecentColorDivName);
			return;
		}
		
		recentCanvasArray = fRecentColorDivElement.getElementsByTagName("canvas");
		numRecentColors = recentCanvasArray.length;		
		
		fColorPickerName = colorPickerName;		
		hiddenColorInput = $('#'+fColorPickerName).siblings('.sp-container').find('.sp-input');		
		
		for(var i=0; i<numRecentColors; i++){	
			
			var fMouseUP = function(){
				var tempColorInfo = this.colorInfo;				
				colorString = "rgba(" + tempColorInfo.r+ "," + tempColorInfo.g + "," + tempColorInfo.b + "," + tempColorInfo.a + ")";
				
				hiddenColorInput[0].value = colorString;			
				hiddenColorInput.trigger('change');					
				$('#'+fColorPickerName).trigger('move',new tinycolor({r:tempColorInfo.r,
																	  g:tempColorInfo.g,
																	  b:tempColorInfo.b,
																	  a:tempColorInfo.a}));			
			};			
			
			recentCanvasArray[i].addEventListener('mouseup', fMouseUP, false);
			recentCanvasArray[i].colorInfo = {color : 'rgba(255,255,255,1.0)',
												r : 255,
												g : 255,
												b : 255,
												a: 1.0};
		}
				
	};

	this.updateRecentColor = function(usedR, usedG, usedB, usedA){
		var color = 'rgba(' + usedR + ',' + usedG + ',' + usedB + ',' + usedA + ')';
		
		var colorIdx = countRecentColors;
		
		if(countRecentColors < numRecentColors){
			recentCanvasArray[countRecentColors].colorInfo = {color : color,
															r : usedR,
															g : usedG,
															b : usedB,
															a : usedA};
			countRecentColors ++;
		}
		else{
			for(var i=recentCanvasArray.length-1; i>0; i--){
				recentCanvasArray[i].colorInfo = recentCanvasArray[i-1].colorInfo;
			}
			recentCanvasArray[0].colorInfo = {color : color,
												r : usedR,
												g : usedG,
												b : usedB,
												a : usedA};
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
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
			console.log("There is no such fImageButtonElement element " + fImageButtonName);
			return;
		}
		fImageButtonElement.onclick = this.sendInfoToTmCanvas;
		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuSelectedContents(4);		
	};
}


ThinkMine.Lib.ExternalUI.ShapeColorCPCanvas = new function(undefined){
		
		var fTmCanvas = null;
		var fCPCanvasName = null;
		var fCPCanvasElement = null;
		
		this.attach = function(cpCanvasName, tmCanvas) {			
			fCPCanvasName = cpCanvasName;
			fCPCanvasElement = document.getElementById(fCPCanvasName);
			fTmCanvas = tmCanvas;
			
			if(fCPCanvasElement == null || fCPCanvasElement == undefined){
				console.log("There is no such fCPCanvasElement element " + fCPCanvasName);
				return;
			}			
			fCPCanvasElement.onclick = function(){
				var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo();
				ThinkMine.Lib.ExternalUI.ShapeFillingOutCanvas.changeCanvasColor(fillInfo);																
			};
			var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo(); 
			this.changeCanvasColor(fillInfo);
			
		};
		this.changeCanvasColor = function(fillInfo){
			var canvas = fCPCanvasElement;
			if(canvas == null || canvas == undefined)
				return;
			var ctx = canvas.getContext("2d");			
			var colorString = "rgba("+fillInfo.r+","+fillInfo.g+","+fillInfo.b+","+fillInfo.a+")"; 
			ctx.fillStyle = colorString;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0,0,canvas.width,canvas.height);				
		};
}


ThinkMine.Lib.ExternalUI.ShapeGradientCanvas = new function(undefined){
		
		var fGradientCanvasName = null;
		var fGradientCanvasElement = null;
		
		this.attach = function(gradientCanvasName) {			
			fGradientCanvasName = gradientCanvasName;
			fGradientCanvasElement = document.getElementById(fGradientCanvasName);
			
			if(fGradientCanvasElement == null || fGradientCanvasElement == undefined){
				console.log("There is no such fGradientCanvasElement element " + fGradientCanvasName);
				return;
			}	

			fGradientCanvasElement.onclick = function(){
				var fillInfo = ThinkMine.Lib.ExternalUI.GradientPicker.getFillingInfo();
				ThinkMine.Lib.ExternalUI.ShapeFillingOutCanvas.changeCanvasColor(fillInfo);
			};
			var fillInfo = ThinkMine.Lib.ExternalUI.GradientPicker.getFillingInfo();
			this.changeCanvasColor(fillInfo);
		};
		this.changeCanvasColor = function(fillInfo){
			var canvas = fGradientCanvasElement;
			var bgColorString = "linear-gradient(" + fillInfo.fAngle +"deg";
			for(var i=0; i<fillInfo.fStopInfo.length; i+=2){
				bgColorString += ",rgba("+fillInfo.fStopInfo[i].r+","+fillInfo.fStopInfo[i].g+","+fillInfo.fStopInfo[i].b+","+fillInfo.fStopInfo[i].a+")";
				bgColorString += " "+ (fillInfo.fStopInfo[i+1]*100) + "%"
			}
			bgColorString += ")";		
			if(canvas != null)
				canvas.style.background = bgColorString;			
		};
}


ThinkMine.Lib.ExternalUI.ShapeFillingOutCanvas = new function(undefined){		
		
		var fTmCanvas = null;
		var fFillingOutCanvasName = null;
		var fFillingOutCanvasElement = null;
		
		this.attach = function(fillingOutCanvasName,tmCanvas) {			
			fFillingOutCanvasName = fillingOutCanvasName;
			fFillingOutCanvasElement = document.getElementById(fFillingOutCanvasName);
			
			fTmCanvas = tmCanvas;
			
			if(fFillingOutCanvasElement == null || fFillingOutCanvasElement == undefined){
				console.log("There is no such fFillingOutCanvasElement element " + fFillingOutCanvasName);
				return;
			}		
			var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo(); 
			this.changeCanvasColor(fillInfo);
			
		};
		this.changeCanvasColor = function(fillInfo){
			if(fillInfo.fFillType == FillingTypeEnum.SimpleColor){
				var canvas = fFillingOutCanvasElement;
				canvas.style.background = "";
				var ctx = canvas.getContext("2d");			
				var colorString = "rgba("+fillInfo.r+","+fillInfo.g+","+fillInfo.b+","+fillInfo.a+")"; 
				ctx.fillStyle = colorString;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillRect(0,0,canvas.width,canvas.height);			
			}
			else if(fillInfo.fFillType == FillingTypeEnum.LinearGradient || 
						fillInfo.fFillType == FillingTypeEnum.RadialGradient){				
						
						
				var canvas = fFillingOutCanvasElement;
				var ctx = canvas.getContext("2d");			
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				var bgColorString = "linear-gradient(" + fillInfo.fAngle +"deg";
				for(var i=0; i<fillInfo.fStopInfo.length; i+=2){
					bgColorString += ",rgba("+fillInfo.fStopInfo[i].r+","+fillInfo.fStopInfo[i].g+","+fillInfo.fStopInfo[i].b+","+fillInfo.fStopInfo[i].a+")";
					bgColorString += " "+ (fillInfo.fStopInfo[i+1]*100) + "%"
				}
				bgColorString += ")";				
				canvas.style.background = bgColorString;			
			}
			fTmCanvas.setShapeFilling(fillInfo);
		};
}


ThinkMine.Lib.ExternalUI.TextColorCPCanvas = new function(undefined){
		
		var fCPCanvasName = null;
		var fCPCanvasElement = null;
		
		this.attach = function(cpCanvasName, tmCanvas) {			
			fCPCanvasName = cpCanvasName;
			fCPCanvasElement = document.getElementById(fCPCanvasName);
			
			if(fCPCanvasElement == null || fCPCanvasElement == undefined){
				console.log("There is no such fCPCanvasElement element " + fCPCanvasName);
				return;
			}			
			fCPCanvasElement.onclick = function(){
				var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo();
				ThinkMine.Lib.ExternalUI.TextFillingOutCanvas.changeCanvasColor(fillInfo);																
			};
			var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo();
			this.changeCanvasColor(fillInfo);
			
		};
		this.changeCanvasColor = function(fillInfo){
			var canvas = fCPCanvasElement;
			if(canvas == null || canvas == undefined)
				return;
			var ctx = canvas.getContext("2d");			
			var colorString = "rgba("+fillInfo.r+","+fillInfo.g+","+fillInfo.b+","+fillInfo.a+")"; 
			ctx.fillStyle = colorString;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0,0,canvas.width,canvas.height);				
		};
}

ThinkMine.Lib.ExternalUI.TextFillingOutCanvas = new function(undefined){
		var fFillingOutCanvasName = null;
		var fFillingOutCanvasElement = null;
		
		var fTmCanvas = null;
		
		this.attach = function(fillingOutCanvasName, tmCanvas) {			
			fFillingOutCanvasName = fillingOutCanvasName;
			fFillingOutCanvasElement = document.getElementById(fFillingOutCanvasName);
			
			fTmCanvas = tmCanvas;
			
			if(fFillingOutCanvasElement == null || fFillingOutCanvasElement == undefined){
				console.log("There is no such fFillingOutCanvasElement element " + fFillingOutCanvasName);
				return;
			}		
			var fillInfo = ThinkMine.Lib.ExternalUI.SpectrumColorPicker.getFillingInfo(); 
			this.changeCanvasColor(fillInfo);
			
		};
		this.changeCanvasColor = function(fillInfo){			
			var canvas = fFillingOutCanvasElement;
			canvas.style.background = "";
			var ctx = canvas.getContext("2d");			
			var colorString = "rgba("+fillInfo.r+","+fillInfo.g+","+fillInfo.b+","+fillInfo.a+")"; 
			ctx.fillStyle = colorString;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0,0,canvas.width,canvas.height);			
			fTmCanvas.setTextFilling(fillInfo);				
		};

}


ThinkMine.Lib.ExternalUI.TextContentsValueInput = new function(undefined){
	var fInputName = null;
	var fInputElement = null;
	var fTmCanvas = null;

	this.attach = function(inputName, tmCanvas) {
		if(fInputName != null){
			fInputElement.onclick = null;
		}
		
		fInputName = imageButtonName;		
		fInputElement = document.getElementById(fInputName);
		fTmCanvas = tmCanvas;
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputName);
			return;
		}
		fInputElement.addEventListener("change", sendInfoToTmCanvas);		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuInsertedCV(fInputElement.value);		
	};
}

ThinkMine.Lib.ExternalUI.ImageContentsValueInput = new function(undefined){
	var fInputName = null;
	var fInputElement = null;
	var fTmCanvas = null;

	this.attach = function(inputName, tmCanvas) {
		if(fInputName != null){
			fInputElement.onclick = null;
		}
		
		fInputName = imageButtonName;		
		fInputElement = document.getElementById(fInputName);
		fTmCanvas = tmCanvas;
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputName);
			return;
		}
		fInputElement.addEventListener("change", sendInfoToTmCanvas);		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuInsertedCV(fInputElement.value);		
	};
}

ThinkMine.Lib.ExternalUI.MovieContentsValueInput = new function(undefined){
	var fInputName = null;
	var fInputElement = null;
	var fTmCanvas = null;

	this.attach = function(inputName, tmCanvas) {
		if(fInputName != null){
			fInputElement.onclick = null;
		}
		
		fInputName = imageButtonName;		
		fInputElement = document.getElementById(fInputName);
		fTmCanvas = tmCanvas;
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputName);
			return;
		}
		fInputElement.addEventListener("change", sendInfoToTmCanvas);		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuInsertedCV(fInputElement.value);		
	};
}

ThinkMine.Lib.ExternalUI.SoundContentsValueInput = new function(undefined){
	var fInputName = null;
	var fInputElement = null;
	var fTmCanvas = null;

	this.attach = function(inputName, tmCanvas) {
		if(fInputName != null){
			fInputElement.onclick = null;
		}
		
		fInputName = imageButtonName;		
		fInputElement = document.getElementById(fInputName);
		fTmCanvas = tmCanvas;
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputName);
			return;
		}
		fInputElement.addEventListener("change", sendInfoToTmCanvas);		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuInsertedCV(fInputElement.value);		
	};
}

ThinkMine.Lib.ExternalUI.WebPreviewContentsValueInput = new function(undefined){
	var fInputName = null;
	var fInputElement = null;
	var fTmCanvas = null;

	this.attach = function(inputName, tmCanvas) {
		if(fInputName != null){
			fInputElement.onclick = null;
		}
		
		fInputName = imageButtonName;		
		fInputElement = document.getElementById(fInputName);
		fTmCanvas = tmCanvas;
		
		if(fInputElement == null || fInputElement == undefined){
			console.log("There is no such fInputElement element " + fInputName);
			return;
		}
		fInputElement.addEventListener("change", sendInfoToTmCanvas);		
	};
	
	this.sendInfoToTmCanvas = function(){		
		fTmCanvas.setMenuInsertedCV(fInputElement.value);		
	};
}