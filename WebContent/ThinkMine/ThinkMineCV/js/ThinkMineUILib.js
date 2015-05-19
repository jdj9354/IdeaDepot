if(!window.ThinkMine)
	ThinkMine = {};
if(!ThinkMine.Lib)
	ThinkMine.Lib = {};
if(!ThinkMine.Lib.ExternalUI)
	ThinkMine.Lib.ExternalUI = {};
	

	
ThinkMine.Lib.ExternalUI.ColorPickerCanvas = new function(undefined){
	var fCanvasName = null;
	var fTmCanvas = null;
	
	var fMousedown = null;
	var fMousemove = null;
	var fMouseup = null;
	
	var fRed = 0;
	var fGreen = 0;
	var fBlue = 0;
	
	this.attach = function(canvasName,tmCanvas) {
		if(fCanvasName != null){
			console.log("ColorPickerCanvas was already attached");
			return;
			/*var prevCanvas = document.getElementById(fCanvasName);
			prevCanvas.removeEventListener('mousedown',mousedown);
			prevCanvas.removeEventListener('mouseup',mouseup);
			prevCanvas.removeEventListener('mousemove',mousemove);*/
			
		}
		
		
		fCanvasName = canvasName;
		fTmCanvas = tmCanvas;
		
		var padding = 10;
		var canvas = document.getElementById(fCanvasName);
		if(canvas == null || canvas == undefined){
			console.log("There is no such canvas element " + fCanvasName);
			return;
		}
			
		var context = canvas.getContext('2d');
		var mouseDown = false;
		
		var imageObj = new Image();
		imageObj.onload = function() {
			context.strokeStyle = '#444';
			context.lineWidth = 2;
			
			fMousedown = function(evt) {
				mouseDown = true;
				
				fMousemove(evt);
			};

			canvas.addEventListener('mousedown', fMousedown, false);
			
			fMouseup = function() {
				mouseDown = false;
			};
			
			canvas.addEventListener('mouseup', fMouseup, false);
			
			fMousemove = function(evt) {
				var mousePos = getMousePos(canvas, evt);
				var color = undefined;

				if(mouseDown && mousePos !== null && mousePos.x > padding && mousePos.x < padding + imageObj.width && mousePos.y > padding && mousePos.y < padding + imageObj.height) {

					// color picker image is 256x256 and is offset by 10px
					// from top and bottom
					var imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
					var data = imageData.data;
					var x = Math.floor(mousePos.x - padding);
					var y = Math.floor(mousePos.y - padding);
					fRed = data[((imageObj.width * y) + x) * 4];
					fGreen = data[((imageObj.width * y) + x) * 4 + 1];
					fBlue = data[((imageObj.width * y) + x) * 4 + 2];
					var color = 'rgb(' + fRed + ',' + fGreen + ',' + fBlue + ')';
					
					ThinkMine.Lib.ExternalUI.ColorPickerRedInput.setRedValue(fRed);
					ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.setGreenValue(fGreen);
					ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.setBlueValue(fBlue);
					
					var fRedString  = fRed.toString(16);
					var fGreenString  = fGreen.toString(16);
					var fBlueString  = fBlue.toString(16);					
					
					fTmCanvas.setShapeColor("#"+(fRedString.length == 1? "0"+fRedString : fRedString)
										+(fGreenString.length == 1? "0"+fGreenString : fGreenString)
										+(fBlueString.length == 1? "0"+fBlueString : fBlueString));				
					
					
					//console.log(color);
					context.clearRect(0,0,canvas.width,canvas.height);
					
					context.drawImage(imageObj, padding, padding);
					drawColorSquare(canvas, color, imageObj);
					
					context.beginPath();
					context.arc(x + padding, y + padding, 5, 0, 2 * Math.PI, false);
					context.lineWidth = 3;
					context.strokeStyle = '#000000';
					context.stroke();
				}
			};
			
			canvas.addEventListener('mousemove', fMousemove, false);

			context.drawImage(imageObj, padding, padding);
			drawColorSquare(canvas, 'white', imageObj);
		};		
		imageObj.src = '/ThinkMineCV/res/color-picker.png'			


		
		
		
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
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}
	function drawColorSquare(canvas, color, imageObj) {
		var colorSquareSize = 100;
		var padding = 10;
		var context = canvas.getContext('2d');
		var squareX = (canvas.width - colorSquareSize + imageObj.width) / 2;
		var squareY = (canvas.height - colorSquareSize) / 2;

		context.beginPath();
		context.fillStyle = color;
		context.fillRect(squareX, squareY, colorSquareSize, colorSquareSize);
		context.strokeRect(squareX, squareY, colorSquareSize, colorSquareSize);
	}		
}
ThinkMine.Lib.ExternalUI.ColorPickerRedInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	this.attach = function(inputTextName) {
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
		fInputElement.onkeyup = preventLargerThan255;
		
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
}

ThinkMine.Lib.ExternalUI.ColorPickerGreenInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	this.attach = function(inputTextName) {
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
		fInputElement.onkeyup = preventLargerThan255;
		
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
}

ThinkMine.Lib.ExternalUI.ColorPickerBlueInput = new function(undefined){
	var fInputTextName = null;
	var fInputElement = null;
	this.attach = function(inputTextName) {
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
		fInputElement.onkeyup = preventLargerThan255;
		
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
