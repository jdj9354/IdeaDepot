//create the namespaces if not already created
var com;
if (!com) {
	com = {};
}
if (!com.local) {
	com.local = {};
}
if (!com.local.SVG) {
	com.local.SVG = {};
}

//library of core SVG functions
//accessed from inside Movable only
com.local.SVG.Lib = function() {

	
	function movePathObject(pathElement, xOffset, yOffset) {
		var segments = pathElement.pathSegList;
		
		for (var i=0; i < segments.numberOfItems; i++) {
			var pathSegment = segments.getItem(i);
			
			switch (pathSegment.pathSegType) {
				case SVGPathSeg.PATHSEG_MOVETO_ABS: {
					pathSegment.x += xOffset;
					pathSegment.y += yOffset;
					break;
				}
				case SVGPathSeg.PATHSEG_LINETO_ABS: {
					pathSegment.x += xOffset;
					pathSegment.y += yOffset;
					break;
				}
				break;
			}
		}
	}
	
	/*e.g. pointIndex=0 is starting, pointIndex=1 is the second point, etc.
		Not used in this example - just another possible library function
	*/
	function getPathPointCoords(pathElement, pointIndex) {
		var segments = pathElement.pathSegList;
		var pathSegment = segments.getItem(pointIndex);
		var startCoords = { x: pathSegment.x, y:pathSegment.y };
		return startCoords;

	}
	
	return {
		MovePathObject: function(pathElement, xOffset, yOffset) { 
			return movePathObject(pathElement, xOffset, yOffset); 
			}
	}
}();

/*class to define a path object that can be moved - just need to attach handlers
to tell it when moving starts, continues, and ends*/
com.local.SVG.Movable = function() {
	var movableElement;
	var parentElement;
	var mousePrevPos = { x: null, y: null};
	var mouseDownOnElement;
	
	
	var init = function(element, parent) {
		movableElement = element;
		parentElement = parent;
	};
		
	var beginMouseDrag = function(e) {
		mouseDownOnElement = true;
		mousePrevPos.x = e.pageX;
		mousePrevPos.y = e.pageY;
	};
	
	var handleMouseMovement = function(e) {
		if (mouseDownOnElement == true) {
			var mouseDelta = { x: e.pageX - mousePrevPos.x, y: e.pageY - mousePrevPos.y};
			com.local.SVG.Lib.MovePathObject(movableElement, mouseDelta.x, mouseDelta.y);
			mousePrevPos.x = e.pageX;
			mousePrevPos.y = e.pageY;
		}
	};
	
	var endMouseDrag = function() {
		mouseDownOnElement = false;
	}
	
	return {
		Initialize: function(element, parent) { init(element, parent); },
		BeginDrag: function(e) { beginMouseDrag(e); },
		MouseMoved: function(e) { handleMouseMovement(e); },
		EndDrag: function() { endMouseDrag(); }
	}
	
}

//UI to test the Movable class
com.local.SVGHandlers = function() {
	var toolBoxRectangle;
	var hostSVGParent;
	
	function attachEventHandlers() {
		//define the object that can be dragged
		toolBoxRectangle = document.getElementById("toolBoxRectangle");
		//specify the region in which dragging should work well
		hostSVGParent = document.getElementById("svgHost");   

		var movableTriangle = new com.local.SVG.Movable;
		movableTriangle.Initialize(toolBoxRectangle, hostSVGParent);
		
		toolBoxRectangle.onmousedown = movableTriangle.BeginDrag;
		
		toolBoxRectangle.onmousemove = movableTriangle.MouseMoved;
		hostSVGParent.onmousemove = movableTriangle.MouseMoved;
		
		toolBoxRectangle.onmouseup = movableTriangle.EndDrag;		
		hostSVGParent.onmouseup = movableTriangle.EndDrag;
		
		/*TODO: -conditional handlers on myParent when multiple children are draggable
				-collision detection?
		*/	
	};
	
	return {
		Initialize: function() { attachEventHandlers(); }
	}
}();

//finally, link all this to the HTML window
