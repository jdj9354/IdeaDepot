<?php

// new class for the future. 
class maxButtonsUtils
{
	protected static $timings = array();
	protected static $timer = 0;
	

	static function selectify($name, $array, $selected, $target = '')
	{
		// optional target for js updating
		if ($target != '' ) 
			$target = " data-target='$target' "; 
		$output = "<select name='$name' id='$name' $target>";
		
		foreach($array as $key => $value) 
		{
			$output .= "<option value='$key' " . selected($key, $selected, false) . ">$value</option>"; 
		}
		$output .= "</select>"; 
		
		return $output;
	
	}


	static function hex2rgba($color, $opacity) {
		// Grab the hex color and remove #
		$hex = str_replace("#", "", $color);

		// Convert hex to rgb
		if(strlen($color) == 3) {
			// If in the #fff variety
			$r = hexdec(substr($hex, 0, 1).substr($hex, 0, 1));
			$g = hexdec(substr($hex, 1, 1).substr($hex, 1, 1));
			$b = hexdec(substr($hex, 2, 1).substr($hex, 2, 1));
		} else {
			// If in the #ffffff variety
			$r = hexdec(substr($hex, 0, 2));
			$g = hexdec(substr($hex, 2, 2));
			$b = hexdec(substr($hex, 4, 2));
		}
	
		// The array of rgb values
		$rgb_array = array($r, $g, $b);
	
		// Catch for opacity when the button has not been saved
		if($opacity == '') {
			$alpha = 1;
		} else {
			// Alpha value in decimal when an opacity has been set
			$alpha = $opacity / 100;
		}

		// The rgb values separated by commas
		$rgb = implode(", ", $rgb_array);
	
		// Spits out rgba(0, 0, 0, 0.5) format
		return 'rgba(' . $rgb . ', ' . $alpha . ')';
	}
	
	static function strip_px($value) {
	return rtrim($value, 'px');
}



	static function get_media_query($get_option = 1)
	{
		
		$queries = array("phone" =>  "only screen and (max-width : 480px)",
					"phone_land" => "only screen and (min-width : 321px) and (max-width : 480px)", 
				  	"phone_portrait" => " only screen and (max-width : 320px)", 
				  	"ipad" => "only screen and (min-width : 768px) and (max-width : 1024px)",
				  	"medium_phone" => "only screen and (min-width: 480px) and (max-width: 768px)",
				  	"ipad_land" => "only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape)", 
				  	"ipad_portrait" => "only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)",
				  	"desktop" => "only screen and (min-width : 1224px)",
				  	"large_desktop" => "only screen and (min-width : 1824px)", 
					   );
 
		 $query_names = array(
						  	"phone" => __("Small phones","maxbuttons"), 
						  	"phone_land" => __("Small phones (landscape)","maxbuttons"), 
						  	"phone_portrait" => __("Small phones (portrait)","maxbuttons"), 
						  	"ipad" => __("Ipad (all)","maxbuttons"),
						  	"medium_phone" => __("Medium-size (smart)phone","maxbuttons"),
						  	"ipad_land" => __("Ipad landscape","maxbuttons"), 
						  	"ipad_portrait" => __("Ipad portrait","maxbuttons"),
						  	"desktop" => __("Desktop","maxbuttons"),
						  	"large_desktop" => __("Large desktops","maxbuttons"), 
						  	"custom" => __("Custom size","maxbuttons"), 
						  	);	
						  	
		$query_descriptions = array(
							"phone" => __("Optimized for small smartphones ( screen sizes under 480px )","maxbuttons"),
							"phone_land" => __("Optimzed for small smartphones in landscape and higher ( screen sizes 321px - 480px)","maxbuttons"), 
							"phone_portrait" => __("Optimized for small phones ( screen size max 320px )","maxbuttons"), 
							"ipad" => __("Optimized for devices between 768px and 1024px","maxbuttons"), 
							"medium_phone" => __("Optimized for medium sizes devices between 480px and 768px","maxbuttons"), 
							"ipad_land" => __("Optimized for devices between 768px and 1024px in landscape","maxbuttons"), 
							"ipad_portrait" => __("Optimized for deviced between 768px and 1024 in portrait","maxbuttons"), 
							"desktop" => __("Desktop screens from 1224px","maxbuttons"),
							"large_desktop" => __("Large desktop screens, from 1824px","maxbuttons"),
							"custom" => __("Set your own breakpoints","maxbuttons"), 
							); 
							
	
		switch($get_option)
		{
			case 1: 
				return $query_names;
			break;
			case 2: 
				return $queries; 
			break;
			case 3: 
				return $query_descriptions;
			break;
		}
	
	}
	static function get_buttons_table_name($old = false) {
		global $wpdb;
		if ($old)
			return $wpdb->prefix . 'maxbuttons_buttons';
		else
			return $wpdb->prefix . 'maxbuttonsv3'; 
	}

	static function timeInit()
	{
		self::$timer = microtime(true);

		if (is_admin()) 
			add_filter("admin_footer",array('maxButtonsUtils', "showTime"), 100); 
		else
			add_action("wp_footer",array('maxButtonsUtils', "showTime")); 
	
	}

	static function addTime($msg)
	{
		if ( ! defined('MAXBUTTONS_BENCHMARK') || MAXBUTTONS_BENCHMARK !== true)
			return;
		
		if (count(self::$timings) == 0)
		{
			self::timeInit(); 
		} 
		
		self::$timings[] = array("msg" => $msg,"time" => microtime(true)); 
		
		/*
		global $timer; global $timings;
		$timer = microtime(true);
		$timings = array(); 
		function addTime($msg)
		{
			global $timings;
			$timings[] = array("msg" => $msg, "time" => microtime(true)); 
		}

		function show_time()
		{
			global $timings; global $timer; 
			//echo "TIME";  print_R($timings);
			foreach($timings as $timing)
			{
				echo ($timing["time"] - $timer) . " :: " . $timing["msg"] . " <br /> "; 
			}
		}

		add_action('wp_footer','show_time');  */


	}
	
	static function showTime()
	{
			$timer = self::$timer;
			$text = ''; 
			$text .=  "<div id='mb-timer'>"; 
			$text .= "<p>" . __("MaxButtons Loading Time:","maxbuttons") . "</p>"; 
			
			foreach(self::$timings as $timing)
			{
				$text .= ($timing["time"] - $timer) . " :: " . $timing["msg"] . " <br /> "; 
			}
			$text .= "</div>";
			$text .= "<style>#mb-timer { margin-left: 180px; } 
			
					</style>"; 
			echo $text;
			//return $filter . $text; 
	}
}
 
?>
