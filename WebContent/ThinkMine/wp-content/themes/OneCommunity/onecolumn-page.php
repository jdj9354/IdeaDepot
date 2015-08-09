<?php
/*
Template Name: Full Width
*/
?>

<script src="/ThinkMineCV/js/ThinkMineLib.js"></script>
<script src="/ThinkMineCV/js/ThinkMineUILib.js"></script>

<script src="/thidparty/gradx-master/lib/js/jquery.js"></script>
<script src="/thidparty/gradx-master/colorpicker/spectrum.js"></script>

<script src="<?php echo esc_attr( get_bloginfo( 'stylesheet_directory', 'display' ) ); ?>/js/EDMHandler.js"></script>

<style type='text/css'>
.maxbutton-1.maxbutton {
position : relative;
text-decoration : none;
display : inline-block;
cursor : default;
border-color : #0f2557;
border-top-left-radius : 0px;
border-top-right-radius : 0px;
border-bottom-left-radius : 0px;
border-bottom-right-radius : 0px;
border-width : 0px;
background: #d6e6f5;
-pie-background: linear-gradient(#d6e6f5 99%, #fff);
background: -webkit-gradient(linear, left top, left bottom, color-stop(99%, #d6e6f5), color-stop(1, #fff));
background: -moz-linear-gradient(#d6e6f5 99%, #fff);
background: -o-linear-gradient(#d6e6f5 99%, #fff);
background: linear-gradient(#d6e6f5 99%, #fff); }

.maxbutton-1.maxbutton:hover {
border-color : #0f2557;
background: #9fcaf2;
-pie-background: linear-gradient(#9fcaf2 99%, #fff);
background: -webkit-gradient(linear, left top, left bottom, color-stop(99%, #9fcaf2), color-stop(1, #fff));
background: -moz-linear-gradient(#9fcaf2 99%, #fff);
background: -o-linear-gradient(#9fcaf2 99%, #fff);
background: linear-gradient(#9fcaf2 99%, #fff); }

.maxbutton-1.maxbutton .mb-text {
font-family : Arial;
font-size : 16px;
font-style : normal;
font-weight : normal;
padding-top : 15px;
padding-right : 25px;
padding-bottom : 15px;
padding-left : 25px;
line-height : 1em;
box-sizing : border-box;
display : block;
color : #3a6163; }

.maxbutton-1.maxbutton:hover .mb-text {
color : #3a6163; }
</style>
<link type="text/css" rel="stylesheet" href="<?php echo esc_attr( get_bloginfo( 'stylesheet_directory', 'display' ) ); ?>/css/toolbar-anim.css"/>

<script>
	var stopPropagationFunc = function(event){event.stopPropagation();};		
	function target_popup(form) {
		var width = screen.width;
		var height = screen.height;
		window.open('', 'formpopup', 'width='+width/2+',height='+height+',resizeable,toolbar,scrollbars,,left='+width/2);
		form.target = 'formpopup';
	}
</script>

<div class="group_div_toolbar" style="background:#d6e6f5; position:absolute; z-index:999999999;"
			onmousedown="ElementDragAndMoveEventHandler.setDragElement(this);" 			
			ontouchstart="ElementDragAndMoveEventHandler.setDragElement(this);"
			>
	<form onmousedown="stopPropagationFunc(event);"
			onmousemove="stopPropagationFunc(event);"
			ontouchstart="stopPropagationFunc(event);"
			ontouchmove="stopPropagationFunc(event);" 
			target="_blank"
			id="url_form" onsubmit="target_popup(this)">
		<input id="url_input" type=url required=""/  onchange="document.getElementById('url_form').action=this.value;"> 
		<button type="submit"></button>
	</form>
	<div id="upper_bar" style="font-family: Arial Black; font-size: 18px; color: white">Tool Bar</div>		
		<div class ="group_div_toolbar_row" id="firstrow" style='display:flex; display:-webkit-flex;'>
			<div class="group_div_toolbar_col"  id="first_row_first_col">
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style="overflow:hidden;">Select Shape</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px;'> 
						<div id="group_div_shape" style="margin: 0 auto; width:225; height:60px"  >
								<div id="div_circleshape" width='50' height='50'  style="float:left;">
									<img src="/ThinkMineCV/res/CircleShape.png" id="CircleShapeImage" width='50' height='50' />
								</div>
								<div id="div_rectangleshape" width='50' height='50'  style="float:left;">
									<img src="/ThinkMineCV/res/RectangleShape.png" id="RectangleShapeImage" width='50' height='50' />
								</div>
								<div id="div_starshape" width='50' height='50' style="float:left;">
									<img src="/ThinkMineCV/res/StarShape.png" id="StarShapeImage" width='50' height='50' />
								</div>
								<div id="div_polygonshape" width='50' height='50'>
									<img src="/ThinkMineCV/res/PolygonShape.png" id="PolygonShapeImage" width='50' height='50' />
								</div>
						</div>
					</div>						
				</div>
			</div>
			<div class="group_div_toolbar_col"  id="first_row_second_col">
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style="overflow:hidden;">Select Contents Type</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px;'  > 
						<div id="group_div_contents" style="margin: 0 auto; width:275; height:60px"  >
								<div id="div_textcontents" width='50' height='50'  style="float:left;">
									<img src="/ThinkMineCV/res/TextContents.png" id="TextContentsImage" width='50' height='50' />
								</div>
								<div id="div_imagecontents" width='50' height='50'  style="float:left;">
									<img src="/ThinkMineCV/res/ImageContents.jpg" id="ImageContentsImage" width='50' height='50' />
								</div>
								<div id="div_moviecontents" width='50' height='50' style="float:left;">
									<img src="/ThinkMineCV/res/MovieContents.png" id="MovieContentsImage" width='50' height='50' />
								</div>
								<div id="div_soundcontents" width='50' height='50' style="float:left;">
									<img src="/ThinkMineCV/res/SoundContents.png" id="SoundContentsImage" width='50' height='50' />
								</div>
								<div id="div_webcontents" width='50' height='50'>
									<img src="/ThinkMineCV/res/WebPreviewContents.png" id="WebPreviewContentsImage" width='50' height='50' />
								</div>
						</div>
					</div>							
				</div>
			</div>
		</div>
		
		<div class ="group_div_toolbar_row" id="second_row" style='display:flex; display:-webkit-flex;'>
			<div class="group_div_toolbar_col"  id="second_row_first_col">
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style="overflow:hidden;">Font Settings</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px;'> 
						<div id="group_div_font_setting" style="margin: 0 auto; width:250; height:75px">
							<button style="background: #d6e6f5; border-width : 0px; cursor : default; width:100;">Font Size : </button>
							<input type="number" id="font-size" value=10></input>
							<button style="background: #d6e6f5; border-width : 0px; cursor : default; width:100;">Font Face : </button>
							<select id="font-face">
								<option value="san-serif">san-serif</option>
								<option value="cursive">cursive</option>
							</select><br>
							<button style="background: #d6e6f5; border-width : 0px; cursor : default; width:100;">Font Weight : </button>
							<input type="number" id="font-weight" value=10></input>
						</div>
					</div>						
				</div>
			</div>		
		</div>
		<div class ="group_div_toolbar_row" id="third_row" style='display:flex; display:-webkit-flex;'>
			<div class="group_div_toolbar_col" id="third_row_first_col" >
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style="overflow:hidden;">Color Settings</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px;'> 			
						<div style=" display:flex; display:-webkit-flex;"> 
							<button style=" display:flex; display:-webkit-flex;background: #d6e6f5; border-width : 0px; cursor : default;">Shape<br>Color</button>
							<div style='display:flex; display:-webkit-flex;'>							
								<div><canvas id='canvas_shapecolor' width=100 height=100 style="border:1px solid #000000;"></canvas></div>
								<div><canvas id='canvas_shapecolor_colorpickerbtn' width=25 height=25 style="border:1px solid #000000;"></canvas><br>
								<canvas id='canvas_shapecolor_gradientpickerbtn' width=25 height=25 style="border:1px solid #000000;"></canvas></div>
							</div>						
							<button style="display:flex; display:-webkit-flex; background: #d6e6f5; border-width : 0px; cursor : default;">Text<br>Color</button>
							<div style='display:flex; display:-webkit-flex;'>							
								<div><canvas id='canvas_textcolor' width=100 height=100 style="border:1px solid #000000;"></canvas></div>
								<div><canvas id='canvas_textcolor_colorpickerbtn' width=25 height=25 style="border:1px solid #000000;"></canvas></div>
							</div>
						</div>
					</div>									
				</div>
			</div>			
		</div>
		<div class ="group_div_toolbar_row" id="fourth_row" style='display:flex; display:-webkit-flex;'>			
			<div class="group_div_toolbar_col" id="fourth_row_first_col" >
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style="overflow:hidden;">Color Picker</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px;'> 				
						<input type='text' id="tm_main_cp" style='position:absolute; top:0px; left:0px; z-index:2;'></input> 								
					</div>									
				</div>
			</div>			
			<div class="group_div_toolbar_col"  id="fourth_row_second_col">
				<div>
					<button class="adj_btn maxbutton-1 maxbutton" style=" overflow:hidden;">Gradient Color Picker</button>
					<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px' > 
						<div id="tm_gradient_cp" style='position:absolute; top:0px; left:0px; z-index:1;'></div>	
						<canvas id="tm_angle_picker" width=50 height=50 style='position:absolute; top:0px; right:0px; z-index:1;'></canvas>
					</div>					
				</div>
			</div>
		</div>
	
			
</div>

<?php get_header(); ?>
	<div id="content">

	<div class="page-title"><?php the_title(); ?></div>
		<?php do_action( 'bp_before_blog_page' );  ?>
		
		<div class="page" id="blog-page" role="main">			
			<div id="tmWorkingArea">
				<a id="btn_add_mindmap" class="maxbutton-1 maxbutton" ><span class='mb-text'>Add MindMap (id : test)</span></a>
				<a id="btn_join_mindmap" class="maxbutton-1 maxbutton" ><span class='mb-text'>Join MindMap (id : test)</span></a>			

				
	
				
				<canvas id="tmCanvas" style="border:1px solid #000000;"></canvas>

							
			</div>			

			<link type="text/css" rel="stylesheet" href="/thidparty/gradx-master/gradX.css" />
			<link type="text/css" rel="stylesheet" href="/thidparty/gradx-master/colorpicker/spectrum.css" />


			<script src="/thidparty/gradx-master/dom-drag.js"></script>
			<script src="/thidparty/gradx-master/colorpicker/spectrum.js"></script>
			
			<script src="/thidparty/gradx-master/gradX.js"></script>
			
			<style>
				#tm_gradient_cp {
					height: 200px;       
				}  
				#tmCanvas { 
					width: 100%; 
				}
			</style>
			
			<script>		
			
				document.addEventListener("mousedown",ElementDragAndMoveEventHandler.dragstart);
				document.addEventListener("mousemove",ElementDragAndMoveEventHandler.drag);
				document.addEventListener("mouseup",ElementDragAndMoveEventHandler.dragend);
				//document.addEventListener("mouseout",ElementDragAndMoveEventHandler.dragend);
				document.addEventListener("touchstart",ElementDragAndMoveEventHandler.touchDragstart);
				document.addEventListener("touchmove",ElementDragAndMoveEventHandler.touchDrag);
				document.addEventListener("touchend",ElementDragAndMoveEventHandler.touchDragend);
				
				$('#tm_main_cp').spectrum({
										move: function(color) {		
											var canvas = document.getElementById("color_picker_canvas_output");
											var ctx = canvas.getContext("2d");
											var colorObj = color.toRgb();
											var colorString = "rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+","+colorObj.a+")"; 
											ctx.fillStyle = colorString;
											ctx.clearRect(0, 0, canvas.width, canvas.height);
											ctx.fillRect(0,0,canvas.width,canvas.height);
										},
										change: function(color) {											
											var canvas = document.getElementById("color_picker_canvas_output");
											var ctx = canvas.getContext("2d");
											var colorObj = color.toRgb();
											var colorString = "rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+","+colorObj.a+")"; 
											ctx.fillStyle = colorString;
											ctx.clearRect(0, 0, canvas.width, canvas.height);
											ctx.fillRect(0,0,canvas.width,canvas.height);
										},
										flat: true,
										showAlpha: true,
										color: "#ffffff",
										clickoutFiresChange: true,
										showInput: false,
										showButtons: false,
								});	
								$("#tm_main_cp").spectrum("disable");
				
				$('#tmCanvas')[0].height = $('#tmCanvas')[0].offsetWidth * 0.8;				

				var spc = $('.sp-container')[0];
				spc.style.position="absolute";
								
				
				var sppc = $('.sp-picker-container')[0];
				sppc.style.background="#d6e6f5"; 
				sppc.style.borderLeft="0px solid #d6e6f5";
				sppc.parentElement.style.border = "0px solid #d6e6f5";
				
				var cpCanvasElement = document.createElement('canvas');
				cpCanvasElement.id="color_picker_canvas_output";
				cpCanvasElement.style.width = 25;
				cpCanvasElement.style.height = 25;
				cpCanvasElement.style.margin = 3;
				cpCanvasElement.style.border = "1px solid #000000";
				//cpCanvasElement.style.borderColor = "#000000";
				
				sppc.insertBefore(cpCanvasElement, sppc.childNodes[0]);		
				sppc.insertBefore(document.createElement('br'), sppc.childNodes[1]);	
				
				var textBtn = document.createElement('button');
				textBtn.innerText = "Recent Colors";
				textBtn.style.background="#d6e6f5"; 
				textBtn.style.border="border-width : 0px";
				textBtn.style.cursor="default";
				sppc.insertBefore(textBtn,sppc.childNodes[2]);
				
				
				var recentColorDivElement = document.createElement('div');
				recentColorDivElement.id = "recent_color_div";
				for(var i=0; i<5; i++){
					var recentCanvasElement = document.createElement('canvas');
					recentCanvasElement.style.width = 25;
					recentCanvasElement.style.height = 25;
					recentCanvasElement.style.border = "1px solid #000000";
					recentColorDivElement.appendChild(recentCanvasElement);
				}
				sppc.insertBefore(recentColorDivElement,sppc.childNodes[3]);
				
			//	sppc.appendChild();					
				
				var cpCanvasCtx = cpCanvasElement.getContext("2d");
				var colorObj =  $("#tm_main_cp").spectrum("get").toRgb();				
				cpCanvasCtx.fillStyle = "rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+","+colorObj.a+")"; 
				cpCanvasCtx.fillRect(0,0,cpCanvasElement.width,cpCanvasElement.height);		
				
				var inputElement = document.createElement('input');
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_red_input";
				sppc.appendChild(inputElement);								
				br = document.createElement('br');
				sppc.appendChild(br);				
				
				inputElement = document.createElement('input');	
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});				
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				sppc.appendChild(inputElement);							
				inputElement.id="color_picker_green_input";
				br = document.createElement('br');
				sppc.appendChild(br);
				
				inputElement = document.createElement('input');
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_blue_input";
				sppc.appendChild(inputElement);	
				br = document.createElement('br');
				sppc.appendChild(br);

				inputElement = document.createElement('input');
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_alpha_input";
				sppc.appendChild(inputElement);		
				br = document.createElement('br');			

				var gfs = document.getElementById("group_div_font_setting");
				for(var i=0; i<gfs.childElementCount; i++){
					gfs.children[i].addEventListener("mousedown",function(event){event.stopPropagation();});
					gfs.children[i].addEventListener("touchstart",function(event){event.stopPropagation();});
					gfs.children[i].addEventListener("mousemove",function(event){event.stopPropagation();});
					gfs.children[i].addEventListener("touchmove",function(event){event.stopPropagation();});
				}
				
				gradX("#tm_gradient_cp",{
					sliders : [{color: "#358CDE",
								position: 50},
								{color: "#D6E6F5",
								position: 100}]
				});
				
				var a = $('.gradx')[0];
				$('.gradx').css("background","#D6E6F5");
				a.style.border="#0px solid #FFFFFF";
				
				
				$('.gradx_container').css("background","#D6E6F5");
				$('.gradx_container')[0].style.border="#1px solid #FFFFFF";
				
				$('#gradx_add_slider').css("background","#9fcaf2");
				
				var topZIndex = $('.group_div_toolbar').css("zIndex");
				topZIndex++;
				$('.cp-default').css("zIndex",topZIndex);
				$('.cp-default').css("position","absolute");


				var maxWidth = -1;
				var totalHeight = 0;
				
				var toolBar = $('.group_div_toolbar');				
				toolBar.addClass('auto_whfit_anim');

				
				var all_cols = $('.group_div_toolbar_col');
				
				var adjButtonWidth = 70;
				var adjButtonHeight = 30;
				
				for(var i=0; i<all_cols.length; i++){					
					
					var group_div_cp_child_maxW = -1;
					var group_div_cp_child_maxH = -1;
					
					var curRowElement = $('#'+all_cols[i].id+'.group_div_toolbar_col >> .element_div');
					
					for(var j=0; j<curRowElement[0].childElementCount; j++){
						if(curRowElement[0].children[j].offsetWidth > group_div_cp_child_maxW)
							group_div_cp_child_maxW = curRowElement[0].children[j].offsetWidth;
						if(curRowElement[0].children[j].offsetHeight > group_div_cp_child_maxH)
							group_div_cp_child_maxH = curRowElement[0].children[j].offsetHeight;	
					}
					
					all_cols[i].style.width = adjButtonWidth + 'px';
					all_cols[i].style.height = adjButtonHeight + 'px';					

					$('#'+all_cols[i].id+'.group_div_toolbar_col').addClass('auto_whfit_anim');						
					
					var curAdjButton = $('#'+all_cols[i].id+'.group_div_toolbar_col>> .adj_btn');
					curAdjButton.addClass('auto_whfit_anim');
					curAdjButton.width(adjButtonWidth+'px');
					curAdjButton.height(adjButtonHeight+'px');
					
					curAdjButton[0].rowContainerId = curAdjButton[0].parentElement.parentElement.id;
					
					curAdjButton[0].adjMaxWidth = (adjButtonWidth > group_div_cp_child_maxW ? adjButtonWidth : group_div_cp_child_maxW) + "px";
					curAdjButton[0].adjMaxHeight = (adjButtonHeight + group_div_cp_child_maxH) + "px";
					
					curAdjButton[0].addEventListener("mousedown",function(event){
						
						if(event.target.isExpanded == undefined)
							event.target.isExpanded = false;
						
												
						var scaleTargetObj = $(".group_div_toolbar >> #" + this.rowContainerId + " >> .element_div");
						var resizeTargetObj = $(".group_div_toolbar >> #" + this.rowContainerId);

						if(this.isExpanded){							
							scaleTargetObj.toggleClass('resizing_div_anim_expand_lt');
							scaleTargetObj.toggleClass('resizing_div_anim_shrink_lt');						
							
							resizeTargetObj.width(this.style.width);
							resizeTargetObj.height(this.style.height);							

							toolBar[0].style.width	 = 'auto';		
							toolBar[0].style.height= 'auto';
						}
						else{							
							var adjMaxWidthNumber = parseInt(this.adjMaxWidth);
							var adjMaxHeightNumber = parseInt(this.adjMaxHeight); 							

							toolBar[0].style.width	 = 'auto';		
							toolBar[0].style.height= 'auto';
							
							scaleTargetObj.toggleClass('resizing_div_anim_shrink_lt');						
							scaleTargetObj.toggleClass('resizing_div_anim_expand_lt');	
							
							resizeTargetObj.width(this.adjMaxWidth);
							resizeTargetObj.height(this.adjMaxHeight);							
						}	
						this.isExpanded = !this.isExpanded;
					});							
				}				
				for(var i=0; i<toolBar[0].childElementCount; i++){					
					if(toolBar[0].children[i].offsetWidth > maxWidth)
						maxWidth = toolBar[0].children[i].offsetWidth;	
					totalHeight += toolBar[0].children[i].offsetHeight;
				}	

				toolBar[0].curWidth = maxWidth;
				toolBar[0].curHeight = totalHeight;
				
				var tmCanvas = $('#tmCanvas');
				
				toolBar.css({
					"width" : maxWidth,
					"height" : totalHeight,
					"left" : tmCanvas.position().left,
					"top" : $('#tmCanvas').offset().top
				});
				
				toolBar[0].screenXOffset = tmCanvas.position().left;
				toolBar[0].screenYOffset = toolBar.offset().top;
				
				var screenOffsetCalFunc = function(event){
					toolBar[0].screenXOffset = toolBar.offset().left - $(window).scrollLeft();
					toolBar[0].screenYOffset = toolBar.offset().top - $(window).scrollTop();
				};
				
				toolBar[0].addEventListener('mousemove',screenOffsetCalFunc);
				toolBar[0].addEventListener('touchmove',screenOffsetCalFunc);
				
				$(window).scroll(function(){
					var newPositionX =  toolBar[0].screenXOffset + $(window).scrollLeft();
					var newPositionY =  toolBar[0].screenYOffset + $(window).scrollTop();		
					//toolBar.css({"top":  newPositionY, "left" : newPositionX});
					toolBar
						.stop()
						.animate({"top":  newPositionY, "left" : newPositionX}, "fastest" );

				});				
				
				var TMCanvas;
				var wrappedEventHandler;			

				
				
				window.onload = function() {		
		
					setUpPaperLib('tmCanvas');
					var drawingCC_Interface = new PaperJS_DrawingCCInterface("PaperJS",'tmCanvas');			

					TMCanvas = new ThinkMineCanvas(drawingCC_Interface);
					
					
					wrappedEventHandler = new WrappedPaperJSEventHandler();
					wrappedEventHandler.setOnMouseDown(function(event){					
				
															wrappedEventHandler.dragCount = 0;
															TMCanvas.onMouseDownInterface(event.point.x,event.point.y,0);
														});
					wrappedEventHandler.setOnMouseUp(function(event){					
				
															TMCanvas.onMouseUpInterface(event.point.x,event.point.y,0);
															
														});
					wrappedEventHandler.setOnMouseDrag(function(event){

															wrappedEventHandler.dragCount++;
															
															if(wrappedEventHandler.dragCount>1)
																TMCanvas.onMouseDragInterface(event.point.x,event.point.y,0);
																			
																
																
														});
					wrappedEventHandler.setOnMouseMove(function(event){
															TMCanvas.onMouseMoveInterface(event.point.x,event.point.y,0);
															
														});
					
					ThinkMine.Lib.ExternalUI.SpectrumColorPicker.attach('tm_main_cp',TMCanvas);												
					ThinkMine.Lib.ExternalUI.CPRecentColor.attach("recent_color_div","tm_main_cp");
					
					ThinkMine.Lib.ExternalUI.ColorPickerRedInput.attach("color_picker_red_input",'tm_main_cp');
					ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.attach("color_picker_green_input",'tm_main_cp');
					ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.attach("color_picker_blue_input",'tm_main_cp');
					ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.attach("color_picker_alpha_input",'tm_main_cp');					
					
					
					
					ThinkMine.Lib.ExternalUI.GradientPicker.attach("tm_gradient_cp",TMCanvas);									
							
					ThinkMine.Lib.ExternalUI.ShapeGradientCanvas.attach("canvas_shapecolor_gradientpickerbtn");					
					ThinkMine.Lib.ExternalUI.ShapeColorCPCanvas.attach("canvas_shapecolor_colorpickerbtn");											
					ThinkMine.Lib.ExternalUI.ShapeFillingOutCanvas.attach("canvas_shapecolor",TMCanvas);		
					ThinkMine.Lib.ExternalUI.ShapeFillingOutCanvas.changeCanvasColor({fFillType : FillingTypeEnum.SimpleColor,
																							r   : 159,
																							g 	: 202,
																							b	: 242,
																							a	: 1
																						});
					
					ThinkMine.Lib.ExternalUI.TextColorCPCanvas.attach("canvas_textcolor_colorpickerbtn");					
					ThinkMine.Lib.ExternalUI.TextFillingOutCanvas.attach("canvas_textcolor",TMCanvas);
					ThinkMine.Lib.ExternalUI.TextFillingOutCanvas.changeCanvasColor({fFillType : FillingTypeEnum.SimpleColor,
																		r   : 0,
																		g 	: 0,
																		b	: 0,
																		a	: 1
																	});
					
					var tmap = document.getElementById("tm_angle_picker");
					ThinkMine.Lib.ExternalUI.AnglePicker.attach("tm_angle_picker",TMCanvas);
					
					var tmapCtx = tmap.getContext("2d");
					var angleImageObj = new Image();
					angleImageObj.onload = function() {
						tmapCtx.drawImage(angleImageObj, 0, 0,50,50);
					};
					angleImageObj.src = "/ThinkMineCV/res/angle.png";
					tmap.addEventListener("mousedown",function(ev){
						this.isDown = true;
						this.angle =0;
						ev.stopPropagation();
					});
					tmap.addEventListener("mouseup",function(ev){
						this.isDown = false;
						ev.stopPropagation();
					});
					tmap.addEventListener("mouseout",function(ev){
						this.isDown = false;
					});
					tmap.addEventListener("mousemove",function(ev){
						if(this.isDown == undefined)
							return;
						if(!this.isDown)
							return;		

						var angle = Math.atan2(ev.offsetY-25,ev.offsetX-25)+Math.PI/2;
						var notiAngle = angle*(180/Math.PI);
						notiAngle = notiAngle < 0? notiAngle+360:notiAngle;
						tmap.notifyAngleChange(notiAngle);
						
						tmapCtx.drawRotatedImage(angleImageObj,25,25,angle);
						ev.stopPropagation();
					});	
					tmapCtx.drawRotatedImage = function(image, x, y, angle)
												{ 
													this.save(); 
													this.translate(x, y);
													this.rotate(angle);
													this.drawImage(image,-25, -25,50,50);   
													this.restore(); 
												};
					
												
							
					ThinkMine.Lib.ExternalUI.CircleImageButton.attach("CircleShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.RectangleImageButton.attach("RectangleShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.StarImageButton.attach("StarShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.PolygonImageButton.attach("PolygonShapeImage",TMCanvas);
					
					ThinkMine.Lib.ExternalUI.TextContentsImageButton.attach("div_textcontents",TMCanvas);
					ThinkMine.Lib.ExternalUI.ImageContentsImageButton.attach("div_imagecontents",TMCanvas);
					ThinkMine.Lib.ExternalUI.MovieContentsImageButton.attach("div_moviecontents",TMCanvas);
					ThinkMine.Lib.ExternalUI.SoundContentsImageButton.attach("div_soundcontents",TMCanvas);
					ThinkMine.Lib.ExternalUI.WebPreviewContentsImageButton.attach("div_webcontents",TMCanvas);
					
					
					
					
					
					initPaperJSMindMap(1000,600,wrappedEventHandler);
					

					var ua = new UserAuth("JDJ9354");
					ua.getAuthentication("JDJ9354","test");
					
					var lastDownTarget, canvas;

					
					canvas = document.getElementById('tmCanvas');
					
					
					
					document.addEventListener('mousedown', function(event) {
						lastDownTarget = event.target;			   
					}, false);

						
					document.addEventListener('paste', function(event) {			        
						if(lastDownTarget == canvas) {
							TMCanvas.onPasteInterface(event);   
						}			    
					}, false);					
					

					
				$('#btn_add_mindmap').click(function() {
					console.log("new mind map");
					TMCanvas.initWithNewMindMap(ua);
				});
				
				
				$('#btn_add_mindmap').bind('touchstart',function(e) {
					console.log("new mind map");
					TMCanvas.initWithNewMindMap(ua);
				});
				
				$('#btn_join_mindmap').click(function() {
					console.log("join mind map");
					TMCanvas.initWithMindMap("test",ua);
				});
				
				$('#btn_join_mindmap').bind('touchstart',function(e) {
					console.log("join mind map");
					alert("aaa");
					TMCanvas.initWithMindMap("test",ua);
				});

				
			}	
				
			</script>
			
		
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>


				<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<div class="entry">

						<?php the_content( __('Read more','OneCommunity') ); ?>

						<?php wp_link_pages( array( 'before' => '<div class="page-link"><p>' . __( 'Pages: ', 'OneCommunity' ), 'after' => '</p></div>', 'next_or_number' => 'number' ) ); ?>

					</div>

				</div>

			<?php endwhile; endif; ?>

		</div><!-- .page -->

		<?php do_action( 'bp_after_blog_page' ); ?>

	<?php comments_template(); ?>

	</div><!-- #content -->

<?php get_footer(); ?>