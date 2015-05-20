<?php

$blockClass["border"] = "borderBlock"; 
$blockOrder[4][] = "border"; 

class borderBlock extends maxBlock 
{
	protected $blockname = "border"; 
	protected $fields = array("radius_top_left" => 
								array("default" => "4px",
									  "css" => "border-top-left-radius"									
									),
						"radius_top_right" => array("default" => "4px",
											 "css" => "border-top-right-radius"
											 ),
						"radius_bottom_left" => array("default" => "4px",
													 "css" => "border-bottom-left-radius"
											),
						"radius_bottom_right" => array("default" => "4px",
													 "css" => "border-bottom-right-radius"
													 ), 
						"border_style" => array("default" => "solid",
												"css" => "border-style"
												),
						"border_width" => array("default" => "1px",
												 "css" => "border-width"
												 ),
						"box_shadow_offset_left" => array("default" => "0px",
												 	"css" => "box-shadow-offset-left",
												 	"csspseudo" => "normal,hover"
												 ),
						"box_shadow_offset_top" => array("default" => "0px",
													"css" => "box-shadow-offset-top",
													"csspseudo" => "normal,hover"),
						"box_shadow_width" => array("default" => "2px",
													"css" => "box-shadow-width",
													"csspseudo" => "normal,hover"),
 
						); 
	

	function __construct()
	{
		parent::__construct();
		$this->fields = apply_filters($this->blockname. "-block-fields",$this->fields); 
		$this->data[$this->blockname] = array(); //empty init		
	}
	
	public function map_fields($map)
	{
		$map = parent::map_fields($map); 
		$map["box_shadow_offset_left"]["func"] = "updateBoxShadow"; 
		$map["box_shadow_offset_top"]["func"] = "updateBoxShadow"; 
		$map["box_shadow_width"]["func"] = "updateBoxShadow"; 
		
		return $map; 
	}

	public function admin_fields() 
	{
		$data = $this->data[$this->blockname]; 
		foreach($this->fields as $field => $options)
		{		
 	 	    $default = (isset($options["default"])) ? $options["default"] : ''; 
			$$field = (isset($data[$field])) ? $data[$field] : $default;
			${$field  . "_default"} = $default; 
		}
		
		global $maxbuttons_border_styles;
?>	
	<div class="option-container">
				<div class="title"><?php _e('Border', 'maxbuttons') ?></div>
				<div class="inside">
					<div class="option-design">
						<div class="label"><label><?php _e('Radius', 'maxbuttons') ?></label></div>
						<div class="input">
							<table>
								<tr>
									<td>
										<div class="cell-label"><?php _e('Top Left', 'maxbuttons') ?></div>
										<div class="input"><input class="tiny" type="text" id="radius_top_left" name="radius_top_left" value="<?php echo maxButtonsUtils::strip_px($radius_top_left) ?>" />px</div>
										<div class="default-other"><?php _e('Default:', 'maxbuttons') ?> <?php echo $radius_top_left_default ?></div>
										<div class="clear"></div>
									</td>
									<td>
										<div class="cell-label"><?php _e('Top Right', 'maxbuttons') ?></div>
										<div class="input"><input class="tiny" type="text" id="radius_top_right" name="radius_top_right" value="<?php echo maxButtonsUtils::strip_px($radius_top_right) ?>" />px</div>
										<div class="default-other"><?php _e('Default:', 'maxbuttons') ?> <?php echo $radius_top_right_default ?></div>
										<div class="clear"></div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="cell-label"><?php _e('Bottom Left', 'maxbuttons') ?></div>
										<div class="input"><input class="tiny" type="text" id="radius_bottom_left" name="radius_bottom_left" value="<?php echo maxButtonsUtils::strip_px($radius_bottom_left) ?>" />px</div>
										<div class="default-other"><?php _e('Default:', 'maxbuttons') ?> <?php echo $radius_bottom_left_default ?></div>
										<div class="clear"></div>
									</td>
									<td>
										<div class="cell-label"><?php _e('Bottom Right', 'maxbuttons') ?></div>
										<div class="input"><input class="tiny" type="text" id="radius_bottom_right" name="radius_bottom_right" value="<?php echo maxButtonsUtils::strip_px($radius_bottom_right) ?>" />px</div>
										<div class="default-other"><?php _e('Default:', 'maxbuttons') ?> <?php echo $radius_bottom_right_default ?></div>
										<div class="clear"></div>
									</td>
								</tr>
							</table>
						</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Style', 'maxbuttons') ?></div>
						<div class="input">
							<select id="border_style" name="border_style">
							<?php
							foreach ($maxbuttons_border_styles as $name => $value) {
								echo '<option value="' . $value . '" ' . selected($border_style,$value) . '>' . $name . '</option>';
							}
							?>
							</select>
						</div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $border_style_default ?></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Width', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="border_width" name="border_width" value="<?php echo maxButtonsUtils::strip_px($border_width) ?>" />px</div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $border_width ?></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Shadow Offset Left', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="box_shadow_offset_left" name="box_shadow_offset_left" value="<?php echo maxButtonsUtils::strip_px($box_shadow_offset_left) ?>" />px</div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $box_shadow_offset_left_default ?></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Shadow Offset Top', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="box_shadow_offset_top" name="box_shadow_offset_top" value="<?php echo maxButtonsUtils::strip_px($box_shadow_offset_top) ?>" />px</div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $box_shadow_offset_top_default ?></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Shadow Width', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="box_shadow_width" name="box_shadow_width" value="<?php echo maxButtonsUtils::strip_px($box_shadow_width) ?>" />px</div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $box_shadow_width_default ?></div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
<?php			
	} // admin fields
 
  } // class  

?>
