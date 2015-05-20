<?php
/* Class to Parse CSS. Load as array with diffent pseudo-types,
	ability to add nested and new root blocks 
	parses via scss
	ability to use complicated css stuff via scss mixins parsing like gradient
	auto-discovery for -unit field types to set units (like px, or %) 
	auto-discovery of fields via domobj.
	
*/
class maxCSSParser
{
	protected $struct = array(); 
	protected $domObj = '';
	protected $pseudo = array("hover","active","responsive"); 
	
	protected $data; 
	protected $output_css;
	
	protected $inline = array();
	protected $responsive = array();
	
	// settings
	protected $important = false;
	
	// log possible problems and incidents for debugging;
	protected $parse_log = array();
	
	function __construct()
	{
		//$root[] = array("a" => array("hover","active","responsive")); 	

	}
	
	function loadDom($domObj)
	{	
		$this->domObj = $domObj;

		$root = $domObj->find(0,0);
		$struct[$root->tag] = array(); 	 
		
		$children = $root->children();
 
		if (count($children) > 0) 
			$struct[$root->tag] = $this->loadRecursive(array(), $children);
		
		$this->struct = $struct;


	}
	
	function loadRecursive($struct, $children)
	{
		foreach($children as $domChild)
		{

			$class = $domChild->class; 
			$class = str_replace(" ",".", $class); // combine seperate classes 
					
  			$struct[$class]["tag"] = $domChild->tag; 
 
			$child_children = $domChild->children(); 

			if (count($child_children) > 0) 
			{
				 
				$struct[$class]["children"] = $this->loadRecursive(array(), $child_children);
			}
		}
 
		return $struct;
	}
	
		
	function parse($data)
	{	
		$this->clear(); 
		
		$struct = $this->struct; 
		$this->data = $data; 
	
 
 		if (isset($data["settings"]))  // room for settings in parser
 		{
 			$settings = $data["settings"];
 			$this->important = (isset($settings["important"])) ? $settings["important"] : false; 
 			
 			unset($this->data["settings"]); 
 		}

 		
		$elements = array_shift($struct); // first element is a 'stub' root.  

		foreach($elements as $el => $el_data)
		{
			maxButtonsUtils::addTime("CSSParser: Parse $el ");
			$this->parse_part($el,$el_data); 		
		}

		
		$this->parse_responsive();
		maxButtonsUtils::addTime("CSSParser: Parsed responsive ");

 
 
 
		$css = $this->compile($this->output_css);
		maxButtonsUtils::addTime("CSSParser: Compile done ");

		return $css;
 
	}
	
	// reset output values. 
	protected function clear() 
	{
		$this->data = ''; 
		$this->output_css = ''; 
		$this->inline = array();
		$this->responsive = array();
	
	}
	
	protected function compile($css)
	{
		$scss = new scssc();
		$scss->setImportPaths(maxButtons::get_plugin_path() . "assets/");
		//$scss->setFormatter('scss_formatter_compressed');
		
		$compile = " @import 'mixins.scss';  " . $css;
		maxButtonsUtils::addTime("CSSParser: Compile start ");
 
		
		try
		{
			$css = $scss->compile($compile);
		} catch (Exception $e) { 
			$css = $this->output_css; 
		 } 
		
		maxButtonsUtils::addTime("CSSParser: Compile end ");

		return $css;
	}
	
	function parse_part($element, $el_data, $el_add = '')
	{
		$tag = $el_data["tag"]; 
		$element_data = $this->findData($this->data, $element);

		// not using scss selectors here since there is trouble w/ the :pseudo selector, which should be put on the maxbutton / a tag.  		
		if ($element != '')
		{	$el_add .= " ." . $element;
 	
 		}
	 	if (isset($element_data["responsive"])) 
	 	{
	 		$responsive = $element_data["responsive"]; // doing that at the end
	 		unset($element_data["responsive"]); 
 
	 		$this->responsive[$el_add] = $responsive;
	 	}
	 
		foreach($element_data as $pseudo => $values)
		{
			
			if ($pseudo != 'normal') 
			{
				$ps_selector = preg_replace('/.maxbutton$|.maxbutton /i',".maxbutton:$pseudo ",$el_add);
				
				$this->output_css .= " $ps_selector { "; 
			}
			else {
				$this->output_css .= " $el_add { ";
			}
			
			$values = $this->doMixins($values);

			foreach($values as $cssTag => $cssVal)
			{
 
				$statement =  $this->parse_cssline($values, $cssTag,$cssVal); ///"$cssTag $css_sep $cssVal$unit$css_end ";
				if ($statement)
				{
					$this->output_css .= $statement ;
		
					if (! isset($this->inline[$pseudo][$element])) $this->inline[$pseudo][$element] = '';
					$this->inline[$pseudo][$element] .= $statement;
				} 
			}

		 	$this->output_css .= " } "; 
		}
			if (isset($el_data["children"])) 
			{
				foreach($el_data["children"] as $child_id => $child_data)
				{
 
					$this->parse_part($child_id, $child_data, $el_add);
				}
			}

	}
	
	function parse_cssline($values, $cssTag, $cssVal, $css_end = ';')
	{

		// unit check - two ways; either unitable items is first or unit declaration.
		if (isset($values[$cssTag . "_unit"])) 
		{
			$unit = $values[$cssTag . "_unit"]; 
		}
		elseif(strpos($cssTag, "_unit") !== false)
		{
			return false; // no print, should be found under first def.					
		}
		else $unit = '';
		

		$important = ($this->is_important()) ? " !important" : ""; 
		$important = ($cssTag == '@include') ? "" : $important; // mixin's problem, no checking here. 
		
		$css_sep = ($cssTag == '@include') ? $css_sep = '' : ':';
			
		if($cssVal != '' && $cssTag != '')
		{
			$statement = "$cssTag $css_sep $cssVal$unit$important$css_end ";
			return $statement;
		}
		return false;
		
	}
	
	function parse_responsive()
	{

		$responsive = $this->responsive; 
		if (! is_array($responsive) || count($responsive) == 0) 
			return;  

		$media_queries = maxButtonsUtils::get_media_query(2); // query names
					
		$output = ''; 
		
		$query_array = array(); 
	
		
		foreach($responsive as $element => $queries)
		{
			foreach($queries as $query => $qdata)
			 foreach($qdata as $index => $data)
			{{
				$query_array[$query][$index][$element] = $data; 
			
			}}
		}
		
		foreach($query_array as $query => $vdata):
			foreach($vdata as $index => $data):
		 
			if ($query == 'custom') 
			{
				foreach($data as $element => $values):
				//	foreach($vdat as $index => $values):
				
					if (isset($values["custom_maxwidth"])) 
					{
						$minwidth = $values["custom_minwidth"];
						$maxwidth = $values["custom_maxwidth"]; 
						unset($data[$element]["custom_minwidth"]); 
						unset($data[$element]["custom_maxwidth"]);
						$qdef = "only screen and (min-width: $minwidth" . "px) and (max-width: $maxwidth" . "px)";  
						break;
					}	
				//   endforeach;
				endforeach;		
			}
			else
				$qdef = $media_queries[$query]; 
			
			
			$output .= "@media ". $qdef . " { "; 
			
			foreach($data as $element => $values):
			 //foreach($vdat as $index => $values):
				$output .= $element . " { "; 
				$css_end = ';';
				
				// same as parse part, maybe merge in future
				foreach($values as $cssTag => $cssVal)
				{
					// unit check - two ways; either unitable items is first or unit declaration.
					$statement =  $this->parse_cssline($values, $cssTag,$cssVal);
					if($statement)
						$output .= $statement;
					
				}

				$output .= " } "; 
			// endforeach;
			endforeach;
			$output .= " } ";  
		
		  endforeach;
		endforeach;
 
		$this->output_css .= $output;
	}
	
	private function is_important()
	{

		if ($this->important == 1)
			return true;
		else 
			return false;
	}
	
	function findData($data, $el)
	{
		$classes = explode(".", $el); 

		foreach($data as $part => $values) 
		{
			if (in_array($part, $classes))
				return $data[$part];
		}
 		return array();
	}
	
	function doMixins($values)
	{
		$mixins = array("gradient", "box-shadow", "text-shadow");
 
		foreach($mixins as $mixin) 
		{

			$results = preg_grep("/^$mixin/i",array_keys($values) );
			$mixin_array = array();
		 	foreach($results as $result)
		 	{
		 		$mixin_array[$result] = $values[$result]; 
		 	}
		 	
			if (count($mixin_array) > 0)
			{
				switch($mixin)
				{
					case "gradient": 
						$values = $this->mixin_gradient($mixin_array, $values);
				
					break;
					case "box-shadow": 
						$values = $this->mixin_boxshadow($mixin_array, $values);
					break;	
					case "text-shadow": 
						$values = $this->mixin_textshadow($mixin_array, $values);
					break;
				}
			}

		
		} 
		return $values;
	}
	
	function mixin_gradient($results, $values)
	{

		$start = isset($results["gradient-start-color"]) ? $results["gradient-start-color"] : '';
		$end = isset(  $results["gradient-end-color"]  ) ?  $results["gradient-end-color"] : ''; 
		$start_opacity = isset(  $results["gradient-start-opacity"]  ) ?  $results["gradient-start-opacity"] : ''; 
		$end_opacity = isset(  $results["gradient-end-opacity"]  ) ?  $results["gradient-end-opacity"] : ''; 		
		$stop =  (isset( $results["gradient-stop"]) && $results["gradient-stop"] != '') ?  $results["gradient-stop"] . "%" : '45%'; 
		
		$start = maxButtonsUtils::hex2rgba($start, $start_opacity);
		$end = maxButtonsUtils::hex2rgba($end, $end_opacity);		
		
		$important = ($this->is_important()) ? "!important" : "";

		
		$values = $this->add_include($values, "linear-gradient($start,$end,$stop,$important)");			
		$values = array_diff_key($values, $results);
 
		return $values;
 
	}
	
	function mixin_boxshadow($results, $values)
	{
		$width = $results["box-shadow-width"]; 
		$left = $results["box-shadow-offset-left"]; 
		$top = $results["box-shadow-offset-top"]; 
		$color = isset($results["box-shadow-color"]) ? $results["box-shadow-color"] : ''; 
		
		$important = ($this->is_important()) ? "!important" : ""; 
		
		if ($color != '' && $width > 0)		
			$values = $this->add_include($values, "box-shadow($left, $top, $width, $color $important) ");			
	
		$values = array_diff_key($values, $results);

		return $values; 		
	}
	
	function mixin_textshadow($results, $values)
	{
		
		$width = isset($results["text-shadow-width"]) ? $results["text-shadow-width"] : 0; 
		$left = isset($results["text-shadow-left"]) ? $results["text-shadow-left"] : 0; 
		$top = isset($results["text-shadow-top"]) ? $results["text-shadow-left"] : 0; 
		$color = isset($results["text-shadow-color"]) ? $results["text-shadow-color"] : ''; 
		$important = ($this->is_important()) ? "!important" : ""; 
				
		if ($color != '' && $width > 0)
			$values = $this->add_include($values, "text-shadow ($left,$top,$width,$color $important)"); 
		
		$values = array_diff_key($values, $results);
		
		return $values;
	}
	
	private function add_include($values, $include)
	{
		if (isset($values["@include"])) 
			$values["@include"] .= "; @include " . $include; 
		else
			$values["@include"] = $include; 	
		return $values; 
	}
	
	function outputInline($domObj, $pseudo = 'normal')
	{
		$domObj = $domObj->load($domObj->save());
		
		$inline = $this->inline;
		
		// ISSUE #43 Sometimes this breaks 
		if (! isset($inline[$pseudo])) 
			return $domObj;
		
		foreach($inline[$pseudo] as $element => $styles)
		{
			//$element = $element[$pseudo];
			$normstyle = ''; 
			if ($pseudo != 'normal') // parse all possible missing styles from pseudo el.
				$normstyle = $this->compile($inline['normal'][$element]); 
			
			maxButtonsUtils::addTime("CSSParser: Parse inline done");
			
			$styles = $normstyle . $this->compile($styles);
			
			$element = trim(str_replace("."," ", $element)); // molten css class, seperator. 
		
			$el = $domObj->find('[class*="' . $element . '"]', 0);
			if (is_null($el)) echo "NULL"; 
			$el->style = $styles;
		
		}
		
		return $domObj;
		
	}	
	
	function output() 
	{
		
	
	}
	
}

class compileException extends Exception { 
	protected $code = -1;

}


?>
