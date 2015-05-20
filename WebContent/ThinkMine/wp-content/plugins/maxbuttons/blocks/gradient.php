<?php
$blockClass["gradient"] = "gradientBlock"; 
$blockOrder[5][] = "gradient";
 


class gradientBlock extends maxBlock 
{
	protected $blockname = "gradient"; 
	protected $fields = array("gradient_stop" => array("default" => "45",
													   "css" => "gradient-stop",
													   "csspseudo" => "normal,hover", 
													   ),

						"gradient_start_opacity" => array("default" => "100", 
														"css" => "gradient-start-opacity"),
						"gradient_end_opacity" => array("default" => "100", 
														"css" => "gradient-end-opacity"),
						"gradient_start_opacity_hover" => array("default" => "100", 
														 "css" => "gradient-start-opacity",
														 "csspseudo" => "hover"), 
						"gradient_end_opacity_hover" => array("default" => "100",
													    "css" => "gradient-end-opacity", 
													    "csspseudo" => "hover"),
	
						); 
	

	public function map_fields($map)
	{
		
		$map["gradient_stop"]["func"] = "updateGradientOpacity"; 
		$map["gradient_start_opacity"]["func"] = "updateGradientOpacity"; 
		$map["gradient_end_opacity"]["func"] = "updateGradientOpacity"; 
		$map["gradient_start_opacity_hover"]["func"] = "updateGradientOpacity"; 
 		$map["gradient_end_opacity_hover"]["func"] = "updateGradientOpacity"; 
		
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
?>		
<div class="option-container gradient-options">
				<div class="title"><?php _e('Gradients and Opacity', 'maxbuttons') ?></div>
				<div class="inside">
					<div class="option-design">
						<div class="label"><?php _e('Gradient Stop', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="gradient_stop" name="gradient_stop" value="<?php echo $gradient_stop ?>" maxlength="2" /></div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $gradient_stop_default ?> (1 - 99 accepted)</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Gradient Start Opacity', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="gradient_start_opacity" name="gradient_start_opacity" value="<?php echo $gradient_start_opacity ?>" maxlength="3" /></div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $gradient_start_opacity_default ?> (0 - 100 accepted)</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Gradient End Opacity', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="gradient_end_opacity" name="gradient_end_opacity" value="<?php echo $gradient_end_opacity ?>" maxlength="3" /></div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $gradient_end_opacity_default ?> (0 - 100 accepted)</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Gradient Start Opacity Hover', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="gradient_start_opacity_hover" name="gradient_start_opacity_hover" value="<?php echo $gradient_start_opacity_hover ?>" maxlength="3" /></div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $gradient_start_opacity_hover_default ?> (0 - 100 accepted)</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Gradient End Opacity Hover', 'maxbuttons') ?></div>
						<div class="input"><input class="tiny-nopad" type="text" id="gradient_end_opacity_hover" name="gradient_end_opacity_hover" value="<?php echo $gradient_end_opacity_hover ?>" maxlength="3" /></div>
						<div class="default"><?php _e('Default:', 'maxbuttons') ?> <?php echo $gradient_end_opacity_hover_default ?> (0 - 100 accepted)</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
<?php 
} // admin_fields

} // class


?>
