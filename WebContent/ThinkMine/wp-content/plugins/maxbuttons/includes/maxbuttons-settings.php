<?php

/*if(is_admin()) {
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', '', '4.0.1', false);
} */

if(isset($_POST['alter_charset'])) {
    
    global $maxbuttons_installed_version;
    global $wpdb;
    $table_name = maxButtonsUtils::get_buttons_table_name();

    $sql = "ALTER TABLE " . $table_name . " CONVERT TO CHARACTER SET utf8";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $wpdb->query($sql);
    $response = 'CHARSET now utf_8 COLLATE utf8_general_ci';

} else {
    $response = '';
}

if (isset($_POST["reset_cache"])) 
{
	$button = new maxButton();
	$button->reset_cache();

}

if (isset($_POST["remigrate"]))
{
 
	maxInstall::create_database_table();
	maxInstall::migrate();
}


?>

<div id="maxbuttons">
	<div class="wrap">
		<div class="icon32">
			<a href="http://maxbuttons.com" target="_blank"><img src="<?php echo MAXBUTTONS_PLUGIN_URL ?>/images/mb-32.png" alt="MaxButtons" /></a>
		</div>
		
		<h2 class="title"><?php _e('MaxButtons: Settings', 'maxbuttons') ?></h2>
		
		<div class="logo">
			<?php do_action("mb-display-logo"); ?> 
		</div>

		<div class="clear"></div>
		<div class="main">
			<?php do_action('mb-display-tabs'); ?> 

 <div class="clear"><p>&nbsp;</p></div>
 
       <form method="post" action="options.php">
            <div class="option-container">
                <div class="title"><?php _e('Settings', 'maxbuttons') ?></div>
                <div class="inside">
                    <div class="option-design">

                            <?php settings_fields( 'maxbuttons_settings' ); ?>
                            <div class="label"><?php _e('MaxButtons User Level', 'maxbuttons') ?></div>
                            <div class="input">
                                <select name="maxbuttons_user_level">
                                    <?php $maxbuttons_user_level = get_option('maxbuttons_user_level'); ?>
                                    <option value="edit_posts" <?php if($maxbuttons_user_level === 'edit_posts') { echo 'selected="selected"'; } ?>>Contributor</option>
                                    <option value="edit_published_posts" <?php if($maxbuttons_user_level === 'edit_published_posts') { echo 'selected="selected"'; } ?>>Author</option>
                                    <option value="manage_categories" <?php if($maxbuttons_user_level === 'manage_categories') { echo 'selected="selected"'; } ?>>Editor</option>
                                    <option value="manage_options" <?php if($maxbuttons_user_level === 'manage_options') { echo 'selected="selected"'; } ?>>Administrator</option>
                                </select>
                                <br />
                                <?php _e('For more details on user roles and permissions, click <a target="_blank" href="http://codex.wordpress.org/Creating_Options_Pages">here</a>.','maxbuttons') ?>
 
                            </div>
 
                        <div class="clear"></div>
                    </div><!-- option-design --> 
                     <?php 
                     	$noshow = get_option('maxbuttons_noshowtinymce'); 
                     	//$noshow = $max["noshow_tinymce"]; 
                     ?>               
                     <div class="option-design">
                        <div class="label"><?php _e("Don't show add button in editor", 'maxbuttons'); ?></div>         
                       	<div class="input"><input type="checkbox" name="maxbuttons_noshowtinymce" value="1" <?php checked($noshow,1); ?> /></div>
                                      <div class="clear"></div>
                     </div>
                     
             		
                      <?php submit_button(); ?>
                </div>
            </div>
        </form>
        
        <form method="POST"> 
        	<input type="hidden" name="reset_cache" value="true" />
        	<div class="option-container"> 
        		<div class="title"><?php _e("Clear button cache","maxbuttons"); ?></div>
        		<div class="inside">
        			<p><?php _e("Maxbuttons caches the style output allowing for lightning fast display of your buttons. In the event 
        			this cache needs to be flushed and rebuilt you can reset the cache here.","maxbuttons"); ?></p>
        			 <?php submit_button(__("Reset Cache") ); ?>
        		</div>
        	</div>
      </form>
      
        <form method="POST">       
      <div class="option-container">
              	<input type="hidden" name="remigrate" value="true" />
      	<div class="title"><?php _e("Retry Database migration","maxbuttons"); ?></div>
      	<div class="inside"><p><?php _e("In case the upgrade functionality failed to move your old buttons from MaxButtons before version 3, you can do so here manually. <strong>Attention</strong>  The new database table (maxbuttonsv3) *must* be empty, and the old database table *must* contain buttons otherwise this will not run. Run this <strong>at your own risk</strong> - it is strongly advised to make a backup before doing so."); ?></p>	
      	 <?php submit_button(__("Remigrate") ); ?>
      	</div>
      	        			
      
        </div>
  		</form>
  		
            <div class="option-container">
                <div class="title"><?php _e('UTF8 Table Fix', 'maxbuttons') ?></div>
                <div class="inside">
                    <div class="option-design">
                        <h3 class="alert"><?php _e('WARNING: We strongly recommend backing up your database before altering the charset of the MaxButtons table in your WordPress database.', 'maxbuttons') ?></h3>

                        <h3><?php _e('The button below should help fix the "foreign character issue" some people experience when using MaxButtons. If you use foreign characters in your buttons and after saving see ????, use this button.', 'maxbuttons') ?></h3>
                        
                        <form action="" method="POST">
                            <input type="submit" name="alter_charset" class="button-primary" value="<?php _e('Change MaxButtons Table To UTF8', 'maxbuttons') ?>" /> <?php echo $response; ?>
                        </form>
                            
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
    		
        </div>
        <div class="ad-wrap">
		<?php do_action("mb-display-ads"); ?> 
    </div>
	</div>
</div>
