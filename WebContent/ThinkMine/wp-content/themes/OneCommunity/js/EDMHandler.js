ElementDragAndMoveEventHandler = new function(undefined){
		this.dragstart = function (target, event) {		
	//		event.preventDefault();
			 var style = window.getComputedStyle(target, null);
			if(target.relativeCoord != undefined)
				delete target.relativeCoord;
			target.relativeCoord = {x : event.pageX - parseInt((style.getPropertyValue("left"))), y : event.pageY - parseInt((style.getPropertyValue("top")))};				
		};
		
		this.drag = function(target, event){			
			event.preventDefault();
			if(target.relativeCoord == undefined)
				return;						
			target.style.left = event.pageX - target.relativeCoord.x + "px";
			target.style.top = event.pageY - target.relativeCoord.y + "px";		
		}
		this.dragend = function(target,event) {    	
			event.preventDefault();
			delete target.relativeCoord;			
		};		
		
		this.touchDragstart = function(target, event) {		
	//		event.preventDefault();
			 var style = window.getComputedStyle(target, null);
			if(target.relativeCoord != undefined)
				delete target.relativeCoord;

			target.relativeCoord = {x :  event.touches.item(0).pageX - parseInt((style.getPropertyValue("left"))), y :  event.touches.item(0).pageY - parseInt((style.getPropertyValue("top")))};				
		};
		this.touchDrag = function(target, event){			
			event.preventDefault();
			if(target.relativeCoord == undefined)
				return;						
			target.style.left =  event.touches.item(0).pageX - target.relativeCoord.x + "px";
			target.style.top =  event.touches.item(0).pageY - target.relativeCoord.y + "px";		
		}
		this.touchDragend = function(target,event) {    	
			//event.preventDefault();
			delete target.relativeCoord;		
		};	
}