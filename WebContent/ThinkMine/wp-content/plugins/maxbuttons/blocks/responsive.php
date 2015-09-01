<?php
$blockClass["responsive"] = "responsiveBlock"; 
$blockOrder[20][] = "responsive"; 

class responsiveBlock extends maxBlock 
{
	protected $blockname = 'responsive'; 
	protected $fields = array("options" => '',
							  "auto_responsive" => array("default" => 1),
							  "media_query" => array("default" => array()
							  				), 
							  
							  
							  
							  ); 
	// multifields for manual conversion // define +/- the same as normal fields. 
	// to find solution in parsing stuff back to button.
	protected $multi_fields = array("mq_button_width" => array("default" => 0, 
															   "css" => "width", 
															   "csspseudo" => "responsive", 
															   
															),
									"mq_button_width_unit" => array("default" => 'px', 
																	"css" => "width_unit",
																	"csspseudo" => "responsive",
															), 
									"mq_container_width" => array("default" => 0, 
																"css" => "width",
																"csspart" => "mb-container",
																"csspseudo" => "responsive",
															),
									"mq_container_float" => array("default" => "", 
																"css" => "float", 
																"csspart" => "mb-container",
																"csspseudo" => "responsive",
														),
									"mq_container_width_unit" => array("default" => "px",
																	"css" => "width_unit",
																	"csspart" => "mb-container", 
															), 
									"mq_font_size" => array("default" => 90, 
															"css" => "font-size", 
															"csspart" => "mb-text",
														),						
									"mq_font_size_unit" => array("default" => "%", 
															    "css" => "font-size_unit", 
															    "csspart" => "mb-text"), 
															 					
									"mq_custom_minwidth" => array("default" => 0, 
															  "css" => "custom_minwidth"), 
									"mq_custom_maxwidth" => array("default" => 0, 
															  "css" => "custom_maxwidth"),
									); 
	
	
	public function parse_css($css, $mode = 'normal')
	{
		if ($mode != 'normal') 
			return $css;
		
		if (! isset($data[$this->blockname])) 
			return $css; 
				
		$data = $this->data[$this->blockname];

 		
		if (isset($data["auto_responsive"]) && $data["auto_responsive"] == 1)
		{	// generate auto_rules for responsive.
			$css["maxbutton"]["responsive"]["phone"][0]["width"] = "90%"; 
			$css["mb-container"]["responsive"]["phone"][0]["width"] = "90%"; 
 			$css["mb-container"]["responsive"]["phone"][0]["float"] = "none"; 
 			$css["mb-text"]["responsive"]["phone"][0]["font-size"] = "90%"; 
 			
 			 
 			if ( isset($this->data["text"]["font_size"]) )
 			{
	 			$css["mb-text"]["responsive"]["phone"][0]["font-size"] = floor(intval($this->data["text"]["font_size"]) * 0.8) . 'px';  				
 			}
 			
		}
		
		if (! isset($data["media_query"]))
 			return $css;
 			
		foreach($data["media_query"] as $query => $data ):
			$i = 0;
			
			foreach($data as $index => $fields):
			
		
			foreach($fields as $field => $value)
			{
				$csspart = (isset($this->multi_fields[$field]["csspart"])) ? $this->multi_fields[$field]["csspart"] : 'maxbutton' ; 
				$css_stat = $this->multi_fields[$field]["css"]; 

				
				if ($value == '' || $value == '0') 
				{  }
				elseif ($query != 'custom' && ($field == 'mq_custom_maxwidth' || $field == "mq_custom_minwidth")) 
				{ } // skip custom fields on noncustom query
				else
				{
					$css[$csspart]["responsive"][$query][$i][$css_stat] = $value; 
				}
				
			}
			$i++;
			endforeach;
		endforeach;


		return $css;
	}
	

	public function save_fields($data, $post)
	{
 
		$queries = (isset($post["media_query"])) ? $post["media_query"] : null; 
		$media_queries = array(); 
		
		if (is_null($queries))
			return $data; 

	
		foreach($queries as $i => $query)
		{
 
			if ($query != '')
			{
				//$media_queries[$query] = array(); 
			
				// collect the other fields. 
				$c = isset($media_queries[$query]) ? count($media_queries[$query]) : 0; 
				
				foreach($this->multi_fields as $field => $values)
				{
					if (isset($post[$field][$i])) 
					{

						$media_queries[$query][$c][$field] = $post[$field][$i]; 
					}
				}
			}
		}
		
	 
		$data[$this->blockname]["media_query"] = $media_queries;
		
		$data[$this->blockname]["auto_responsive"] = (isset($post["auto_responsive"])) ? $post["auto_responsive"] : 0; 
		
		return $data;
		
	}

	
	public function admin_fields()
	{
		$data = $this->data[$this->blockname];
		
		$media_names =  maxButtonsUtils::get_media_query(1); // nicenames
		$media_desc = maxButtonsUtils::get_media_query(3);
		$units = array("px" => __("px","maxbuttons"),
					   "%" => __("%","maxbuttons")
					  );
		$container_floats = array(
							"" => "",
							"none" => __("None","maxbuttons"), 
							"left" => __("Left","maxbuttons"), 
							"right" => __("Right","maxbuttons"),
						);
	
		foreach($this->fields as $field => $options)
		{		
 	 	    $default = (isset($options["default"])) ? $options["default"] : ''; 
			$$field = (isset($data[$field])) ? $data[$field] : $default;
			${$field  . "_default"} = $default; 
		}
		
		// sorting routine via array merge. 
		$fk = array_flip(array_keys($media_query)); 
		$names_used = array_intersect_key($media_names,$fk);		 
 		$media_query = array_merge($names_used,$media_query);

?>
			<div class="option-container">
				<div class="title"><?php _e('Responsive Settings', 'maxbuttons') ?></div>
				<div class="inside">
					<p><?php _e("Responsive settings let you decide the behavior of the button on different devices and screen sizes. For instance large buttons on small screens","maxbuttons") ?></p>
					<div class="option-design"> 
						<div class="label"><?php _e("Auto Responsive", 'maxbuttons') ?> <?php _e("(Experimental)","maxbuttons") ?></div>

						<div class="input"> 
							<input type='checkbox' name='auto_responsive' value='1' <?php checked(1, $auto_responsive); ?> >
						</div>

											<div class="clear"></div>
						<p><strong>Note: </strong> Auto responsive setting will take a guess only on small screens. To control your responsive settins uncheck this button. This will show more options</p>	
					</div>
 
					
				<div class='option-design media_queries_options'>
					<?php
					
					foreach($media_query as $item => $data):
						foreach ($data as $index => $fields):

						?>
						<div class='media_query'> 
							<span class='removebutton'><img src="<?php echo maxButtons::get_plugin_url() ?>/assets/icons/remove.png"></span>
							
							<input type="hidden" name="media_query[]" value="<?php echo $item ?>"> 
							<label class='title'><?php echo $media_names[$item] ?></label>
							<p class='description'><?php echo $media_desc[$item] ?></p>							
							<?php 
								if ($item == "custom") { $custom_class = ''; } else { $custom_class = 'hidden'; }
								 
							?>
							<div class="custom" <?php echo $custom_class ?> > 
								<div class="label"><?php _e("Min width","maxbuttons") ?></div>								
								<div class="input"><input type="text" class="tiny" name="mq_custom_minwidth[]" value="<?php echo $fields["mq_custom_minwidth"] ?>" />px</div> 
								
								<div class="label max"> <?php _e("Max width","maxbuttons"); ?></div>
								<div class="input max"><input type="text" class="tiny" name="mq_custom_maxwidth[]" value="<?php echo $fields["mq_custom_maxwidth"] ?>" />px</div> 

								
							</div>	
						
							<div class='label'><?php _e("Font size","maxbuttons") ?></div>
							<div class='input'><input type='text' name='mq_font_size[]' class='tiny' value="<?php echo $fields["mq_font_size"] ?>"> <?php echo maxButtonsUtils::selectify("mq_font_size_unit[]",$units,$fields["mq_font_size_unit"]) ?>
							</div>	
						
							<div class='label'><?php _e("Button width", 'maxbuttons') ?></div>
							
							<div class='input'><input type='text' name="mq_button_width[]" value="<?php echo $fields["mq_button_width"] ?>" class='tiny'> <?php echo maxButtonsUtils::selectify("mq_button_width_unit[]",$units,$fields["mq_button_width_unit"]) ?></div>
							
							<div class='label'><?php _e("Container width", 'maxbuttons'); ?></div>
							
							<div class='input'><input type='text' name="mq_container_width[]" value="<?php echo $fields["mq_container_width"] ?>" class='tiny'> <?php echo maxButtonsUtils::selectify("mq_container_width_unit[]",$units,$fields["mq_container_width_unit"]); ?>
							</div>
							
							<div class='label'><?php _e("Container float", "maxbuttons"); ?></div>
							<div class="input"><?php echo maxButtonsUtils::selectify("mq_container_float[]",$container_floats, $fields["mq_container_float"]) ?></div>
							
							
								
						</div>
					 
						<?php
						if ($item != 'custom')
							unset($media_names[$item]); // remove existing queries from new query selection
					endforeach;
						endforeach;	
					
					
					?>

					<div class="new_query_space"></div>
					<div class="clear"></div>					
					<div class="option-design new-query">
						<div class="label"><?php _e('New Query', 'maxbuttons') ?></div>
						
 
						<div class="input">
							<?php echo maxButtonsUtils::selectify("new_query",$media_names,'' ); ?>
							<a class="button add_media_query"><?php _e("Add","maxbuttons") ?></a>
						</div>
						
 
						<div class="clear"></div>
					</div>
				 </div>		
			</div> <!-- inside --> 
		
			<div class='media_option_prot'>
				<div class='media_query'> 
							<span class='removebutton'><img src="<?php echo maxButtons::get_plugin_url() ?>/assets/icons/remove.png"></span>
							<input type="hidden" name="media_query[]" value=""> 
							<label class='title'></label>
							<p class='description'>Description here</p>
							
							<div class="custom"> 
								<div class="label"><?php _e("Min width","maxbuttons") ?></div>								
								<div class="input"><input type="text" class="tiny" name="mq_custom_minwidth[]" value="0" />px</div> 
								
								<div class="label max"> <?php _e("Max width","maxbuttons"); ?></div>
								<div class="input max"><input type="text" class="tiny" name="mq_custom_maxwidth[]" value="0" />px</div> 

								
							</div>	
							<div class='label'><?php _e("Font size","maxbuttons") ?></div>
							<div class='input'><input type='text' name='mq_font_size[]' class='tiny' value="90"> <?php echo maxButtonsUtils::selectify("mq_font_size_unit[]",$units,"%") ?>
							</div>	
												
							<div class='label'><?php _e("Button width", "maxbuttons") ?></div>
							<div class='input'><input type='text' name="mq_button_width[]" value="0" class='tiny'> <?php echo maxButtonsUtils::selectify("mq_button_width_unit[]",$units,""); ?></div>
							<div class='label'><?php _e("Container width", "maxbuttons"); ?></div>
							<div class='input'>
							<input type='text' name="mq_container_width[]" value="0" class='tiny'> <?php echo maxButtonsUtils::selectify("mq_container_width_unit[]",$units,""); ?>
							</div>

							<div class='label'><?php _e("Container float", "maxbuttons"); ?></div>
							<div class="input"><?php echo maxButtonsUtils::selectify("mq_container_float[]",$container_floats, "") ?></div>
														
				`</div>

			</div>
			<div id="media_desc">
			<?php foreach($media_desc as $key => $desc)
			{
				echo "<span id='$key'>$desc</span>";
			
			}
			?>
			</div>
			

		</div> <!-- container --> 
		
				

			
<?php	
	}

} // class

?>
