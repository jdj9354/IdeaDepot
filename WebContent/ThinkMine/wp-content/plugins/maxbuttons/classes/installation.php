<?php 
class maxInstall
{
	 static function activation_hook($network_wide) {
		if ($network_wide) {
			static::call_function_for_each_site( array('self','activate_plugin') );
		}
		else {
			static::activate_plugin();
		}
	}
	 static function deactivation_hook($network_wide) {

		if ($network_wide) {
			static::call_function_for_each_site( array('self','deactivate_plugin') );
		}
		else {
			static::deactivate_plugin();
		}
	}	

	// This should be done - once! Removed in time as well.
	static function check_database()
	{
		$checked = get_option("MB_DBASECHECK", true); 
		if ($checked == '')
		{
 
			$table = maxButtonsUtils::get_buttons_table_name(); 
 
			if (! self::maxbuttons_database_table_exists($table))
			{
				self::activate_plugin();
			}
		}
		update_option("MB_DBASECHECK","1");
	}

	static function activate_plugin($gocreate = true)
	{
		
		static::create_database_table();
		static::migrate(); 
		update_option(MAXBUTTONS_VERSION_KEY, MAXBUTTONS_VERSION_NUM);
		$created = get_option("MBFREE_CREATED"); 
		if ($created == '' && $gocreate) 
		{  update_option("MBFREE_CREATED", time()); 

		}
        update_option("MBFREE_HOMEURL", home_url()); 
	}
	
	/* Move data from old version database to new version 
		
	   Check if new database table is empty ( aka new ) to prevent migrating the same data multiple times then copy all rows from old table to the new one.  
	*/
	static function migrate()
	{
		global $wpdb; 
		
		$old_table = maxButtonsUtils::get_buttons_table_name(true); 
		$table = maxButtonsUtils::get_buttons_table_name(); 
 	
 		if (! self::maxbuttons_database_table_exists($old_table))
 		{
 			return; 
 		}
 	
		$sql = "SELECT id from $table"; 
		$result = $wpdb->get_results($sql, ARRAY_A); 
		if(count($result) > 0) 	return; // don't do this if table already has data. 

		$sql = "SELECT * FROM $old_table"; 
		$rows = $wpdb->get_results($sql, ARRAY_A); 
		
		if (count($rows) == 0 ) // no button in all table; all is good. 
			return true; 
		
 
		foreach($rows as $row) 
		{	
			$data = static::convertOldFields($row);
			$id = $data["id"]; 
			global $wpdb; 
			$wpdb->insert($table, array("id" => $id)); 
			
			//$data = apply_filters("mb-migration-data",$data, $row); 
			$button = new maxButton();
			$button->set($id);
			$button->save($data);
		}
	}
	
	static function convertOldFields($row)
	{
			$data = array(); 

			
			$data["id"] = (isset($row["id"])) ? $row["id"] : -1; 
			$data["name"] = $row["name"];
			$data["status"] = isset($row["status"]) ? $row["status"] : 'publish';   // happens with downloadable packs.
			$data["description"] = $row["description"]; 
			$data["url"] = $row["url"];
			$data["text"] = $row["text"];
			$data["new_window"] =  (isset($row["new_window"]) && $row["new_window"] != "") ? 1 : 0;
			$data["nofollow"] =  (isset($row["nofollow"]) && $row["nofollow"] != "") ? 1 : 0; 
			
			$data["font"] = $row["text_font_family"]; 
			$data["font_size"] = $row["text_font_size"]; 
			$data["font_style"] = $row["text_font_style"]; 
			$data["font_weight"] = $row["text_font_weight"]; 
			$data["text_shadow_offset_left"] = $row["text_shadow_offset_left"]; 
			$data["text_shadow_offset_top"] = $row["text_shadow_offset_top"]; 
			$data["text_shadow_width"] = $row["text_shadow_width"]; 
			$data["padding_top"] = $row["text_padding_top"]; 
			$data["padding_right"] = $row["text_padding_right"]; 
			$data["padding_bottom"] = $row["text_padding_bottom"]; 	
			$data["padding_left"] = $row["text_padding_left"];
			 
			$data["radius_top_left"] = $row["border_radius_top_left"]; 
			$data["radius_top_right"] = $row["border_radius_top_right"]; 
			$data["radius_bottom_left"] = $row["border_radius_bottom_left"]; 
			$data["radius_bottom_right"] = $row["border_radius_bottom_right"]; 
			$data["border_style"] = $row["border_style"]; 
			$data["border_width"] = $row["border_width"]; 
			$data["box_shadow_offset_left"] = $row["box_shadow_offset_left"]; 
			$data["box_shadow_offset_top"] = $row["box_shadow_offset_top"];		
			$data["box_shadow_width"] = $row["box_shadow_width"]; 
			
			$data["text_color"] = $row["text_color"]; 
			$data["text_shadow_color"] = $row["text_shadow_color"]; 
			$data["gradient_start_color"] = $row["gradient_start_color"]; 
			$data["gradient_end_color"] = $row["gradient_end_color"]; 
			$data["border_color"] = $row["border_color"]; 
			$data["box_shadow_color"] = $row["box_shadow_color"]; 
			
			$data["text_color_hover"] = $row["text_color_hover"]; 
			$data["text_shadow_color_hover"] = $row["text_shadow_color_hover"]; 
			$data["gradient_start_color_hover"] = $row["gradient_start_color_hover"]; 
			$data["gradient_end_color_hover"] = $row["gradient_end_color_hover"]; 
			$data["border_color_hover"] = $row["border_color_hover"]; 
			$data["box_shadow_color_hover"] = $row["box_shadow_color_hover"]; 
			
			$data["gradient_stop"] = (isset($row["gradient_stop"])) ? $row["gradient_stop"] : 45; 
			$data["gradient_start_opacity"] = (isset($row["gradient_start_opacity"])) ? $row["gradient_start_opacity"] : 100;
			$data["gradient_end_opacity"] = (isset($row["gradient_end_opacity"])) ? $row["gradient_end_opacity"] : 100;
			$data["gradient_start_opacity_hover"] = (isset($row["gradient_start_opacity_hover"])) ? $row["gradient_start_opacity_hover"] : 100;			
			$data["gradient_end_opacity_hover"] = (isset($row["gradient_end_opacity_hover"])) ? $row["gradient_end_opacity_hover"] : 100;
						
			$data["container_enabled"] =  (isset($row["container_enabled"]) && $row["container_enabled"] != "") ? 1 : 0; 
			$data["container_center_div_wrap"] = (isset($row["container_center_div_wrap_enabled"]) && $row["container_center_div_wrap_enabled"] != "") ? 1 : 0; 
			$data["container_width"] = isset($row["container_width"]) ? $row["container_width"] : ''; 
			$data["container_margin_top"] = isset($row["container_margin_top"]) ? $row["container_margin_top"] : ''; 
			$data["container_margin_right"] = isset($row["container_margin_right"]) ? $row["container_margin_right"] : ''; 
			$data["container_margin_bottom"] = isset($row["container_margin_bottom"]) ? $row["container_margin_right"] : ''; 
			$data["container_margin_left"] = isset($row["container_margin_left"]) ? $row["container_margin_left"] : ''; 
			$data["container_alignment"] = isset($row["container_alignment"]) ? $row["container_alignment"] : '';
			
			$data["status"] = (isset($row["status"])) ? $row["status"] : 'publish'; 
			 
			$data["external_css"] =  (isset($row["external_css"]) && $row["external_css"] != "") ? 1: 0; 
			$data["important_css"] =  (isset($row["important_css"]) && $row["important_css"] != "") ? 1 : 0;
			return $data;
	}
	
	static function deactivate_plugin()
	{ 
			delete_option(MAXBUTTONS_VERSION_KEY);
	}


	static function maxbuttons_database_table_exists($table_name) {
		global $wpdb;
		return strtolower($wpdb->get_var("SHOW TABLES LIKE '$table_name'")) == strtolower($table_name);
	}


	 static function create_database_table() {
	 //global $maxbuttons_installed_version;

		$table_name = maxButtonsUtils::get_buttons_table_name();
		$button = new maxButton();
		$blocks = $button->getDefinedBlocks();
	
		// IMPORTANT: There MUST be two spaces between the PRIMARY KEY keywords
		// and the column name, and the column name MUST be in parenthesis.
		$sql = "CREATE TABLE " . $table_name . " ( 
					id int NOT NULL AUTO_INCREMENT, 
					 name varchar(100) NULL, 
					 status varchar(10) default 'publish' NOT NULL, 
					 cache text, 
				";
				/*	name VARCHAR(100) NULL,
					description VARCHAR(500) NULL,
					url VARCHAR(250) NULL,
					text VARCHAR(100) NULL,
					text_font_family VARCHAR(50) NULL,
					text_font_size VARCHAR(10) NULL,
					text_font_style VARCHAR(10) NULL,
					text_font_weight VARCHAR(10) NULL,
					text_color VARCHAR(10) NULL,
					text_color_hover VARCHAR(10) NULL,
					text_shadow_offset_left VARCHAR(10) NULL,
					text_shadow_offset_top VARCHAR(10) NULL,
					text_shadow_width VARCHAR(10) NULL,
					text_shadow_color VARCHAR(10) NULL,
					text_shadow_color_hover VARCHAR(10) NULL,
					text_padding_top VARCHAR(10) NULL,
					text_padding_bottom VARCHAR(10) NULL,
					text_padding_left VARCHAR(10) NULL,
					text_padding_right VARCHAR(10) NULL,
					border_radius_top_left VARCHAR(10) NULL,
					border_radius_top_right VARCHAR(10) NULL,
					border_radius_bottom_left VARCHAR(10) NULL,
					border_radius_bottom_right VARCHAR(10) NULL,
					border_style VARCHAR(10) NULL,
					border_width VARCHAR(10) NULL,
					border_color VARCHAR(10) NULL,
					border_color_hover VARCHAR(10) NULL,
					box_shadow_offset_left VARCHAR(10) NULL,
					box_shadow_offset_top VARCHAR(10) NULL,
					box_shadow_width VARCHAR(10) NULL,
					box_shadow_color VARCHAR(10) NULL,
					box_shadow_color_hover VARCHAR(10) NULL,
					gradient_start_color VARCHAR(10) NULL,
					gradient_start_color_hover VARCHAR(10) NULL,
					gradient_end_color VARCHAR(10) NULL,
					gradient_end_color_hover VARCHAR(10) NULL,
					gradient_stop VARCHAR(2) NULL,
					gradient_start_opacity VARCHAR(3) NULL,
					gradient_end_opacity VARCHAR(3) NULL,
					gradient_start_opacity_hover VARCHAR(3),
					gradient_end_opacity_hover VARCHAR(3),
					new_window VARCHAR(10) NULL,
					container_enabled VARCHAR(5) NULL,
					container_width VARCHAR(7) NULL,
					container_margin_top VARCHAR(7) NULL,
					container_margin_right VARCHAR(7) NULL,
					container_margin_bottom VARCHAR(7) NULL,
					container_margin_left VARCHAR(7) NULL,
					container_alignment VARCHAR(25) NULL,
					container_center_div_wrap_enabled VARCHAR(5) NULL,
					nofollow VARCHAR(5) NULL,
					status VARCHAR(10) DEFAULT 'publish' NOT NULL,
					external_css VARCHAR(5) NULL,
					important_css VARCHAR(5) NULL, 
			);"; */

		foreach($blocks as $block)
		{
			$sql .= "" . $block . " TEXT NULL, \n "; 	
		}
	 
		$sql .= " PRIMARY KEY  (id) )"; 
 
		if (! static::maxbuttons_database_table_exists($table_name)) {
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
		
		if ( static::maxbuttons_database_table_exists($table_name) && (get_option(MAXBUTTONS_VERSION_KEY) != MAXBUTTONS_VERSION_NUM 
			|| get_option(MAXBUTTONS_VERSION_KEY) == '' ) ){
		 
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
		
		// Reset the cache if there were any left from before
		$button->reset_cache(); 
		
		//else exit( __("Something went wrong when creating database table", "maxbuttons") );
	}
 
	public static function call_function_for_each_site($function) {
		global $wpdb;
	
		// Hold this so we can switch back to it
		$root_blog = $wpdb->blogid;
	
		// Get all the blogs/sites in the network and invoke the function for each one
		$blog_ids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
		foreach ($blog_ids as $blog_id) {
			switch_to_blog($blog_id);
			call_user_func($function);
		}
	
		// Now switch back to the root blog
		switch_to_blog($root_blog);
	}
} // class
?>
