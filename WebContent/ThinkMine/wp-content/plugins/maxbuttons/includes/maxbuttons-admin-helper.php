<?php 

/* Helper class for uniform elements in admin pages */ 

add_action('mb-display-logo', array('maxAdmin','logo')); 
add_action('mb-display-tabs', array('maxAdmin','tab_menu')); 
add_action('mb-display-ads', array('maxAdmin', 'display_ads')); 

class maxAdmin 
{
	static $tabs = null;
					
		
	static function logo()
	{
	?> 
			<?php _e('Brought to you by', 'maxbuttons') ?>
			<a href="http://maxfoundry.com/products/?ref=mbfree" target="_blank"><img src="<?php echo maxButtons::get_plugin_url() ?>/images/max-foundry.png" alt="Max Foundry" /></a>
			<?php printf(__('Upgrade to MaxButtons Pro today! %sClick Here%s', 'maxbuttons'), '<a href="http://www.maxbuttons.com/pricing/?utm_source=mbf-dashboard&utm_medium=mbf-plugin&utm_content=mpb-list-sidebar-21&utm_campaign=inthecart19" target="_blank">', '</a>' ) ?>
	<?php
	}
	
	static function tab_items_init()
	{
			self::$tabs = array(
						"list" => array("name" =>  __('Buttons', 'maxbuttons'), 
										 "link" => "page=maxbuttons-controller&action=list",
										 "active" => "maxbuttons-controller", ), 
										 
						"pro" => array( "name" => __('Upgrade to Pro', 'maxbuttons'),
										 "link" => "page=maxbuttons-pro",
										 "active" => "maxbuttons-pro",
										 ),
						"settings" => array("name" => __('Settings', 'maxbuttons'),
										 "link" => "page=maxbuttons-settings",
										 "active" => "maxbuttons-settings",
										 "userlevel" => 'manage_options'  ), 
						"support" => array("name" => __('Support', 'maxbuttons'), 
										 "link" => "page=maxbuttons-support",
										 "active" => "maxbuttons-support",
										 "userlevel" => 'manage_options'
										 )
			); 
	}
	
	static function tab_menu()
	{
		 self::tab_items_init(); 
	?>
			<h2 class="tabs">
				<span class="spacer"></span>
		<?php foreach (self::$tabs as $tab => $tabdata) { 
			if (isset($tabdata["userlevel"]) && ! current_user_can($tabdata["userlevel"]))
				continue; 

			$link = admin_url() . "admin.php?" . $tabdata["link"]; 
			$name = $tabdata["name"];
			$active = ''; 
			if ($tabdata["active"] == $_GET["page"])
				$active = "nav-tab-active";
				
				echo "<a class='nav-tab $active' href='$link'>$name</a>"; 

		}
		echo "</h2>";	
	}
	
	static function display_ads()
	{ ?>
        <div class="ads">
            <h3><?php _e('Get MaxButtons Pro!', 'maxbuttons'); ?></h3>
         <?php /*   <p><?php _e('Celebrate the launch of our newest version of MaxButtons Pro!  You’ll see the sales price of $19 in the cart! ', 'maxbuttons'); ?></p> */ ?> 
            <p><strong><?php _e('MaxButton Pro bonus features include:', 'maxbuttons'); ?></strong></p>
            <ul>
                <li><?php _e('Two Lines of Editable Text', 'maxbuttons'); ?></li>
                <li><?php _e('Pre-Made Button Packs', 'maxbuttons'); ?></li>
                <li><?php _e('Add An Icon To Your Buttons', 'maxbuttons'); ?></li>
                <li><?php _e('Google Web Fonts', 'maxbuttons'); ?></li>
                <li><?php _e("Font Awesome Icon Support","maxbuttons"); ?></li>
                <li><?php _e('Responsive Buttons', 'maxbuttons'); ?></li> 
                <li><?php _e('Our terrific Support', 'maxbuttons'); ?></li>
                <li><?php _e("Plus More!","maxbuttons"); ?></li>

            </ul>
            <a class="button-primary" href="http://www.maxbuttons.com/pricing/?utm_source=mbf-dashboard&utm_medium=mbf-plugin&utm_content=mpb-list-sidebar-21&utm_campaign=inthecart19" target="_blank" ><?php _e('Get MaxButtons Pro Now!', 'maxbuttons'); ?></a>
        </div>
        
        <div class="ads"> 
        	<h3><?php _e("Everything for $99!","maxbuttons"); ?></h3>
        	<p>Get a copy of MaxButtons Pro and all of our WordPress Button Packs including over 4,000 Professionally Designed, Production Ready WordPress Buttons in 190 sets.  </p>
            <a class="button-primary" href="http://www.maxbuttons.com/pricing/?utm_source=mbf-dashboard&utm_medium=mbf-plugin&utm_content=EBWG-sidebar-22&utm_campaign=inthecart60" target="_blank"><?php _e('Get Everything Now!', 'maxbuttons'); ?></a>        	
        </div>
        
        <div class="ads">
            <h3><?php _e('Get MaxGalleria', 'maxbuttons'); ?></h3>
            <p><?php _e('Download our free WordPress Gallery plugin MaxGalleria!  Add-ons for Albums, Videos, and Image Sliders.', 'maxbuttons'); ?></p>
            <a class="button-primary" href="https://wordpress.org/plugins/maxgalleria/?utm_source=mbf-dashboard&utm_medium=mbf_plugin&utm_content=MG_sidebar&utm_campaign=MG_promote" target="_blank"><?php _e('Get MaxGalleria Now!', 'maxbuttons'); ?></a>
        </div>
        
   <!--     <div class="ads">
            <h3><i class="fa fa-cogs"></i> <?php _e('Font Awesome Support', 'maxbuttons'); ?></h3>
            <p><?php _e('With MaxButtons Pro you have access to all 439 Font Awesome icons, ready to add to your buttons.', 'maxbuttons'); ?></p>
            <p><?php _e('Never upload another icon again, just choose an icon and go about your normal button-making business.', 'maxbuttons'); ?></p>
            <a class="button-primary" href="http://www.maxbuttons.com/pricing/?utm_source=wordpress&utm_medium=mbrepo&utm_content=button-list-sidebar-99&utm_campaign=plugin"><?php _e('Use Font Awesome!', 'maxbuttons'); ?> <i class="fa fa-arrow-circle-right"></i></a>
        </div> -->
        <?php
	}




} // class
?>
