ElementDragAndMoveEventHandler = new function(undefined){
		var curDragElement = null;
		var relativeCoord = null;
		this.setDragElement = function(elem){
			curDragElement = elem;
		}
		this.dragstart = function (event) {		
			event.preventDefault();			
			 var style = window.getComputedStyle(curDragElement, null);			 
			relativeCoord = {x : event.pageX - parseInt((style.getPropertyValue("left"))), y : event.pageY - parseInt((style.getPropertyValue("top")))};				
		};
		
		this.drag = function(event){			
			event.preventDefault();

			if(relativeCoord == null || curDragElement == null)
				return;						
			curDragElement.style.left = event.pageX - relativeCoord.x + "px";
			curDragElement.style.top = event.pageY - relativeCoord.y + "px";		
		}
		this.dragend = function(event) {    	
			event.preventDefault();

			curDragElement = null;
			relativeCoord = null;
		};		
		
		this.touchDragstart = function(event) {		
		
	//		event.preventDefault();			
			 var style = window.getComputedStyle(curDragElement, null);			 
			relativeCoord = {x :  event.touches.item(0).pageX - parseInt((style.getPropertyValue("left"))), y :  event.touches.item(0).pageY - parseInt((style.getPropertyValue("top")))};	
		};
		this.touchDrag = function(event){			
		//	

			if(relativeCoord == null || curDragElement == null)
				return;						
			
			event.preventDefault();
			curDragElement.style.left =  event.touches.item(0).pageX - relativeCoord.x + "px";
			curDragElement.style.top =  event.touches.item(0).pageY - relativeCoord.y + "px";			
		}
		this.touchDragend = function(event) {    	
			//event.preventDefault();

			curDragElement = null;
			relativeCoord = null;	
		};	
}