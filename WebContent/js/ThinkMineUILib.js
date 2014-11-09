if(!window.ThinkMine)
	ThinkMine = {};
if(!ThinkMine.Lib)
	ThinkMine.Lib = {};
if(!ThinkMine.Lib.ExternalUI)
	ThinkMine.Lib.ExternalUI = {};
	

	
ThinkMine.Lib.ExternalUI.ColorPickerCanvas = new function(undefined){
	var fCanvasName = null;
	var mousedown = null;
	var mousemove = null;
	var mouseup = null;
	
	var red = 0;
	var green = 0;
	var blue = 0;
	
	this.attach = function(canvasName) {
		if(fCanvasName != null){
			console.log("ColorPickerCanvas was already attached");
			return;
			/*var prevCanvas = document.getElementById(fCanvasName);
			prevCanvas.removeEventListener('mousedown',mousedown);
			prevCanvas.removeEventListener('mouseup',mouseup);
			prevCanvas.removeEventListener('mousemove',mousemove);*/
			
		}
		
		
		fCanvasName = canvasName;
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
			
			mousedown = function(evt) {
				mouseDown = true;
				
				mousemove(evt);
			};

			canvas.addEventListener('mousedown', mousedown, false);
			
			mouseup = function() {
				mouseDown = false;
			};
			
			canvas.addEventListener('mouseup', mouseup, false);
			
			mousemove = function(evt) {
				var mousePos = getMousePos(canvas, evt);
				var color = undefined;

				if(mouseDown && mousePos !== null && mousePos.x > padding && mousePos.x < padding + imageObj.width && mousePos.y > padding && mousePos.y < padding + imageObj.height) {

					// color picker image is 256x256 and is offset by 10px
					// from top and bottom
					var imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
					var data = imageData.data;
					var x = Math.floor(mousePos.x - padding);
					var y = Math.floor(mousePos.y - padding);
					red = data[((imageObj.width * y) + x) * 4];
					green = data[((imageObj.width * y) + x) * 4 + 1];
					blue = data[((imageObj.width * y) + x) * 4 + 2];
					var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
					
					ThinkMine.Lib.ExternalUI.ColorPickerRedInput.setRedValue(red);
					ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.setGreenValue(green);
					ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.setBlueValue(blue);
					//console.log(red + " " + x + " " + y + " " + imageObj.width + " " + evt.clientX + " " + evt.clientY);
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
			
			canvas.addEventListener('mousemove', mousemove, false);

			context.drawImage(imageObj, padding, padding);
			drawColorSquare(canvas, 'white', imageObj);
		};		
		imageObj.src = 'color-picker.png'			


		
		
		
	};
	this.getRedValue = function(){
		return red;
	};
	this.getGreenValue = function(){
		return green;
	};
	this.getBlueValue = function(){
		return blue;
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
	var inputElement = null;
	this.attach = function(inputTextName) {
		if(fInputTextName != null){
			inputElement.onkeypress = null;
			inputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		inputElement = document.getElementById(fInputTextName);
		
		if(inputElement == null || inputElement == undefined){
			console.log("There is no such inputElement element " + fInputTextName);
			return;
		}
		inputElement.onkeypress = validateNumber;
		inputElement.onkeyup = preventLargerThan255;
		
	};
	this.setRedValue = function(value){
		if(inputElement == null || inputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			inputElement.value = value;
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
	var inputElement = null;
	this.attach = function(inputTextName) {
		if(fInputTextName != null){
			inputElement.onkeypress = null;
			inputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		inputElement = document.getElementById(fInputTextName);
		
		if(inputElement == null || inputElement == undefined){
			console.log("There is no such inputElement element " + fInputTextName);
			return;
		}
		inputElement.onkeypress = validateNumber;
		inputElement.onkeyup = preventLargerThan255;
		
	};
	this.setGreenValue = function(value){
		if(inputElement == null || inputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			inputElement.value = value;
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
	var inputElement = null;
	this.attach = function(inputTextName) {
		if(fInputTextName != null){
			inputElement.onkeypress = null;
			inputElement.onkeyup = null;
		}
		
		fInputTextName = inputTextName;
		
		inputElement = document.getElementById(fInputTextName);
		
		if(inputElement == null || inputElement == undefined){
			console.log("There is no such inputElement element " + fInputTextName);
			return;
		}
		inputElement.onkeypress = validateNumber;
		inputElement.onkeyup = preventLargerThan255;
		
	};
	this.setBlueValue = function(value){
		if(inputElement == null || inputElement == undefined)
			return;
		if(isNaN(value))
			return;
		else{
			if(value <0 || value >255)
				return;
			inputElement.value = value;
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
