<?php
/* A block is a combination of related settings. 

   Blocks are grouped and put into the same Database table row. This way related data, it's executing, display and other decision
   making is seperate from other blocks improving realiability and readability of the code.
*/
abstract class maxBlock
{
	
	protected $data = array();  

	
	/* Constructor for a block 
	
	*/
	function __construct($priority = 10)
	{
		
		// filters for save_post, display etc. Buttons class will the filters. 
		add_filter('mb-save-fields', array($this, 'save_fields'),10,2); 
		add_action('mb-admin-fields', array($this,'admin_fields' ) );
		add_action('mb-data-load', array($this,'set') );
		
		add_filter('mb-parse-button', array($this, 'parse_button'),10,2 ); 
		//add_filter('mb-parse-element-preview', array($this,'parse_element'), 10,2); 
		
		add_filter('mb-css-blocks', array($this, 'parse_css'),10,2 ); 
		add_filter('mb-field-map', array($this, 'map_fields') ); 
		

		$this->fields = apply_filters($this->blockname. "-block-fields",$this->fields); 
		$this->data[$this->blockname] = array(); //empty init
		
	}
 
	/* Save fields runs the POST variable through all blocks
	
	   Taking the post variable from the form, the function will attach the submitted data to the block - field logic and 
	   return a data object to save to the Database. If no value is submitted, the default will be loaded. 
	   
		@param $data Array Data in blockname - field logic format
		@param $post Array $_POST style data
		
		@return $data Array
	*/
	public function save_fields($data, $post)
	{
		if (! isset($this->data[$this->blockname])) 
			return $data; // this block, not here. 
			
		$block = $this->data[$this->blockname]; 

		foreach($this->fields as $field => $options) 
		{
			$default = (isset($options["default"])) ? $options["default"] : ''; 
			
			//$block[$field] = (isset($post[$field])) ? $post[$field] : $default; 
			$block[$field] = (isset($post[$field])) ? sanitize_text_field($post[$field]) : $default; 
		}
 
		$data[$this->blockname] = $block; 
		return $data;	
 
	}
	
	/* Display Block admin interface
		
	   Writes admin interface to output.
	*/
	abstract public function admin_fields();
	
	/* Parse HTML portion of button
	
	   This filter is passed through to modify the HTML parts of the button. 
	   
	   Note: When changing parts of the DomObj writing new tags / DOM to elements, it's needed to regenerate the Object.
	   
	   @param $button DomObj SimpleDOMObject
	   @param $mode String[normal|preview] Flag to check if loading in preview 
	   
	   @return DomObj
	*/
	public function parse_button($button, $mode) { return $button;  } 
	
	/* Parse CSS of the button
	
		This function will go through the blocks, matching the $css definitions of a fields and putting them in the 
		correct tags ( partly using csspart ) . 
		
		@param $css Array [normal|hover|other][cssline] = css declaration
		@param $mode String [normal|preview] 
		
		@return $css Array 
	*/
	public function parse_css($css, $mode = 'normal') { 

		$data = $this->data[$this->blockname]; 

 		// get all fields from this block
 		foreach($this->fields as $field => $field_data)
		{
			// get cssparts, can be comma-seperated value
			$csspart = (isset($field_data["csspart"])) ? explode(",",$field_data["csspart"]) : array('maxbutton'); 
			$csspseudo = (isset($field_data["csspseudo"])) ? explode(",", $field_data["csspseudo"]) : 'normal'; 
			
			// if this field has a css property
			if (isset($field_data["css"])) 
			{
				// get the property value from the data
				$value = isset($data[$field]) ? $data[$field] : ''; 
				$value = str_replace(array(";"), '', $value);  //sanitize
				
				if ( strpos($field_data["default"],"px") && ! strpos($value,"px"))
				{
					if ($value == '') $value = 0; // pixel values, no empty but 0 
					$value .= "px"; 
				}
 				if (isset($data[$field])) 
 				{
	 				 foreach($csspart as $part)
	 				 {
		 					if (is_array($csspseudo)) 
		 					{
		 						foreach($csspseudo as $pseudo)
		 							$css[$part][$pseudo][$field_data["css"]] = $value ; 
		 					}
		 					else
								$css[$part][$csspseudo][$field_data["css"]] = $value ;
					  }
				}
			}
		
		}	

		return $css; 		
	}
	

	/* Map the Block fields  
	
		This function will take the field name and link it to the defined CSS definition to use in providing the live preview in the 
		button editor. I.e. a field with name x will be linked to CSS-property X . Or to a custom Javascript function. 
		
		@param $map Array [$field_id][css|attr|func|] = property/function
		
		@return Array
	*/
	public function map_fields($map) 
	{
		foreach($this->fields as $field => $field_data)
		{
 			if (isset($field_data["css"])) 
			{
				$cssdef = $field_data["css"]; 
				$multidef = explode('-',$cssdef); 
				if ( count($multidef) > 1)
				{
					$cssdef = ""; 
 					for($i = 0; $i < count($multidef); $i++)
 					{	
 						if ($i == 0)	
 							$cssdef .= $multidef[$i];
 						else
 							$cssdef .= ucfirst($multidef[$i]);   
 						//$multidef[$i] . ucfirst($multidef[1]); 
 					}
				}					
				$map[$field]["css"] = $cssdef; 
				if ( strpos($field_data["default"],"px") != false )
					$map[$field]["css_unit"] = 'px'; 
		
			}
			if (isset($field_data["csspart"])) 
				$map[$field]["csspart"] = $field_data["csspart"];		
		}
		return $map; 
		
	}
	
	/* Sets the data
	
		This action is called from button class when data is pulled from the database and populates the dataArray to all blocks
		
	*/
	function set($dataArray)
	{
 
		$this->data = $dataArray;
	}

	/* CSS POST PROCESSOR 
	   This function will gather certain CSS elements and combine them. These element generally don't fix into the regular CSS scheme. 
	   
	   It loads the same data as parse_css, but *after* every other function. 
	   
	   @param $css Array
	   @param $mode [normal|preview]
	   @return $css Array 
	*/
	function post_process_css($css, $mode)  //DEPRECATED in favor of scss
	{		
 		$raw_css = $css;
 		return $css; 
 
		foreach($css as $part => $styles)
		{
			/* Hover part doesn't boost all settings - these are set from normal part */
 
			if ( strpos($part,':hover') !== false ) 
			{

				if (! isset($styles["gradient-start-opacity"])) 
					$styles["gradient-start-opacity"] = $raw_css["normal"]["gradient-start-opacity"];
				if (! isset($styles["gradient-end-opacity"])) 
					$styles["gradient-end-opacity"] = $raw_css["normal"]["gradient-end-opacity"];
				if (! isset($styles["gradient-stop"])) 
					$styles["gradient-stop"] = $raw_css["normal"]["gradient-stop"];
			
				if (! isset($styles["box-shadow-width"])) 
					$styles["box-shadow-width"] = $raw_css["normal"]["box-shadow-width"];
				if (! isset($styles["box-shadow-offset-left"])) 
					$styles["box-shadow-offset-left"] = $raw_css["normal"]["box-shadow-offset-left"];	
				if (! isset($styles["box-shadow-offset-top"])) 
					$styles["box-shadow-offset-top"] = $raw_css["normal"]["box-shadow-offset-top"];	

	 			 
	 			if (! isset($styles["text-shadow-width"])) 
					$styles["text-shadow-width"] = $raw_css["-mb-text"]["text-shadow-width"];
				if (! isset($styles["text-shadow-left"])) 
					$styles["text-shadow-left"] = $raw_css["-mb-text"]["text-shadow-left"];	
				if (! isset($styles["text-shadow-top"])) 
					$styles["text-shadow-top"] = $raw_css["-mb-text"]["text-shadow-top"];	
				
 			}
 
 
			/* End Hover fix */
			
			if (isset($styles["gradient-start-color"])) 
			{
				$start = isset($styles["gradient-start-color"]) ? $styles["gradient-start-color"] : '';
				$end = isset(  $styles["gradient-end-color"]  ) ?  $styles["gradient-end-color"] : ''; 
				$start_opacity = isset(  $styles["gradient-start-opacity"]  ) ?  $styles["gradient-start-opacity"] : ''; 
				$end_opacity = isset(  $styles["gradient-end-opacity"]  ) ?  $styles["gradient-end-opacity"] : ''; 		
				
				$start = maxbuttons_hex2rgba($start, $start_opacity);
				$end = maxbuttons_hex2rgba($end, $end_opacity);		
				$stop =  isset( $styles["gradient-stop"]) ?  $styles["gradient-stop"] : ''; 
		
				$css[$part]["background-color"] = $start; 
				if ( ( $start != '' && $end != '' && $stop != '' ) )
				{
				 $css[$part]["background"] = "linear-gradient( $start $stop%, $end);";  
				 $css[$part]["background"] .= "background: -moz-linear-gradient($start $stop%, $end);";  
				 $css[$part]["background"] .= "background: -webkit-gradient(linear, left top, left bottom, color-stop($stop%, $start), 
				 								color-stop(1, $end));";  			 			 				
		 		 $css[$part]["background"] .= "background: -o-linear-gradient($start $stop%, $end);";  
		 		 $css[$part]["-pie-background"] = "linear-gradient($start $stop%, $end)";
				 
				}							
			
				unset($css[$part]["gradient-start-color"]); 
				unset($css[$part]["gradient-end-color"]); 
				unset($css[$part]["gradient-stop"]); 
				unset($css[$part]["gradient-start-opacity"]); 
				unset($css[$part]["gradient-end-opacity"]); 
			}
		
 
			if (isset($styles["box-shadow-width"])) 
			{
				$width = $styles["box-shadow-width"]; 
				$left = $styles["box-shadow-offset-left"]; 
				$top = $styles["box-shadow-offset-top"]; 
				$color = isset($styles["box-shadow-color"]) ? $styles["box-shadow-color"] : ''; 
				
				if ($color != '') 
					$css[$part]["box-shadow"] = "$left $top $width $color"; 
				unset($css[$part]["box-shadow-width"]); 
				unset($css[$part]["box-shadow-offset-left"]); 
				unset($css[$part]["box-shadow-offset-top"]); 
				unset($css[$part]["box-shadow-color"]); 
			
			}
			if (isset($styles["text-shadow-width"]) ) 
			{
				$width = $styles["text-shadow-width"]; 
				$left = $styles["text-shadow-left"]; 
				$top = $styles["text-shadow-top"]; 
				$color = isset($styles["text-shadow-color"]) ? $styles["text-shadow-color"] : ''; 
				
				if ($color != '')
					$css[$part]["text-shadow"] = "$left $top $width $color"; 
				unset($css[$part]["text-shadow-width"]); 
				unset($css[$part]["text-shadow-left"]); 
				unset($css[$part]["text-shadow-top"]); 
				unset($css[$part]["text-shadow-color"]); 
			
			}		
		
		}				
		
		return $css; 
			
	}
}
?>
