<?php
/*
Template Name: Full Width
*/
?>

<script src="/ThinkMineCV/js/ThinkMineLib.js"></script>
<script src="/ThinkMineCV/js/ThinkMineUILib.js"></script>

<script src="/thidparty/gradx-master/lib/js/jquery.js"></script>
<script src="/thidparty/gradx-master/colorpicker/js/colorpicker.js"></script>

<script src="<?php echo esc_attr( get_bloginfo( 'stylesheet_directory', 'display' ) ); ?>/js/EDMHandler.js"></script>

<style type='text/css'>
.maxbutton-1.maxbutton {
	position : relative;
	text-decoration : none;
	display : inline-block;
	cursor : default;
	width : 158px;
	border-color : #eb0316;
	border-top-left-radius : 4px;
	border-top-right-radius : 4px;
	border-bottom-left-radius : 4px;
	border-bottom-right-radius : 4px;
	border-style : double;
	border-width : 1px;
	background: #f70000;
	-pie-background: linear-gradient(#f70000 45%, #b01515);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(45%, #f70000), color-stop(1, #b01515));
	background: -moz-linear-gradient(#f70000 45%, #b01515);
	background: -o-linear-gradient(#f70000 45%, #b01515);
	background: linear-gradient(#f70000 45%, #b01515);
	-webkit-box-shadow: 0px 0px 2px #333;
	-moz-box-shadow: 0px 0px 2px #333;
	box-shadow: 0px 0px 2px #333; 
}

.maxbutton-1.maxbutton:hover {
	border-color : #eb0316;
	background: #b01515;
	-pie-background: linear-gradient(#b01515 45%, #f70000);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(45%, #b01515), color-stop(1, #f70000));
	background: -moz-linear-gradient(#b01515 45%, #f70000);
	background: -o-linear-gradient(#b01515 45%, #f70000);
	background: linear-gradient(#b01515 45%, #f70000);
	-webkit-box-shadow: 0px 0px 2px #333;
	-moz-box-shadow: 0px 0px 2px #333;
	box-shadow: 0px 0px 2px #333; 
}

.maxbutton-1.maxbutton .mb-text {
	font-family : Verdana;
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
	color : #fff; 
}

.maxbutton-1.maxbutton:hover .mb-text {
	color : #fff; 
}  

</style>
<link type="text/css" rel="stylesheet" href="<?php echo esc_attr( get_bloginfo( 'stylesheet_directory', 'display' ) ); ?>/css/toolbar-anim.css"/>

<div class="group_div_toolbar" style="border:1px solid #000000; position:absolute; top:0px; left:0px;"
			onmousedown="ElementDragAndMoveEventHandler.dragstart(this, event)" 
			onmousemove = "ElementDragAndMoveEventHandler.drag(this, event);" 
			onmouseup="ElementDragAndMoveEventHandler.dragend(this, event);" 
			ontouchstart="ElementDragAndMoveEventHandler.touchDragstart(this, event);" 
			ontouchmove="ElementDragAndMoveEventHandler.touchDrag(this, event);" 
			ontouchend="ElementDragAndMoveEventHandler.touchDragend(this, event);">
	<div class ="group_div_toolbar_row" id="first_row" style='display:flex;'>
		<div class="group_div_toolbar_col" id="first_row_first_col" >
			<div style='position:absolute; '>
				<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px; border:1px solid #000000; position:absolute' > 				
					<div id="tm_main_cp" style='position:absolute; top:0px; left:0px; z-index:2;'></div> 									
				</div>			
				<button class="adj_btn" style="border:1px solid #000000; position:absolute; overflow:hidden;">Color Picker</button>			
			</div>
		</div>
		<div class="group_div_toolbar_col"  id="first_row_second_col">
			<div style='position:absolute;'>
				<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px; border:1px solid #000000; position:absolute' > 
					<div id="tm_gradient_cp" style='position:absolute; top:0px; left:0px; z-index:1;'></div>	
				</div>			
				<button class="adj_btn" style="border:1px solid #000000; position:absolute; overflow:hidden;">Gradient Color Picker</button>
			</div>
		</div>
	</div>
	<div class ="group_div_toolbar_row" id="second_row" style='display:flex;'>
		<div class="group_div_toolbar_col"  id="second_row_first_col">
			<div style='position:absolute;'>
				<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px; border:1px solid #000000; position:absolute'  > 
					<div id="group_div_shape" style="margin: 0 auto; width:200; height:200px"  >
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
				<button class="adj_btn" style="border:1px solid #000000; position:absolute; overflow:hidden;">Select Shape</button>
			</div>
		</div>
		<div class="group_div_toolbar_col"  id="second_row_second_col">
			<div style='position:absolute;'>
				<div class="element_div resizing_div_anim_shrink_lt" draggable="false" style='top:0px; left:0px; border:1px solid #000000; position:absolute'  > 
					<div id="group_div_contents" style="margin: 0 auto; width:250; height:250px"  >
							<div id="div_textcontents" width='50' height='50'  style="float:left;">
								<img src="/ThinkMineCV/res/TextContents.png" id="TextContentsImage" width='50' height='50' />
							</div>
							<div id="div_imagecontents" width='50' height='50'  style="float:left;">
								<img src="/ThinkMineCV/res/ImageContents.jpg" id="ImageContentsImage" width='50' height='50' />
							</div>
							<div id="moviecontents" width='50' height='50' style="float:left;">
								<img src="/ThinkMineCV/res/MovieContents.png" id="MovieContentsImage" width='50' height='50' />
							</div>
							<div id="soundcontents" width='50' height='50'>
								<img src="/ThinkMineCV/res/SoundContents.png" id="SoundContentsImage" width='50' height='50' />
							</div>
							<div id="webcontents" width='50' height='50'>
								<img src="/ThinkMineCV/res/WebPreviewContents.png" id="WebPreviewContentsImage" width='50' height='50' />
							</div>
					</div>
				</div>			
				<button class="adj_btn" style="border:1px solid #000000; position:absolute; overflow:hidden;">Select Contents Type</button>
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
			<link type="text/css" rel="stylesheet" href="/thidparty/gradx-master/colorpicker/css/colorpicker.css" />


			<script src="/thidparty/gradx-master/dom-drag.js"></script>
			<script src="/thidparty/gradx-master/colorpicker/js/colorpicker.js"></script>
			
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
				$('#tm_main_cp').spectrum({
					move: function(color) {
						var rgb = color.toRgb();
						ThinkMine.Lib.ExternalUI.ColorPickerRedInput.setRedValue(rgb.r);
						ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.setGreenValue(rgb.g);
						ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.setBlueValue(rgb.b);
						ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.setAlphaValue(rgb.a);
					},
					change: function() {
						var a = 3;
					},
					flat: true,
					showAlpha: true,
					color: "#ffffff",
					clickoutFiresChange: true,
					showInput: false,
					showButtons: false
				});

				
				
				$('#tmCanvas')[0].height = $('#tmCanvas')[0].offsetWidth * 0.8;				

				var spc = $('.sp-container')[0];
				spc.style.position="absolute";
				
				var sppc = $('.sp-picker-container')[0];
				
				var inputElement = document.createElement('input');
				inputElement.value = 255;
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_red_input";
				sppc.appendChild(inputElement);				
				var br = document.createElement('br');
				sppc.appendChild(br);
				
				inputElement = document.createElement('input');	
				inputElement.value = 255;			
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});				
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				sppc.appendChild(inputElement);							
				inputElement.id="color_picker_green_input";
				br = document.createElement('br');
				sppc.appendChild(br);
				
				inputElement = document.createElement('input');
				inputElement.value = 255;
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_blue_input";
				sppc.appendChild(inputElement);	

				inputElement = document.createElement('input');
				inputElement.value = 1.0;
				inputElement.addEventListener("mousedown",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchstart",function(event){event.stopPropagation();});
				inputElement.addEventListener("mousemove",function(event){event.stopPropagation();});
				inputElement.addEventListener("touchmove",function(event){event.stopPropagation();});
				inputElement.id="color_picker_alpha_input";
				sppc.appendChild(inputElement);					
				
				gradX("#tm_gradient_cp");				


				var maxWidth = -1;
				var totalHeight = 0;
				
				var toolBar = $('.group_div_toolbar');				

				
				var all_cols = $('.group_div_toolbar_col');
				
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
					
					all_cols[i].style.width = '100px';
					all_cols[i].style.height = '100px';
					
				//	curRowElement.addClass('resizing_div_anim_expand_lt');
					$('#'+all_cols[i].id+'.group_div_toolbar_col').addClass('auto_whfit_anim');						
					
					var curAdjButton = $('#'+all_cols[i].id+'.group_div_toolbar_col>> .adj_btn');
					curAdjButton.addClass('auto_whfit_anim');
					curAdjButton.width('100px');
					curAdjButton.height('100px');
					
					curAdjButton[0].rowContainerId = curAdjButton[0].parentElement.parentElement.id;
					
					curAdjButton[0].adjMaxWidth = group_div_cp_child_maxW + "px";
					curAdjButton[0].adjMaxHeight = group_div_cp_child_maxH + "px";
					
					curAdjButton[0].addEventListener("mousedown",function(event){
						
						if(event.target.isExpanded == undefined)
							event.target.isExpanded = false;
						
												
						var scaleTargetObj = $(".group_div_toolbar >> #" + this.rowContainerId + " >> .element_div");
						var resizeTargetObj = $(".group_div_toolbar >> #" + this.rowContainerId);

						if(this.isExpanded){	
						
							toolBar[0].curWidth -= resizeTargetObj.width() - 100;
							toolBar[0].curHeight -= resizeTargetObj.height() - 100;
							
							toolBar[0].style.width = toolBar[0].curWidth + "px";
							toolBar[0].style.height = toolBar[0].curHeight + "px";	
						
							scaleTargetObj.toggleClass('resizing_div_anim_expand_lt');
							scaleTargetObj.toggleClass('resizing_div_anim_shrink_lt');	
							
							if(this.originalW == undefined){
								this.originalW = resizeTargetObj.width();
								this.originalH = resizeTargetObj.height();								
							}						
							
							if(this.originalBtnW == undefined){
								this.originalBtnW = this.style.width;
								this.originalBtnH = this.style.height;								
							}									

							
							this.style.width = "100px";
							this.style.height = "100px";								
							
							resizeTargetObj.width(this.style.width);
							resizeTargetObj.height(this.style.height);
							

						}
						else{
							
							var adjMaxWidthNumber = parseInt(this.adjMaxWidth);//this.adjMaxWidth.substring(0, this.adjMaxWidth.lastIndexOf("px")-1).Number();
							var adjMaxHeightNumber =parseInt(this.adjMaxHeight); //this.adjMaxHeight.substring(0, this.adjMaxHeight.lastIndexOf("px")-1).Number();
							
							toolBar[0].curWidth += adjMaxWidthNumber - 100;
							toolBar[0].curHeight += adjMaxHeightNumber - 100;
							
							toolBar[0].style.width = toolBar[0].curWidth + "px";
							toolBar[0].style.height = toolBar[0].curHeight + "px";	
							
							scaleTargetObj.toggleClass('resizing_div_anim_shrink_lt');						
							scaleTargetObj.toggleClass('resizing_div_anim_expand_lt');	
							
							resizeTargetObj.width(this.adjMaxWidth);
							resizeTargetObj.height(this.adjMaxHeight);
							
							this.style.width = this.originalBtnW;
							this.style.height = this.originalBtnH;							
							
						}	
						this.isExpanded = !this.isExpanded;
					});				
				}
				
				for(var i=0; i<toolBar[0].childElementCount; i++){					
					if(toolBar[0].children[i].offsetWidth > maxWidth)
						maxWidth = toolBar[0].children[i].offsetWidth;	
					totalHeight += toolBar[0].children[i].offsetHeight;
				}	

				toolBar[0].style.width = maxWidth + "px";
				toolBar[0].style.height = totalHeight + "px";	

				toolBar[0].curWidth = maxWidth;
				toolBar[0].curHeight = totalHeight;
				
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
					
					ThinkMine.Lib.ExternalUI.ColorPickerCanvas.attach("color_picker_canvas",TMCanvas);
					ThinkMine.Lib.ExternalUI.RecentColor.attach("group_id_recent_color",TMCanvas);
					
					ThinkMine.Lib.ExternalUI.ColorPickerRedInput.attach("color_picker_red_input");
					ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.attach("color_picker_green_input");
					ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.attach("color_picker_blue_input");
					ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.attach("color_picker_alpha_input");
					
					//var main_cp = $('#tm_main_cp .sp-input');
					
					var hiddenColorInput = $('#tm_main_cp').siblings('.sp-container').find('.sp-input');			
				//	console.log(hiddenColorInput[0].value);

					var colorTextInputChangeCallback = function (){
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
						
						var changeEvent = jQuery.Event('change');						
						hiddenColorInput.trigger('change');
					}
					ThinkMine.Lib.ExternalUI.ColorPickerRedInput.valueChangedCallback = colorTextInputChangeCallback;
					ThinkMine.Lib.ExternalUI.ColorPickerGreenInput.valueChangedCallback = colorTextInputChangeCallback;
					ThinkMine.Lib.ExternalUI.ColorPickerBlueInput.valueChangedCallback = colorTextInputChangeCallback;
					ThinkMine.Lib.ExternalUI.ColorPickerAlphaInput.valueChangedCallback = colorTextInputChangeCallback;
					
					ThinkMine.Lib.ExternalUI.CircleImageButton.attach("CircleShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.RectangleImageButton.attach("RectangleShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.StarImageButton.attach("StarShapeImage",TMCanvas);
					ThinkMine.Lib.ExternalUI.PolygonImageButton.attach("PolygonShapeImage",TMCanvas);
					
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