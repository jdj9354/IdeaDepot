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

<div id="group_div_toolbar" style="border:1px solid #000000; position:absolute; top:0px; left:0px;"
			onmousedown="ElementDragAndMoveEventHandler.dragstart(this, event)" 
			onmousemove = "ElementDragAndMoveEventHandler.drag(this, event);" 
			onmouseup="ElementDragAndMoveEventHandler.dragend(this, event);" 
			ontouchstart="ElementDragAndMoveEventHandler.touchDragstart(this, event);" 
			ontouchmove="ElementDragAndMoveEventHandler.touchDrag(this, event);" 
			ontouchend="ElementDragAndMoveEventHandler.touchDragend(this, event);" 
			style="border:1px solid #000000; position:absolute; top:0px; left:0px; ">
	<div id ="group_div_toolbar_col" style='display: inline-block;  width:500px; height:250px;'>
		<div style='position:absolute;'>
			<div id="group_div_cp" draggable="false" style='top:0px; left:0px; border:1px solid #000000;' > 				
				<div id="tm_main_cp" style='position:absolute; top:0px; left:0px; z-index:2;'></div> 
				<div id="tm_gradient_cp" style='position:absolute; top:0px; left:0px; z-index:1;'></div>						
			</div>
			<div style='width:100px; height:100px; bottom:0px; right:0px; position:absolute;'>
				<button id="test_btn" style="border:1px solid #000000; position:absolute; width:100px; height:100px;">
			</div>
		</div>
	</div>
	<div id ="group_div_toolbar_col2" style='display: inline-block; width:400px; height:300px; border:1px solid #000000;'>
		<div style='position:absolute;'>
			<div id="group_div_cp2" draggable="false" style='top:0px; left:0px; width:300px; height:200px; border:1px solid #000000;' > 									
			</div>
			<div style='width:100px; height:100px; bottom:0px; left:0px; position:absolute;'>
				<button id="test_btn2" style="border:1px solid #000000; position:absolute; width:100px; height:100px;">
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

				<div id="group_div_shape" style="margin: 0 auto;">
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
				
				//$("#tm_gradient_cp > .gradx_container")[0].addEventListener("mousedown",function(event){event.stopPropagation();});
				//$("#tm_gradient_cp > .gradx_container")[0].addEventListener("touchstart",function(event){event.stopPropagation();});
				//$("#tm_gradient_cp > .gradx_container")[0].addEventListener("mousemove",function(event){event.stopPropagation();});
				//$("#tm_gradient_cp > .gradx_container")[0].addEventListener("touchmove",function(event){event.stopPropagation();});				
				
				var group_div_cp_child_maxW = -1;
				var group_div_cp_child_maxH = -1;
				
				var gdcp = $('#group_div_cp')[0];
				
				
				for(var i=0; i<gdcp.childElementCount; i++){
					if(gdcp.children[i].offsetWidth > group_div_cp_child_maxW)
						group_div_cp_child_maxW = gdcp.children[i].offsetWidth;
					if(gdcp.children[i].offsetHeight > group_div_cp_child_maxH)
						group_div_cp_child_maxH = gdcp.children[i].offsetHeight;					
				}
				
				gdcp.style.width = group_div_cp_child_maxW + "px";
				gdcp.style.height = group_div_cp_child_maxH + "px";
				
								
				var testBtn = document.getElementById("test_btn");
				
				$('#group_div_cp').addClass('resizing_div_anim_expand_rb');
				$('#group_div_cp2').addClass('resizing_div_anim_expand_lb');
			//	$('#group_div_toolbar').addClass('auto_whfit_anim');
				
				testBtn.addEventListener("mousedown",function(event){
					var btnObj = event.target;
					if(btnObj.isExpanded == undefined)
						btnObj.isExpanded = true;
					
					var targetObj = document.getElementById("group_div_cp");					

					if(btnObj.isExpanded){
						var width_cp = $('#group_div_cp').width();
						var height_cp = $('#group_div_cp').height();					

						
						

						
						$('#group_div_cp').toggleClass('resizing_div_anim_expand_rb');
						$('#group_div_cp').toggleClass('resizing_div_anim_shrink_rb');
						
						//$('#group_div_toolbar').width($('#group_div_toolbar').width() - width_cp);
						//$('#group_div_toolbar').height($('#group_div_toolbar').height() - height_cp);
						
						var offset = $("#group_div_toolbar").offset();
					///	$("#group_div_toolbar").css("left", offset.left + width_cp);
					//	$("#group_div_toolbar").css("top", offset.top + height_cp);
					}
					else{
					//	$('#group_div_toolbar').width($('#group_div_toolbar').width() - $('#group_div_cp').width());
						//$('#group_div_toolbar').height($('#group_div_toolbar').height() - $('#group_div_cp').height());
						
						$('#group_div_cp').removeClass('resizing_div_anim_shrink_rb');						
						$('#group_div_cp').toggleClass('resizing_div_anim_expand_rb');	
					}	
					btnObj.isExpanded = !btnObj.isExpanded;
				});
				
				var testBtn2 = document.getElementById("test_btn2");
				
				testBtn2.addEventListener("mousedown",function(event){
					var btnObj = event.target;
					if(btnObj.isExpanded == undefined)
						btnObj.isExpanded = true;
					
					var targetObj = document.getElementById("group_div_cp2");					

					if(btnObj.isExpanded){
						var width_cp = $('#group_div_cp2').width();
						var height_cp = $('#group_div_cp2').height();					

						
						

						
						$('#group_div_cp2').toggleClass('resizing_div_anim_expand_lb');
						$('#group_div_cp2').toggleClass('resizing_div_anim_shrink_lb');
						
						//$('#group_div_toolbar').width($('#group_div_toolbar').width() - width_cp);
						//$('#group_div_toolbar').height($('#group_div_toolbar').height() - height_cp);
						
						var offset = $("#group_div_toolbar").offset();
					///	$("#group_div_toolbar").css("left", offset.left + width_cp);
					//	$("#group_div_toolbar").css("top", offset.top + height_cp);
					}
					else{
					//	$('#group_div_toolbar').width($('#group_div_toolbar').width() - $('#group_div_cp').width());
						//$('#group_div_toolbar').height($('#group_div_toolbar').height() - $('#group_div_cp').height());
						
						$('#group_div_cp2').removeClass('resizing_div_anim_shrink_lb');						
						$('#group_div_cp2').toggleClass('resizing_div_anim_expand_lb');	
					}	
					btnObj.isExpanded = !btnObj.isExpanded;
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