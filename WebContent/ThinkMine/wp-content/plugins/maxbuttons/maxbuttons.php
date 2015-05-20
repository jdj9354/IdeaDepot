<?php
/*
Plugin Name: MaxButtons
Plugin URI: http://maxbuttons.com
Description: The best WordPress button generator. This is the free version; the Pro version <a href="http://maxbuttons.com/?ref=mbfree">can be found here</a>.
Version: 3.04
Author: Max Foundry
Author URI: http://maxfoundry.com

Copyright 2015 Max Foundry, LLC (http://maxfoundry.com)
*/
define("MAXBUTTONS_ROOT_FILE", __FILE__);
define('MAXBUTTONS_VERSION_NUM', '3.04');
define('MAXBUTTONS_RELEASE',"11 May 2015"); 

if ( version_compare(PHP_VERSION, '5.3.0', '<' ) ) {
 
	add_action( 'admin_notices', 'maxbuttons_php52_nono' ); 
	return;
}
	 	
function maxbuttons_php52_nono()
{
	$message = "From version 3 MaxButtons requires at least PHP 5.3 . You are running : " . PHP_VERSION;
	echo"<div class='error'> <h4>$message</h4></div>"; 
	return; 
}


// Copy this to wp-config.php
// define("MAXBUTTONS_BENCHMARK",false); 

require_once("classes/maxbuttons-class.php"); 

require_once('classes/button.php');
require_once("classes/installation.php"); 	
require_once("classes/max-utils.php"); 
require_once("classes/scssphp/scss.inc.php");
require_once("classes/maxCSSParser.php");
require_once("classes/admin-class.php");

require_once("includes/maxbuttons-admin-helper.php"); 
require_once("includes/arrays.php"); 
	if (! class_exists('simple_html_dom_node'))
		require_once("includes/simple_html_dom.php");


// runtime.
$m = new maxButtons();	

// Activation / deactivation
register_activation_hook(__FILE__, array("maxInstall",'activation_hook') );
register_deactivation_hook(__FILE__,array("maxInstall", 'deactivation_hook') );

?>
