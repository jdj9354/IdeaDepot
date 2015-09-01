<?php
$blockClass["advanced"] = "advancedBlock"; 
$blockOrder[10][] = "advanced"; 

class advancedBlock extends maxBlock 
{
	protected $blockname = "advanced"; 
	protected $fields = array("important_css" => array("default" => "0"),
						"external_css" => array("default" => "0"),

  						
						); 
	
 	public function __construct()
 	{
 		parent::__construct(); 
 		add_filter('mb-css-blocks', array($this, 'parse_css_advanced'), 1001, 2);  // run once
 		//add_filter('mb-css-blocks', array($this, 'preview_external_css'), 100 )
	}
	
	public function parse_css($css,  $mode = 'normal')
	{
		$css = parent::parse_css($css);
		$data = $this->data[$this->blockname]; 
		
		if (isset($data["important_css"]) && $data["important_css"] == 1)
		{
			$css["settings"]["important"] = 1; 
		}	

		return $css; 	
	}
	
	public function parse_css_advanced($css, $mode)
	{
		$data = $this->data[$this->blockname]; 
		if (isset($data["external_css"]) && $data["external_css"] == 1 && $mode == 'normal') 
		{
 
			return array(
				"normal" => array(), 
				"hover" => array());
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
				<div class="title"><?php _e('Advanced', 'maxbuttons') ?></div>
				<div class="inside">					
					<div class="option-design">
						<p class="note"><?php _e('Adding !important to the button styles can help avoid potential conflicts with your theme styles.', 'maxbuttons') ?></p>
						<div class="label"><?php _e('Use !important', 'maxbuttons') ?></div>
						<div class="input"><input type="checkbox" value="1" id="important_css" name="important_css" <?php checked($important_css,1) ?>></div>
						<div class="clear"></div>
					</div>
					
					<div class="spacer big"></div>
					
					<div class="option-design">
						<p class="note"><?php _e('By default, the CSS styles for the button are rendered within a &lt;style&gt; block in the HTML body. Enabling the "Use External CSS" option allows you to put the CSS code for the button into your theme stylesheet instead.', 'maxbuttons') ?></p>
						<div class="label"><?php _e('Use External CSS', 'maxbuttons') ?></div>
						<div class="input"><input type="checkbox" id="external_css" name="external_css" value="1" <?php checked($external_css,1) ?>></div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label">&nbsp;</div>
						<div class="input"><a id="view_css_modal" name="view_css" href="#view_css" class="button" rel="leanModal"><?php _e('View CSS', 'maxbuttons') ?></a></div>
						<div class="clear"></div>
						
						
					
						<div id="view_css">
							<div class="note">
								<p><?php _e('If the "Use External CSS" option is enabled for this button, copy and paste the CSS code below into your theme stylesheet.', 'maxbuttons') ?></p>
							</div>
							<textarea id="maxbutton-css">
							<?php 
								if (isset($this->data["id"]))
								{
									$id = $this->data["id"];
									$b = new maxButton(); 

									$b->set($id);
									$b->parse_button();
									$b->parse_css("preview"); 

									echo $b->getparsedCSS();
									
								}
 								else
 								{ _e("Please save the button first","maxbuttons"); }
								
							 ?></textarea>
						</div>

					</div>
				</div>
			</div>

<?php 
} // admin_fields

} // class

?>
