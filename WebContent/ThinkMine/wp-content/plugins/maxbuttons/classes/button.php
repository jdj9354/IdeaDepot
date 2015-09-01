<?php
/* Datamodel and base functionality for a button 

*/
 
class maxButton
{
	protected $id = 0; 
	protected $name = '';  
	protected $status = ''; 
	protected $description = ''; 
	protected $cache = ''; 
	
	protected $button_loaded = false;

	protected $data = array(); 
	protected $blocks; //= array('basic', 'text' , 'border', 'color', 'gradient', 'container', 'advanced', 'responsive'); // Blocks

	protected $wpdb = ''; 
	
	protected $button_css = array('normal' => array() ,':hover' => array() ,':visited' => array(), "responsive" => array()); 
	protected $button_js = array(); 
	
	// output conditions
	protected $load_css = 'footer';  // [ footer, inline, external, element ] 
	protected $load_js  = 'footer'; 
	
	protected $cssParser = false; 
	protected $parsed_css = ''; 
	/* Class constructor 
	   
	   Get als loads the various blocks of which a button is built up. Blocks can be added and removed using the mb-init-blocks filter
	*/
	function __construct()
	{
		maxButtonsUtils::addTime("Button construct");
		
		global $wpdb; 
		$this->wpdb = $wpdb; 
		
		// the parser
 
		// get all files from blocks map 
		
		// get all blocks via apply filters, do init. Init should not load anything big. 
		
		require_once("block.php"); 
		
		$block_paths = apply_filters('mb-block-paths',  array(maxButtons::get_plugin_path() . "blocks/") );
		 
		global $blockClass; // load requires only once

		if ($blockClass == '' || count($blockClass) == 0)
		{ 
		
			$newBlocks = array();
			
			foreach($block_paths as $block_path)
			{
				$dir_iterator = new RecursiveDirectoryIterator($block_path, FilesystemIterator::SKIP_DOTS);
				$iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::SELF_FIRST);
		
				foreach ($iterator as $fileinfo)
				{
					$block = $fileinfo->getFilename();

					if (file_exists($block_path . $block))
					{
						 require_once( $block_path . $block);
					}
				}

			}
				ksort($blockOrder);
				foreach($blockOrder as $prio => $blockArray)
				{
					foreach($blockArray as $block)
					{
						if (isset($blockClass[$block]))
							$newBlocks[$block] = $blockClass[$block]; 
					
					}
				}
				$blockClass = $newBlocks;
				$this->loadBlockClasses($blockClass); 
		} 
		
		$this->blocks = array_keys($blockClass);

	}
	
	/* Makes overriding block features possible by subclass
	
	*/
	private function loadBlockClasses($classes)
	{
		// set blocks to the 'block name' that survived. 
		maxButtonsUtils::addTime("Load Block classes"); 
		
		foreach($classes as $block => $class)
		{
			$block = new $class(); 
 
		}
 
	}
	
	/* Simple function to retrieve loaded blocks */ 
	public function getDefinedBlocks() 
	{
		return $this->blocks;
	}
	
	/*  Get Data from Database and set variables
	
		You can pass either id or name to this function
	
		@return Boolean Returns false when no data was found using either ID or name
	*/
	function set($id = 0, $name = '', $status = 'publish')
	{
		maxButtonsUtils::addTime("Button set $id");
		

		
 		$id = intval($id);
 		$name = sanitize_text_field($name);
 		$status = sanitize_text_field($status);
 		
		global $wpdb;
		$this->clear(); // clear the internals of any previous work 
		
		// check to see if the value passed is NOT numeric. If it is, use title, else assume numeric
		if($id == 0 && $name != '') {
			$row = $wpdb->get_row($wpdb->prepare("SELECT * FROM " . maxButtonsUtils::get_buttons_table_name() . " WHERE name = '%s' and status ='%s'", trim($name), $status ), ARRAY_A);
 
		} else {
			$row = $wpdb->get_row($wpdb->prepare("SELECT * FROM " . maxButtonsUtils::get_buttons_table_name() . " WHERE id = %d and status ='%s'", $id, $status), ARRAY_A);
		}
	
		
		if (count($row) == 0) 
		{
			return false; 		
		} 
 
		return $this->setupData($row);
		
	}
	/* Clear button settings
	*
	*  This function prevent that generated values from previous set actions will still be present.
	*/	
	function clear() 
	{
		unset($this->data);
		unset($this->button_css);
		$this->button_css = '';
		$this->data = array();
		$this->cache = ''; 
		$this->button_loaded = false;
	}
		
	function setupData($data)
	{
		maxButtonsUtils::addTime("Button: Setup data"  );
		foreach($this->blocks as $block)
		{

			if (array_key_exists($block, $data))  // strangely isset doesn't work
			{
				$this->data[$block] = unserialize($data[$block]);
			}
			else 
			{
				// else block does not exist in this dataset - ignoring. 
				//exit("Fatal: Something wrong with provider on $block ");
			} 
		}
 
		$this->id = $data["id"];
		$this->cache = isset($data["cache"]) ? trim($data["cache"]) : ''; // not set at button packs / non-dbase buttons!
		$this->data["id"] = $this->id; // needed for certain blocks, to be button aware. 
		$this->name = $data["name"]; 
		$this->status = $data["status"];
		$this->description = $this->data["basic"]["description"]; 

		do_action('mb-data-load', $this->data);

		return true;
		 
	}
	
	function get( ) 
	{
		return $this->data;
	 
	}
	
	function getID() 
	{
		return $this->id; 
	}
	function getName() 
	{
		return $this->name;
	}
	function getDescription()
	{
		return $this->description;
	}
	
	function getStatus()
	{
		return $this->status; 
	}
	
	function getParsedCSS() 
	{
		return $this->parsed_css; 
	}
	
	function getCSSArray()
	{

		return $this->button_css;
	}
	
	function getCSSParser()
	{
		if (! $this->cssParser)
			$this->cssParser = new maxCSSParser(); 
			
		return $this->cssParser;
	}
	

 

	/* Parse CSS from all the elements
	
	*/
	function parse_css($mode = "normal", $forceCompile = false )
	{
		maxButtonsUtils::addTime("Button: Parse css :: $mode");
		$css = $this->button_css; 
 
		if (isset($this->cache) && $this->cache != '' && ! $forceCompile)
		{		 
		
			$css = $this->cache;
			maxButtonsUtils::addTime("Button: Cache loaded");
		}
		else
		{ 
			$css = apply_filters('mb-css-blocks', $css, $mode);
			$this->button_css = $css;
			$css = $this->getCSSParser()->parse($this->button_css);
			if ($mode == 'normal') // only in general mode, otherwise things go amiss.
				$this->update_cache($css);
				
			maxButtonsUtils::addTime("Button: Parse css done");
 		}
		$this->parsed_css = $css; 		
		return $css; 
	}
	
	function parse_js($mode = "normal") 
	{
		$js = $this->button_js; 
		$js = 	apply_filters('mb-js-blocks', $js, $mode);
		$this->button_js = $js; 
	}
	
	function parse_button($mode = 'normal')
	{
		maxButtonsUtils::addTime("Button :: parse button");
		$domObj = new simple_html_dom();
		$domObj->load("<a  class=\"maxbutton-" . $this->id . " maxbutton\"></a>"); 
   
		$domObj = apply_filters('mb-parse-button', $domObj, $mode); 
 
		$domObj->load($domObj->save());
 
 		$cssParser = $this->getCSSParser();
		$cssParser->loadDom($domObj);
		maxButtonsUtils::addTime("Button parsed, returning dom");
		return $domObj; 
	}

	/* Display all data and html to allow users to edit button settings */ 
	public function admin_fields() 
	{
		do_action('mb-admin-fields' ); 
 
	}
	
 	/* Display the button */
	public function display($args = array() )
	{	
		$defaults = array(
			"mode" => 'normal',
			"preview_part" => "full",
			"echo" => true, 
			"load_css" => "footer", // control how css is loaded. 
			"compile" => false, // possibility to force recompile if needed. 
		);
		
		$args = wp_parse_args($args, $defaults); 

		$cssParser = $this->getCSSParser(); // init parser
 
	 	$this->load_css = $args["load_css"]; 
 
		if ($this->id == 0) // if button doesn't exists don't display unless in editor
		{
			if (! $args["mode"] == 'editor' ) 
				return;
 
			$data = apply_filters("mb-save-fields", array(), array() ); // load defaults
			$data["id"] = 0;
			do_action('mb-data-load', $data);
		}
		
		$mode = (isset($args["mode"])) ? $args["mode"] : "normal"; 		
 		switch($mode)
 		{
			case "preview": 	
		 		$preview = true;
		 		$compile = false;
		 	break;	
 			case "editor": 	 	
		 		$preview = true; 			
  				$compile = true;					
  				 // editor is both compile and preview. 
  			break;
 			break;
 			case "normal": 
 				$preview = false; 
 				$compile = false;
 			break;
 		}
		
 		if ( $this->load_css == "element" || $args["preview_part"] != "full" || $args["compile"] == true) { // if css output is on element, for to compile - otherwise inline styles will not be loaded.
 			$compile = true;

 		}
 		else 
 			$compile = false;
 
// 	var_dump($compile);
 	
		// create button
		$domObj = $this->parse_button($mode); 
		
		$this->parse_css($mode, $compile); 
		$this->parse_js($mode); 
		
		if ($preview)  // mark it preview
		{

			$domObj->find('a',0)->class .= ' maxbutton-preview';
		}
		
		if ($preview && $args["preview_part"] != 'full')
		{
 
 	 		if ($args["preview_part"] != 'normal')
 	 		{
				$domObj->find('a',0)->class .= ' hover'; 	
				$domObj = $cssParser->outputInline($domObj,'hover');

			}
			else
			{
				$domObj->find('a',0)->class .= ' normal'; 
				$domObj = $cssParser->outputInline($domObj);
			}

		}
		elseif ($this->load_css == 'footer') 
		{
			$css = $this->display_css(false, true); 
			do_action('mb-footer-css',$this->id, $css); 
			
		} elseif ($this->load_css == 'inline') 
		{
			$this->display_css();
		}
		elseif ($this->load_css == 'element') // not possible to load both normal and hover to an element. 
		{
				$domObj->find('a',0)->class .= ' normal'; 
				$domObj = $this->cssParser->outputInline($domObj); 
				//$this->get_element_css($domObj, 'normal'); 
		}
			

 		$output = $domObj->save();
		
		$output = apply_filters('mb-before-button-output', $output); 
		if ($args["echo"])
			echo $output; 
		else
			return $output; 
		
	}	
	/* Function used to map field id's to display for Frontend Javascript
	
		This function bundles all defined fields into a json encoded variable. This is used for the frontend javascript functions in the 
		administrator area like colorpickers and real-time updating of the button preview
	*/
	public function display_field_map()
	{
		$map = array(); 
		$map = apply_filters("mb-field-map",$map); 
		

		echo "<script language='javascript'>"; 	
				echo "var buttonFieldMap = '" . json_encode($map) . "';" ;
		echo "</script>";
	
	}
	
	/* Write parsed CSS to output. 
 	   @param echo Default true. When true, outputs directly, otherwise returns output string 
 	   @param style_tag Default true. When true, outputs a html <style> tags around the output.
 	*/
	public function display_css($echo = true, $style_tag = true)
	{
		$output = ''; 
		
		if ($style_tag)
			$output .=  "<style type='text/css'>";
		
			$output .= $this->parsed_css;
			
		if ($style_tag)
			$output .= "</style>";
		
 
		if ($echo) echo $output; 
		else return $output; 
		
	}


	/* Makes a copy of the current buttons. 
	
	   The button to be copied -must- be loaded and set	
	*/
	function copy() 
	{		
		$this->id = 0; 
		$data = $this->data;
		$data["name"] = $this->name;
		
		return $this->update($data);		
	}
	/*  Change the publication status of the button.
	
	*/
	function setStatus($status = "publish") 
	{
		$data = $this->data; 
		$data["status"] = sanitize_text_field($status); 

		return $this->update($data); 
			
	}	
	/* Remove the button from database */ 
	public function delete($id) 
	{
		$this->wpdb->query($this->wpdb->prepare("DELETE FROM " . maxButtonsUtils::get_buttons_table_name() . " WHERE id = %d", $id));
	}
		
	/* Save changes to the button 
		
		Updates or saves the button. Existing buttons must load their data and be set -first- or lose all not-passed data. 
		
	   @param post Post data in field - value format (flat $_POST array)
	   @param boolean savedb if false do not save to database 
	*/
	public function save($post, $savedb = true)
	{
 		$post = stripslashes_deep($post); // don't multiply slashes please.
		$data = apply_filters('mb-save-fields',$this->data, $post); 
 
		if (! $savedb ) return $data; 
		return $this->update($data); // save to db. 
	
	}
	
	/* Updates the button data to the database. Adds a button if it doesn't exist */
	public function update($data) 
	{	 
		$return = false;  
		
		$fields = array(); 
		foreach($this->blocks as $block)
		{
			if (isset($data[$block])) 
			{
				$blockData = $data[$block]; 
				$fields[$block] = serialize($blockData);
			}
		}	
 		if (isset($data["name"])) {  // other fields. 
 			$fields["name"] = $data["name"]; 
 		}
 		if (isset($data["status"])) {
 			$fields["status"] = $data["status"]; 
 		}
 
 
		$where = array('id' => $this->id );
		if ($this->id > 0) 
		{
			$where = array('id' => $this->id);
			$where_format = array('%d');
			$this->wpdb->update(maxButtonsUtils::get_buttons_table_name(), $fields, $where, null, $where_format);
			$return = true;
		}
		else
		{
			$this->wpdb->insert(maxButtonsUtils::get_buttons_table_name(), $fields);
			$id = $this->wpdb->insert_id;
 			$this->id = $id;
 			$return = $id; 
		
		}
		

 		// update the cache 
 		
 		//$css = $this->parse_css('normal', true); // force compile
 		$this->cache = ''; // empty cache 
 		$this->set($this->id); // set the newest values
 		$this->display(array("echo" => false, "load_css" => "element")); // do display routing to compile.
 		$css = $this->parsed_css; 		
 		$this->update_cache($css);		

 		return $return;
	}
	
	/* Updates the CSS cache. */
	public function update_cache($css)
	{
		$return = false;
		if ($this->id > 0) 
		{
			$fields = array("cache" => $css); 
			$where = array('id' => $this->id);
			$where_format = array('%d');
			$this->wpdb->update(maxButtonsUtils::get_buttons_table_name(), $fields, $where, null, $where_format);
			$return = true;
		
		}
	
	}
	
	// Resets all of the button caches.
	public function reset_cache()
	{
		$fields = array("cache" => null); 
		$where = array(1 => 1);
		//$where_format = array('%d');
		$sql = "UPDATE " . maxButtonsUtils::get_buttons_table_name() . " SET cache = NULL "; 
		$this->wpdb->query($sql);
 
	}

	
	public function shortcode($atts)
	{  		 			
		extract(shortcode_atts(array(
				'id' => '',
				'name' => '',
				'text' => '',
				'url' => '',
				'window' => '',
				'nofollow' => '',
			//	'externalcss' => '',
			//	'externalcsspreview' => '',		// Only used in maxbuttons-button-css.php
			//	'ignorecontainer' => '',		// Internal use only on button list pages and the TinyMCE dialog
				'exclude' => ''
			), $atts));	
			
		$button_id = $id; 
		$button_name = $name;
 
		if ($button_id > 0) 
			$result = $this->set($button_id); 
		elseif ($button_name != '') 
			$result = $this->set(0, $button_name); 
		else return; // no button

		$compile = false; 
		
 
		if (! $result) 
			return; // shortcode doesn't exist
			
			// If we're not in the admin and the button is in the trash, just return nothing
			if (!is_admin() && $this->status == 'trash') {
				return '';
			}
		// Check to handle excludes
		if ("{$exclude}" != '') {
			global $post;
			
			// Don't render the button if excluded from the current post/page
			$exclude = explode(',', "{$exclude}");
			if (in_array($post->ID, $exclude)) {
				return '';
			}
		}
		
		// Override shortcode options comparing to default button data.
		$overrides = false; 
		if ($text != '') 
		{ 
			$this->data["text"]["text"] = $text; 
			$overrides = true;
		}  
		if ($url != '') 
		{
			$this->data["basic"]["url"]  = $url; 
			$compile = true; // css change forces recompile
			$overrides = true;
		}
		if ($window != '' && $window =='new') 
		{
			$this->data["basic"]["new_window"] = 1;  
			$overrides = true;
		}
		if ($nofollow != '' && $nofollow == 'true') 
		{
			$this->data["basic"]["nofollow"] = 1; 
			$overrides = true;
		}
		
		if ($overrides)
		{
			do_action('mb-data-load', $this->data);
		}
		// if there are no reasons not to display; display
		$args = array("echo" => false, 
					  "compile" => $compile, 
				);
		$output = $this->display($args);
	 
		return $output;
		
	}

}
?>
