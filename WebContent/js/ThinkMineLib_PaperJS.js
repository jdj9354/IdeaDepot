



function addJavascript(jsname) {
	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);
}

addJavascript("js/paper.js");

//document.write('<script type="text/javascript" src="./js/ThinkMineLib.js"></script>');
//document.write('<script type="text/javascript" src="./js/paper.js"></script>');


//------------------- MindMap Section--------------------------------------

function PaperJSMindMap(CanvasName) {

	SetUpPaperLib(CanvasName);
	this.layer = new paper.Layer();	
	this.layer.MindObjects = this.MindObjects;
	this.layer.SelectedObjects = this.SelectedObject;
	this.layer.MaxRelDistance = this.MaxRelDistance;
	
	var CreatingCircle = new paper.Path.Circle(new paper.Point(100,70), 50);
	CreatingCircle.fillColor = 'black';	
	
	var CreatingRectangle = new paper.Rectangle(new paper.Point(33,150), new paper.Size(135,100));
	var CreatingEllipse = new paper.Shape.Ellipse(CreatingRectangle);
	CreatingEllipse.fillColor = 'black';	
	
	var DeletingCircle = new paper.Path.Circle(new paper.Point(500,500), 50);
	DeletingCircle.fillColor = 'black';	
	
	this.onMouseDownInterface = function(event){
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		this.SelectedObject = null;
		if(CreatingCircle.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(new CircleShape(),new PictureContents("http://cfile22.uf.tistory.com/image/2432574E5215F11118F817"),x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}
		else if(CreatingEllipse.contains(new paper.Point(x,y))){
			var newMindObject = new MindObject(new EllipseShape(),new TextContents("ThinkTest"),x,y,0);		
			newMindObject.DrawMindObject();
			this.MindObjects.push(newMindObject);
			
			this.SelectedObject = newMindObject;
			
			for(i=0; i< this.MindObjects.length; i++){
				this.SelectedObject.Shape.position;
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
			}
			return;
		}	
		else {
			for(i=0; i< this.MindObjects.length; i++){
				if(this.MindObjects[i].Shape.DrawingObject.contains(event.point)){
					this.SelectedObject = this.MindObjects[i];
					return;
				}
			}
		}

	};	
	this.onMouseUpInterface = function(event){		
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		if(DeletingCircle.contains(new paper.Point(x,y)) && this.SelectedObject !=null){
			for(i=0; i<this.MindObjects.length; i++){
				if(this.MindObjects[i] == this.SelectedObject){
					this.MindObjects.splice(i,1);
					break;
				}
			}
			this.SelectedObject.RemoveMindObject();
			this.SelectedObject = null;
		}
		else{
			this.SelectedObject = null;
		}
	};
	
	this.onMouseDragInterface = function(event){
		var x = event.point.x;
		var y = event.point.y;
		var z = 0;
		console.log(event.point.x);
		if(this.SelectedObject == null)
			return;
		else {
			this.SelectedObject.MoveMindObject(x,y,z);
			
			for(i=0; i<this.MindObjects.length; i++){
				var Distance = this.SelectedObject.Shape.DrawingObject.position.getDistance(this.MindObjects[i].Shape.DrawingObject.position);
				if(Distance !=0 && Distance <= this.MaxRelDistance){
					this.SelectedObject.ConnectTo(this.MindObjects[i], "SimplePathEdge");
				}
				else if(Distance !=0 && Distance > this.MaxRelDistance){
					this.SelectedObject.DisconnectFrom(this.MindObjects[i])
				}
			}
			
		}
	};

	this.layer.on({mousedown : this.onMouseDownInterface,mouseup : this.onMouseUpInterface,mousedrag : this.onMouseDragInterface});

	
}

PaperJSMindMap.prototype = new MindMap();
PaperJSMindMap.prototype.constructor = PaperJSMindMap;





//------------------- Edge Section------------------------------------

function SimplePathEdge(FirstMindObject,SecondMindObject){
	this.FirstMindObject = FirstMindObject;
	this.SecondMindObject = SecondMindObject;
	this.DrawEdge = function(){
		if(this.DrawingObject == null){
			this.DrawingObject = new paper.Path.Line(new paper.Point(FirstMindObject.x,FirstMindObject.y),
												new paper.Point(SecondMindObject.x,SecondMindObject.y));
			this.DrawingObject.strokeColor = this.EdgeColor;
			this.DrawingObject.sendToBack();
		}
		else{
			;
		}
		
	};
	this.EraseEdge = function(){
		this.DrawingObject.remove();
		
	};
	this.MoveFirstPoint = function(x,y,z){		
		this.DrawingObject.firstSegment.point = new paper.Point(x,y,z);
	};
	this.MoveSecondPoint = function(x,y,z){
		this.DrawingObject.lastSegment.point = new paper.Point(x,y,z);
	};
	this.ChangeColor = function(Color){		
		this.EdgeColor = Color;
		this.DrawingObject.strokeColor = this.EdgeColor; 
	};
}
SimplePathEdge.prototype = new Edge(null,null);
SimplePathEdge.constructor = SimplePathEdge;


//------------------- Shape Section------------------------------------



function CircleShape (){	
	this.DrawShape = function(x,y,z){
		if(this.DrawingObject == null){
			var Position = new paper.Point(x,y);
			this.DrawingObject = new paper.Path.Circle(Position,50);		
			this.DrawingObject.fillColor = this.Color;
		}
		else{
			;
		}
	};	
	this.EraseShape = function(){
		this.DrawingObject.remove();
	};
	this.MoveShape = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		this.DrawingObject.position = newPoint;
	}
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.DrawingObject.fillColor = this.Color;
	};
}

CircleShape.prototype = new Shape();
CircleShape.prototype.constructor = CircleShape;


function EllipseShape (){	
	this.DrawShape = function(x,y,z){
		if(this.DrawingObject == null){
			var RectangleOutline = new paper.Rectangle(new paper.Point(x-67.5,y-50), new paper.Size(135,100));
			this.DrawingObject = new paper.Shape.Ellipse(RectangleOutline);		
			this.DrawingObject.fillColor = this.Color;
		}
		else{
			;
		}
	};	
	this.EraseShape = function(){
		this.DrawingObject.remove();
	};
	this.MoveShape = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		this.DrawingObject.position = newPoint;
	}
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.DrawingObject.fillColor = this.Color;
	};
}

EllipseShape.prototype = new Shape();
EllipseShape.prototype.constructor = EllipseShape;










//------------------- Contents Section------------------------------------


function TextContents(Text) {
	this.Text = Text;
	this.DrawContents = function(x,y,z){
		if(this.ContentsObject == null){
			this.ContentsObject = new paper.PointText(x,y);
			this.ContentsObject.justification = 'center';
			this.ContentsObject.fillColor = this.Color;
			this.ContentsObject.content = this.Text;
		}
		else{
			;
		}
	};
	this.EraseContents = function(){
		this.ContentsObject.remove();
	};
	this.MoveContents = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		
		this.ContentsObject.position = newPoint;
	};
	this.ChangeContents = function(toValue){
		this.Text = toValue;
		this.ContentsObject.content = this.Text;
	};
	this.ChangeColor = function(Color){
		this.Color = Color;
		this.ContentsObject.fillColor = this.Color;
	};
}

TextContents.prototype = new Contents();
TextContents.prototype.constructor = TextContents;




function PictureContents(PictureURI){
	this.PictureURI = PictureURI;
	this.DrawContents = function(x,y,z){
		this.ContentsObject = new paper.Raster(this.PictureURI);
		this.ContentsObject.position = new paper.Point(x,y);
		this.ContentsObject.scale(0.03);
	};
	this.EraseContents = function() {
		this.ContentsObject.remove();
	};
	this.MoveContents = function(x,y,z){
		var newPoint = new paper.Point(x,y);
		
		this.ContentsObject.position = newPoint;
	};
	this.ChangeContents = function(toValue){
		this.PictureURI = toValue;
		this.ContentsObject.source = toValue;
	};
	this.ChangeColor = function(Color){
		
	};
}
PictureContents.prototype = new Contents();
PictureContents.prototype.constructor = PictureContents;