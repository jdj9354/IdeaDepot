<?php
$theme = wp_get_theme();
$browser = maxbuttons_get_browser();

if(is_admin()) {
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', '', '4.0.1', false);
}

function maxbuttons_system_label($label, $value, $spaces_between) {
	$output = $label;
	
	if ($spaces_between > 0) {
		for ($i = 0; $i < $spaces_between; $i++) {
			$output .= "&nbsp;";
		}
	}
	
	return $output . $value . " \r\n ";
}

// http://www.php.net/manual/en/function.get-browser.php#101125.
// Cleaned up a bit, but overall it's the same.
function maxbuttons_get_browser() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $browser_name = 'Unknown';
    $platform = 'Unknown';
    $version= "";

    // First get the platform
    if (preg_match('/linux/i', $user_agent)) {
        $platform = 'Linux';
    }
    elseif (preg_match('/macintosh|mac os x/i', $user_agent)) {
        $platform = 'Mac';
    }
    elseif (preg_match('/windows|win32/i', $user_agent)) {
        $platform = 'Windows';
    }
    
    // Next get the name of the user agent yes seperately and for good reason
    if (preg_match('/MSIE/i', $user_agent) && !preg_match('/Opera/i', $user_agent)) {
		$browser_name = 'Internet Explorer';
        $browser_name_short = "MSIE";
    }
    elseif (preg_match('/Firefox/i', $user_agent)) {
        $browser_name = 'Mozilla Firefox';
        $browser_name_short = "Firefox";
    }
    elseif (preg_match('/Chrome/i', $user_agent)) {
        $browser_name = 'Google Chrome';
        $browser_name_short = "Chrome";
    }
    elseif (preg_match('/Safari/i', $user_agent)) {
        $browser_name = 'Apple Safari';
        $browser_name_short = "Safari";
    }
    elseif (preg_match('/Opera/i', $user_agent)) {
        $browser_name = 'Opera';
        $browser_name_short = "Opera";
    }
    elseif (preg_match('/Netscape/i', $user_agent)) {
        $browser_name = 'Netscape';
        $browser_name_short = "Netscape";
    }
    
    // Finally get the correct version number
    $known = array('Version', $browser_name_short, 'other');
    $pattern = '#(?<browser>' . join('|', $known) . ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
    if (!preg_match_all($pattern, $user_agent, $matches)) {
        // We have no matching number just continue
    }
    
    // See how many we have
    $i = count($matches['browser']);
    if ($i != 1) {
        // We will have two since we are not using 'other' argument yet
        // See if version is before or after the name
        if (strripos($user_agent, "Version") < strripos($user_agent, $browser_name_short)){
            $version= $matches['version'][0];
        }
        else {
            $version= $matches['version'][1];
        }
    }
    else {
        $version= $matches['version'][0];
    }
    
    // Check if we have a number
    if ($version == null || $version == "") { $version = "?"; }
    
    return array(
        'user_agent' => $user_agent,
        'name' => $browser_name,
        'version' => $version,
        'platform' => $platform,
        'pattern' => $pattern
    );
}

function check_charset() {
    global $maxbuttons_installed_version;
    global $wpdb;
    $check = "SHOW FULL COLUMNS FROM " . maxButtonsUtils::get_buttons_table_name();
    $charset = $wpdb->query($check);
    return $charset;
}
    if(isset($_POST['alter_charset'])) {
        $kludge = 'altering table to be utf-8';
        global $maxbuttons_installed_version;
        global $wpdb;
        $table_name = maxbuttons_get_buttons_table_name();
        $kludge = $table_name;
        // IMPORTANT: There MUST be two spaces between the PRIMARY KEY keywords
        // and the column name, and the column name MUST be in parenthesis.
        $sql = "ALTER TABLE " . $table_name . " CONVERT TO CHARACTER SET utf8";
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $wpdb->query($wpdb->prepare($sql));
    } else {
        $kludge = 'Not yet enabled';
    }

    $charr = check_charset(); 

?>

<div id="maxbuttons">
	<div class="wrap">
		<div class="icon32">
			<a href="http://maxbuttons.com" target="_blank"><img src="<?php echo maxButtons::get_plugin_url() ?>/images/mb-32.png" alt="MaxButtons" /></a>
		</div>
		
		<h2 class="title"><?php _e('MaxButtons: Support', 'maxbuttons') ?></h2>
		
		<div class="logo">
			<?php do_action("mb-display-logo"); ?> 
		</div>

		<div class="clear"></div>
        <div class="main">
		
			<?php do_action('mb-display-tabs'); ?> 
    		
    		<h4><?php printf(__('All support is handled through the %sSupport Forums%s.', 'maxbuttons'), apply_filters("mb-support-link", '<a href="http://wordpress.org/support/plugin/maxbuttons" target="_blank">'), '</a>') ?></h4>

    <div class="rss-feed">
          <h3><?php _e('Latest Support Questions', 'maxbuttons'); ?></h3>
              <?php
               
                  $content = file_get_contents('https://wordpress.org/support/rss/plugin/maxbuttons');
                  $x = new SimpleXmlElement($content);

                   
                  echo '<ul >';
                  $i = 0;
                  foreach($x->channel->item as $entry) {
                      if(strpos($entry->title, 'johnbhartley') === false && strpos($entry->title, 'Bas Schuiling') === false) {
                          $title = $entry->title;
                          $title = explode(" ", $title);
                          $title = array_slice($title, 7);
                          $time = $entry->pubDate;
                          $time = substr($time, 0, -9);
                          $support_title = '';
                          foreach($title as $word) {
                              $word = str_replace("\"", "", $word);
                              $support_title .= $word . ' ';
                          }
                          $support_title = trim($support_title);
                          echo '<li><a href="' . $entry->link . '" target="_blank" title="' . $support_title . '"><span>' . $support_title . '</span><br />' . $time . '</a></li>';
                          $i++;
                          if($i == 9) break;
                      }
                  }
                  echo '</ul>';
              
              ?>
            </div>




    		<h4><?php _e('You may be asked to provide the information below to help troubleshoot your issue.', 'maxbuttons') ?></h4>
    <form>	
    		<textarea class="system-info" readonly="readonly" wrap="off" >
----- Begin System Info ----- &#013;&#010;


<?php echo maxbuttons_system_label('WordPress Version:', get_bloginfo('version'), 4) ?>

<?php echo maxbuttons_system_label('PHP Version:', PHP_VERSION, 10) ?>

<?php  echo maxbuttons_system_label('MySQL Version:', mysql_get_server_info(), 8) ?>

<?php echo maxbuttons_system_label('Web Server:', $_SERVER['SERVER_SOFTWARE'], 11) ?>

<?php echo maxbuttons_system_label('WordPress URL:', get_bloginfo('wpurl'), 8) ?>

<?php echo maxbuttons_system_label('Home URL:', get_bloginfo('url'), 13) ?>

<?php echo maxbuttons_system_label('PHP cURL Support:', function_exists('curl_init') ? 'Yes' : 'No', 5) ?>

<?php echo maxbuttons_system_label('PHP GD Support:', function_exists('gd_info') ? 'Yes' : 'No', 7) ?>
<?php echo maxbuttons_system_label('PHP Memory Limit:', ini_get('memory_limit'), 5) ?>

<?php echo maxbuttons_system_label('PHP Post Max Size:', ini_get('post_max_size'), 4) ?>

<?php echo maxbuttons_system_label('PHP Upload Max Size:', ini_get('upload_max_filesize'), 2) ?>

<?php echo maxbuttons_system_label('WP_DEBUG:', defined('WP_DEBUG') ? WP_DEBUG ? 'Enabled' : 'Disabled' : 'Not set', 13) ?>
<?php echo maxbuttons_system_label('Multi-Site Active:', is_multisite() ? 'Yes' : 'No', 4) ?>

<?php echo maxbuttons_system_label('Operating System:', $browser['platform'], 5) ?>
<?php echo maxbuttons_system_label('Browser:', $browser['name'] . ' ' . $browser['version'], 14) ?>
<?php echo maxbuttons_system_label('User Agent:', $browser['user_agent'], 11) ?>

Active Theme:
<?php echo maxbuttons_system_label('-', $theme->get('Name') . ' ' . $theme->get('Version'), 1) ?>
<?php echo maxbuttons_system_label('', $theme->get('ThemeURI'), 2) ?>

Active Plugins:
<?php
$plugins = get_plugins();
$active_plugins = get_option('active_plugins', array());

foreach ($plugins as $plugin_path => $plugin) {
	// Only show active plugins
	if (in_array($plugin_path, $active_plugins)) {
		echo maxbuttons_system_label('-', $plugin['Name'] . ' ' . $plugin['Version'], 1);
	
		if (isset($plugin['PluginURI'])) {
			echo maxbuttons_system_label('', $plugin['PluginURI'], 2);
		}
		
		echo "\n";
	}
}
?>
----- End System Info -----
		  </textarea>
</form>
        </div>
        <div class="ad-wrap">
     		<?php do_action("mb-display-ads"); ?> 
    </div>
	</div>
</div>
