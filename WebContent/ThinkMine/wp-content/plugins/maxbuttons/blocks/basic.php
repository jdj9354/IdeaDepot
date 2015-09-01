<?php
$blockClass["basic"] = "basicBlock"; 
$blockOrder[0][] = "basic"; 

class basicBlock extends maxBlock 
{
	protected $blockname = "basic"; 
	protected $fields = array("name" => array("default" => ''),
							  "status" => array("default" => "publish"), 
							  "description" => array("default" => ''),
							  "url" => array("default" => ''),
							//  "text" => array("default" => ''), 
							  "new_window" => array("default" => 0),
							  "nofollow" => array("default" => 0)
							 ); 
	

	function __construct()
	{
		parent::__construct();
		add_filter('mb-css-blocks', array($this, 'post_process_css'), 1000, 2);  // run once
		//$this->fields = apply_filters($this->blockname. "-block-fields",$this->fields); 
		//$this->data[$this->blockname] = array(); //empty init
 		
	}
	
/*	public function save_fields($post) 
	{
		return parent::save_fields$po0st];
	}
*/	

	public function parse_css($css,  $mode = 'normal')
	{
		$data = $this->data[$this->blockname]; 
			
		$css["maxbutton"]["normal"]["position"] = "relative";
		$css["maxbutton"]["normal"]["text-decoration"] = "none";
//		$css["maxbutton"]["normal"]["white-space"] = "nowrap";  // hinders correct rendering of oneline-multilines
		$css["maxbutton"]["normal"]["display"] = "inline-block"; 

		if ($data["url"] == '') // don't show clickable anchor if there is no URL. 
		{
			$css["maxbutton"]["normal"]["cursor"] = 'default'; 
		//	$css[":hover"]["cursor"] = 'default'; 
		}	
		return $css; 
	
	}
	
	public function save_fields($data, $post)
	{	
		// Possible solution: 
		$post["url"] = isset($post["url"]) ? urldecode(urldecode($post["url"])) : '';
 
		$data = parent::save_fields($data, $post);
		if (isset($post["name"])) 
			$data["name"] = sanitize_text_field($post["name"]); 
		if (isset($post["status"])) 
			$data["status"] = sanitize_text_field($post["status"]); // for conversion old - new. 
 		return $data;
	}

	public function parse_button($domObj, $mode = 'normal')
	{
 
		$data = $this->data[$this->blockname]; 
		
		$anchor = $domObj->find("a",0); 		
		
 
		if ($data["nofollow"] == 1) 
			$anchor->rel = "nofollow";
		//	$buttonAttrs[] = "rel=nofollow"; 
		if ($data["new_window"] == 1) 
			$anchor->target = "_blank"; 
							
		if ($data["url"] != '') 
			$anchor->href = do_shortcode($data["url"]); 
		else  // fixing an iOS problem which renders anchors without URL wrongly. 
		{
			$anchor->href = 'javascript:void(0);';
		}	
 
		 
		return $domObj; 
			
	} 

	public function map_fields($map)
	{
		
		$map["url"]["attr"] = "href"; 
//		$map["text"]["func"] = "updateAnchorText"; 
		
		return $map; 
	}

	public function admin_fields() 
	{
		//parent::admin_fields();
 
		$data = $this->data[$this->blockname]; 
 
		foreach($this->fields as $field => $options)
		{		
 	 	    $default = (isset($options["default"])) ? $options["default"] : ''; 
			${$field} = (isset($data[$field])) ? $data[$field] : $default;
		
		}
 
?>

		<div class="option-container">
				<div class="title"><?php _e('Basics', 'maxbuttons') ?></div>
				<div class="inside">
					<div class="option">
						<div class="label"><?php _e('Name', 'maxbuttons') ?></div>
						<div class="note"><?php _e('Something that you can quickly identify the button with.', 'maxbuttons') ?></div>
						<div class="clear"></div>
						<div class="input">
							<input type="text" id="name" name="name" value="<?php echo esc_html($name) ?>" maxlength="100" class="input_name" />
						</div>
					</div>
					
					<div class="option">
						<div class="label"><?php _e('Description', 'maxbuttons') ?></div>
						<div class="note"><?php _e('Brief explanation about how and where the button is used.', 'maxbuttons') ?></div>
						<div class="clear"></div>
						<div class="input">
							<textarea id="description" name="description" class="nput_description"><?php echo esc_html($description) ?></textarea>
						</div>
					</div>
					
					<div class="option">
						<div class="label"><?php _e('URL', 'maxbuttons') ?></div>
						<div class="note"><?php _e('The link when the button is clicked.', 'maxbuttons') ?></div>
						<div class="clear"></div>
						<div class="input">
							<input type="text" id="url" name="url" value="<?php echo esc_url($url) ?>" maxlength="500" class="input_url"/>
						</div>
					</div>
 
					
					<div class="option-design">
						<div class="label"><?php _e('Open in New Window', 'maxbuttons') ?></div>
						<div class="input">
							<input type="checkbox" id="new_window" name="new_window" value="1" <?php checked($new_window, 1) ?> >
						</div>
						<div class="clear"></div>
					</div>
					
					<div class="option-design">
						<div class="label"><?php _e('Use rel="nofollow"', 'maxbuttons') ?></div>
						<div class="input">
							<input type="checkbox" id="nofollow" name="nofollow" value="1" <?php checked($nofollow, 1) ?> >
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
<?php }  // admin_display
		 
 } // class 
 
 ?>
