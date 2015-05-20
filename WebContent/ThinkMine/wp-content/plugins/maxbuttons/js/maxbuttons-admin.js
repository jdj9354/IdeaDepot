 
var maxAdmin = function (jquery)
{
 	$ = jquery;
}
maxAdmin.prototype = {
 	colorUpdateTime: true,
 	fields: null,
 	button_id: null, 
}; // MaxAdmin

maxAdmin.prototype.init = function () {
		//var colorUpdateTime = true; 
		this.button_id = $('input[name="button_id"]').val(); 
		
 		// Prevents the output button from being clickable (also in admin list view )	
		$(".maxbutton-preview").on('click',function(e) { e.preventDefault(); });		

		// Fix thickbox behavior
 		$('.maxbutton_thickbox').on('click', this.fixThickSize);
 				
		// ### After this only init for button main edit screen
		if ($('#new-button-form').length == 0) 
			return; 
			
		if (this.button_id > 0) {
			$("#maxbuttons .mb-message").show();
		} 
		
		this.initResponsive(); // responsive edit interface 
		
		$("#maxbuttons .output").draggable();
		$("#view_css_modal").leanModal();

		$('.colorpicker-box').each(function () { 
			var input = $(this).attr('id').replace('_box',''); 
 
			$(this).children('span').css('backgroundColor',$('#' + input).val()); 
		});
		this.showColorPicker(); 
		
		if ( typeof buttonFieldMap != 'undefined')
			this.fields = $.parseJSON(buttonFieldMap);
		


		
 		$('input[type="text"]').on('keyup', $.proxy(this.update_preview,this)); 
 		$('select').on('change', $.proxy(this.update_preview, this)); 
 		$(document).on('colorUpdate', $.proxy(this.update_color, this)); 
		
		$(".button-save").click(function() {			
			$("#new-button-form").submit();
			return false;
		});

		$('#copy-normal-colors-to-hover').click($.proxy(this.copy_colors,this,'normal_to_hover')); 
		$('#copy-hover-colors-to-normal').click($.proxy(this.copy_colors,this,'hover_to_normal')); 
		$('#swap-normal-hover-colors').click($.proxy(this.copy_colors,this,'swap_normal_hover')); 
		$('#copy-invert-normal-colors').click($.proxy(this.copy_colors,this,'invert')); 		
		
 
		
}; // INIT

	
maxAdmin.prototype.copy_colors = function(action, e)
		{
			// get all colors
 
 			e.preventDefault();
 			
			var text = $("#text_color").val();
			var text_shadow = $("#text_shadow_color").val();
			var start_color = $("#gradient_start_color").val();
			var end_color = $("#gradient_end_color").val();
			var border_color = $("#border_color").val();
			var box_shadow = $("#box_shadow_color").val();
			var text_hover = $("#text_color_hover").val();
			var text_shadow_hover = $("#text_shadow_color_hover").val();
			var start_color_hover = $("#gradient_start_color_hover").val();
			var end_color_hover = $("#gradient_end_color_hover").val();
			var border_color_hover = $("#border_color_hover").val();
			var box_shadow_hover = $("#box_shadow_color_hover").val();	
		
			// copy and moving 
			if (action == 'normal_to_hover' || action == 'invert')
			{
				text_hover = text; 
				text_shadow_hover = text_shadow; 
				start_color_hover = start_color; 
				end_color_hover = end_color; 
				border_color_hover = border_color; 
				box_shadow_hover = box_shadow; 
			}
			if (action == 'hover_to_normal') 
			{
				text = text_hover; 
				text_shadow = text_shadow_hover; 
				start_color = start_color_hover; 
				end_color = end_color_hover; 
				border_color = border_color_hover; 
				box_shadow = box_shadow_hover; 
			}
			if (action == 'swap_normal_hover') 
			{
				var tmp; 
				tmp = text; 
				text = text_hover; 
				text_hover = tmp; 
				
				tmp = text_shadow; 
				text_shadow = text_shadow_hover; 
				text_shadow_hover = tmp; 
				
				tmp = start_color; 
				start_color = start_color_hover; 
				start_color_hover = tmp; 
				
				tmp = end_color; 
				end_color = end_color_hover; 
				end_color_hover = tmp; 
				
				tmp = border_color; 
				border_color = border_color_hover; 
				border_color_hover = tmp; 
				
				tmp = box_shadow;
				box_shadow = box_shadow_hover; 
				box_shadow_hover = tmp; 
			}
			if (action == 'invert') // actual inversion
			{
				end_color_hover = start_color; 
				start_color_hover = end_color; 
			
			}
		
			// put all colors back	

			$("#text_color").val(text);
			$("#text_shadow_color").val(text_shadow)
			$("#gradient_start_color").val(start_color);
			$("#gradient_end_color").val(end_color);
			$("#border_color").val(border_color);
			$("#box_shadow_color").val(box_shadow);
			$("#text_color_hover").val(text_hover);
			$("#text_shadow_color_hover").val(text_shadow_hover);
			$("#gradient_start_color_hover").val(start_color_hover);
			$("#gradient_end_color_hover").val(end_color_hover);
			$("#border_color_hover").val(border_color_hover);
			$("#box_shadow_color_hover").val(box_shadow_hover);		

 
			$(document).trigger('colorUpdate', [ $('#text_color'), text]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#text_shadow_color'), text_shadow]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#gradient_start_color'), start_color]); 
			this.colorUpdateTime = true;	
			$(document).trigger('colorUpdate', [ $('#gradient_end_color'), end_color]); 
			this.colorUpdateTime = true;	
			$(document).trigger('colorUpdate', [ $('#border_color'), border_color]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#box_shadow_color'), box_shadow]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#text_color_hover'), text_hover]);
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#text_shadow_color_hover'), text_shadow_hover]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#gradient_start_color_hover'), start_color_hover]); 
			this.colorUpdateTime = true;	
			$(document).trigger('colorUpdate', [ $('#gradient_end_color_hover'), end_color_hover]); 
			this.colorUpdateTime = true;	
			$(document).trigger('colorUpdate', [ $('#border_color_hover'), border_color_hover]); 	
			this.colorUpdateTime = true;
			$(document).trigger('colorUpdate', [ $('#box_shadow_color_hover'), box_shadow_hover]); 	
																		 																			
 
			$("#text_color_box span").css("backgroundColor", text);
			$("#text_shadow_color_box span").css("backgroundColor",text_shadow)
			$("#gradient_start_color_box span").css("backgroundColor",start_color);
			$("#gradient_end_color_box span").css("backgroundColor",end_color);
			$("#border_color_box span").css("backgroundColor",border_color);
			$("#box_shadow_color_box span").css("backgroundColor",box_shadow);
			$("#text_color_hover_box span").css("backgroundColor",text_hover);
			$("#text_shadow_color_hover_box span").css("backgroundColor",text_shadow_hover);
			$("#gradient_start_color_hover_box span").css("backgroundColor",start_color_hover);
			$("#gradient_end_color_hover_box span").css("backgroundColor",end_color_hover);
			$("#border_color_hover_box span").css("backgroundColor",border_color_hover);
			$("#box_shadow_color_hover_box span").css("backgroundColor",box_shadow_hover);						
};


maxAdmin.prototype.showColorPicker = function()
		{
			$('.colorpicker-box span').ColorPicker({

				'onBeforeShow': function () { 
					var target = $(this).parent().attr('id'); 
					target = target.replace('_box',''); 
 
					var val = $('#' + target).val();
 
					$('#colorpicker_current').val(target);
					if (typeof val == 'undefined' || val == '') 
						val = '#ffffff';
					
					$(this).ColorPickerSetColor(val); 
				},
				 'onChange': function(hsb, hex, rgb, el) {
				 			var current_id = $('#colorpicker_current').val();
 
							var target = $('#' + current_id ); 
							 
 
							$('#' + current_id).attr('value', '#' + hex);
							$('#' + current_id + '_box span').css('background-color', '#' + hex);	
							$(document).trigger('colorUpdate', [target, hex]); 			
				},
				'onShow': function(colpkr) { $(colpkr).fadeIn(500); return false; $(colpkr).css('z-index',500); },
				'onHide': function(colpkr) { $(colpkr).fadeOut(500); return false; },
										
			});

		};
		
maxAdmin.prototype.update_preview = function(e) 
		{
			e.preventDefault();
			var target = $(e.target); 
			var id = $(target).attr('id'); 

			var data = this.fields[id]; 

 
			if (typeof data == 'undefined') 
				return; // field doesn't have updates 
 
			if (typeof data.css != 'undefined') 		
			{
 
				value = target.val(); 
				if (typeof data.css_unit != 'undefined' && value.indexOf(data.css_unit) == -1) 
					value += data.css_unit;

				//$('.output .result').find('a').css(data.css, value);

				this.putCSS(data, value);
			}
			if (typeof data.attr != 'undefined') 
			{
				$('.output .result').find('a').attr(data.attr, target.val());
			}
			if (typeof data.func != 'undefined')
			{
 
				eval('this.'+ data.func + '(target)');
			}
		};
		
maxAdmin.prototype.putCSS = function(data,value,state) 
{
	state = state || 'both';
	 
	var element = '.maxbutton';  
	if (state == 'hover') 
		element = 'a.hover '; 
	else if(state == 'normal') 
		element = 'a.normal '; 
	 
	if (typeof data.csspart != 'undefined') 
	{
		var parts = data.csspart.split(",");
		for(i=0; i < parts.length; i++)
		{
			var cpart = parts[i]; 
			//var fullpart = element; 
			var fullpart = element + " ." + cpart;
			/*			
			if ( cpart.indexOf(':hover') !== -1 ) 
			{
				fullpart += cpart.replace(':hover','').trim(); 
			}
			else
				fullpart += ' .maxbutton-' + this.button_id + cpart; 

			*/
  				$('.output .result').find(fullpart).css(data.css, value); 
		  }
	}
	else
		$('.output .result').find(element).css(data.css, value); 
		

}
		
maxAdmin.prototype.update_color = function(event, target, color)
		{
			if (! this.colorUpdateTime) return; // preventing event flood
			this.colorUpdateTime = false;
			setTimeout($.proxy(function() { this.colorUpdateTime = true; },this),250); 
			event.preventDefault();
			
			if (color.indexOf('#') === -1)
				color = '#' + color; 
				
			var id = $(target).attr('id');

			
			if(id.indexOf('box_shadow') !== -1)
			{
				this.updateBoxShadow(target); 
			}
			else if(id.indexOf('text_shadow') !== -1)
			{
				this.updateTextShadow(target); 
			}			
			else if (id.indexOf('gradient') !== -1)
			{
				if (id.indexOf('hover') == -1)
					this.updateGradient();
				else
					this.updateGradient(true);			
			}
			else if (id == 'button_preview')
			{
				$(".output .result").css('backgroundColor',  color); 
			}
			else  // simple update
			{

 
				if (id.indexOf('hover') == -1)
				{	
					//$('.output .result').find('a.normal').css(data.css, '#' + color);
					state = 'normal';
				}
				else
				{
					//$('.output .result').find('a.hover').css(data.css, '#' + color); 
					state = 'hover'; 
				}
				
				var data = this.fields[id]; 
				
				
				this.putCSS(data, color, state);	
				return;
			}
 

		};
		
maxAdmin.prototype.updateGradient = function(hover)
		{
			hover = hover || false;
			
			var hovtarget = ''; 	
			if (hover)
				hovtarget = "_hover"; 

				
			var stop = parseInt($('#gradient_stop').val()); 

			
			if (isNaN(stop) )
				stop = 45;
				 
			var start = this.hexToRgb($('#gradient_start_color' + hovtarget).val());
			var end = this.hexToRgb($('#gradient_end_color' + hovtarget).val());
			var startop = parseInt($('#gradient_start_opacity' + hovtarget).val());
			var endop = parseInt($('#gradient_end_opacity' + hovtarget).val());
 
 			if(isNaN(startop)) startop = 100; 
 			if(isNaN(endop)) endop = 100;
 			
			if (!hover)
				var button = $('.output .result').find('a.normal'); 			
			else
				var button = $('.output .result').find('a.hover');


 			
					
			button.css("background", "linear-gradient( rgba(" + start + "," + (startop/100) + ") " + stop + "%," + " rgba(" + end + "," + (endop/100) + ") )"); 
			button.css("background", "-moz-linear-gradient( rgba(" + start + "," + (startop/100) + ") " + stop + "%," + " rgba(" + end + "," + (endop/100) + ") )"); 
			button.css("background", "-o-linear-gradient( rgba(" + start + "," + (startop/100) + ") " + stop + "%," + " rgba(" + end + "," + (endop/100) + ") )"); 
			button.css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(" +stop+ "%, rgba(" + start + "," + (startop/100) + ")), color-stop(1, rgba(" + end + "," + (endop/100) + ") ));"); 
			
			 		
		}
		
maxAdmin.prototype.hexToRgb = function(hex) {
 
			hex = hex.replace('#','');
			var bigint = parseInt(hex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;
 
			return r + "," + g + "," + b;
		}
		
maxAdmin.prototype.updateBoxShadow = function (target)
		{
			target = target || null;

			var left = $("#box_shadow_offset_left").val();
			var top = $("#box_shadow_offset_top").val();
			var width = $("#box_shadow_width").val();						
			
			var color = $("#box_shadow_color").val();
			var hovcolor = $("#box_shadow_color_hover").val();
			
			$('.output .result').find('a.normal').css("boxShadow",left + 'px ' + top + 'px ' + width + 'px ' + color);	
			$('.output .result').find('a.hover').css("boxShadow",left + 'px ' + top + 'px ' + width + 'px ' + hovcolor);		
		}
		
maxAdmin.prototype.updateTextShadow = function(target,hover)
		{
			hover = hover || false; 

			var left = $("#text_shadow_offset_left").val();
			var top = $("#text_shadow_offset_top").val();
			var width = $("#text_shadow_width").val();						
			
			var color = $("#text_shadow_color").val();
			var hovcolor = $("#text_shadow_color_hover").val();
		
			var id = $(target).attr('id');
			var data = this.fields[id]; 
 	
 
		//	$('.output .result').find('a.normal [class*=mb-text]').css("textShadow",left + 'px ' + top + 'px ' + width + 'px ' + color);	
		//	$('.output .result').find('a.hover [class*=mb-text]').css("textShadow",left + 'px ' + top + 'px ' + width + 'px ' + hovcolor);	
			data.css = 'textShadow'; 
			
			var value = left + 'px ' + top + 'px ' + width + 'px ' + color; 
			this.putCSS(data, value, 'normal'); 
			
			value = left + 'px ' + top + 'px ' + width + 'px ' + hovcolor;
			this.putCSS(data, value, 'hover'); 
			
		}
		
maxAdmin.prototype.updateAnchorText = function (target)
		{
			$('.output .result').find('a .mb-text').text(target.val());
		}
		
maxAdmin.prototype.updateGradientOpacity = function(target)
		{
			this.updateGradient(true);
			this.updateGradient(false);
		}

maxAdmin.prototype.updateDimension = function (target)
{
	var dimension = $(target).val(); 
	var id = $(target).attr('id'); 
	var data = this.fields[id]; 
	if (dimension > 0) 	
		this.putCSS(data, dimension);
	else
		this.putCSS(data, 'auto'); 
}

		
maxAdmin.prototype.fixThickSize = function(e)
{	
	e.preventDefault();
	e.stopPropagation(); 
	
	var title = e.target.title; 
	var href = '#TB_inline?width=200&height=460&inlineId=select-maxbutton-container';

	tb_show(title, href);
	
	var nw = $('#TB_window').width() - 30 + 'px';

	$('#TB_ajaxContent').css('width',nw);
	
	return false;

}
maxAdmin.prototype.initResponsive = function()
{
	this.checkAutoQuery();	
	$('input[name="auto_responsive"]').on('click', $.proxy(this.checkAutoQuery,this)); 
	$('.add_media_query').on('click', $.proxy(this.addMediaQuery, this)); 
	//$('.removebutton').on('click', ); 
	$(document).on('click', '.removebutton', $.proxy(this.removeMediaQuery, this)); 
	
}	
maxAdmin.prototype.checkAutoQuery = function()
{
	if ( $('input[name="auto_responsive"]').is(':checked') )
	{

		$('.media_queries_options').hide(); 
	}
	else 
	{
		$('.media_queries_options').show(); 
		
	}

}	

maxAdmin.prototype.addMediaQuery = function() 
{
	
	var new_option = $('.media_option_prot').children().clone();
 
	var new_query = $("#new_query").val(); 
	var new_title = $("#new_query :selected").text(); 
	var new_desc = $("#media_desc").children('#' + new_query).text();
	
	$(new_option).children('input[name="media_query[]"]').val(new_query);
	$(new_option).children('.title').text(new_title); 
	$(new_option).children('.description').text(new_desc);
	
	if (new_query !== 'custom') 
		$(new_option).children('.custom').remove(); 
	
	$('#new_query :selected').remove();
	$('.media_queries_options .new_query_space').append(new_option);
 
}

maxAdmin.prototype.removeMediaQuery = function(e) 
{
	var target = e.target;

	$(target).parents('.media_query').fadeOut(function() { $(this).remove() } ); 
}

