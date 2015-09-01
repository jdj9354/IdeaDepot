<?php

$blockClass["container"] = "containerBlock"; 
$blockOrder[7][] = "container";
 

class containerBlock extends maxBlock 
{
	protected $blockname = "container"; 
	protected $fields = array("container_enabled" => array("default" => "0"),
						"container_center_div_wrap" => array("default" => "0"),
															  
						"container_width" => array("default" => "0px",
												   "css" => "width", 
												   "csspart" => "mb-container"),
						"container_margin_top" => array("default" => "0px",
													"css" => "margin-top",
													"csspart" => "mb-container"), 
						"container_margin_right" => array("default" => "0px",
												   "css" => "margin-right", 
												   "csspart" => "mb-container"),
						"container_margin_bottom" => array("default" => "0px",
												   "css" => "margin-bottom", 
												   "csspart" => "mb-container"),
						"container_margin_left" => array("default" => "0px",
												   "css" => "margin-left", 
												   "csspart" => "mb-container"),							
						"container_alignment" => array("default" => "",
												   "css" => "align", 
												   "csspart" => "mb-container"), 
						); 
	
 
	public function parse_button($domObj, $mode = 'normal')
	{
		$data = $this->data[$this->blockname]; 
		$id = $this->data["id"]; 

 		if ($mode == 'editor')
 			return $domObj; // in previews no container object
	
 
		if ($data["container_enabled"] == 1) 
		{
			$anchor = $domObj->find("a",0); 
			$anchor->outertext = "<span class='maxbutton-" . $id . "-container mb-container'>" . $anchor->outertext . "</span>";  

			
			if ($data["container_center_div_wrap"] == 1) // I heard you like wrapping... 
			{
				$anchor->outertext = "<span class='mb-center maxbutton-" . $id . "-center'>" . $anchor->outertext . "</span>"; 
	
			}
			// reload the dom model with new divs 
			$newhtml = $domObj->save(); 
			$domObj =  new simple_html_dom(); 
			$domObj->load($newhtml);
		}
		

		
		return $domObj;
	}

	public function parse_css($css, $mode = 'normal')
	{
		$css = parent::parse_css($css);
		$data = $this->data[$this->blockname]; 

		$csspart = 'mb-container'; 
		$csspseudo = 'normal';
		
		$css["mb-container"]["normal"]["display"] = "block"; 
		$css["mb-center"]["normal"]["display"] = "block"; 
		$css["mb-center"]["normal"]["text-align"] = "center"; 
		
		if (isset($css[$csspart][$csspseudo]["align"])) 
		{

			if ($css[$csspart][$csspseudo]["align"] != '')
			{ 	
				$stat = explode(":", $css[$csspart][$csspseudo]["align"]); 
				$css[$csspart][$csspseudo][ $stat[0] ] = $stat[1];
		 	}
		 	unset($css[$csspart][$csspseudo]["align"]); 
		}
		if ( isset($css[$csspart][$csspseudo]["width"]) && $data["container_width"] == 0)
		{
			unset($css[$csspart][$csspseudo]["width"]);
		}
		return $css; 
		
	}
	


	public function admin_fields() 
	{
		$data = $this->data[$this->blockname]; 
		foreach($this->fields as $field => $options)
		{		
 	 	    $default = (isset($options["default"])) ? $options["default"] : ''; 
			$$field = (isset($data[$field])) ? $data[$field] : $default;
			${$field  . "_default"} = $default; 
			
			global $maxbuttons_container_alignments; 
		}
		 
 
?>		
	<div class="option-container">
				<div class="title"><?php _e('Container', 'maxbuttons') ?></div>
				<div class="inside">
					<div class="option-design">
						<div class="label"><?php _e('Use Container', 'maxbuttons') ?></div>
						<div class="input"><input type="checkbox" id="container_enabled" name="container_enabled" value="1" <?php checked($container_enabled,1) ?>></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Wrap with Center Div', 'maxbuttons') ?></div>
					<div class="input"><input type="checkbox" id="container_center_div_wrap" name="container_center_div_wrap" value="1" <?php checked($container_center_div_wrap,1) ?>></div>
						<div class="default">&lt;div align="center"&gt;</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Width', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="container_width" name="container_width" value="<?php echo maxButtonsUtils::strip_px($container_width) ?>" />px</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Margin Top', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="container_margin_top" name="container_margin_top" value="<?php echo maxButtonsUtils::strip_px($container_margin_top) ?>" />px</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Margin Right', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="container_margin_right" name="container_margin_right" value="<?php echo maxButtonsUtils::strip_px($container_margin_right) ?>" />px</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Margin Bottom', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="container_margin_bottom" name="container_margin_bottom" value="<?php echo maxButtonsUtils::strip_px($container_margin_bottom) ?>" />px</div>
						<div class="clear"></div>
					</div>

					<div class="option-design">
						<div class="label"><?php _e('Margin Left', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="container_margin_left" name="container_margin_left" value="<?php echo maxButtonsUtils::strip_px($container_margin_left) ?>" />px</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Alignment', 'maxbuttons') ?></div>
						<div class="input">
							<select id="container_alignment" name="container_alignment">
							<?php
							foreach ($maxbuttons_container_alignments as $name => $value) {
								echo '<option value="' . $value . '" ' . selected($container_alignment, $value) . '>' . $name . '</option>';
							}
							?>
							</select>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
<?php 
} // admin_fields

} // class


?>
