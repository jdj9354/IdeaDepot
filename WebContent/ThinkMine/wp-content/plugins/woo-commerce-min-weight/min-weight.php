<?php
/*
Plugin Name: Woo Commerce Minimum Weight
Plugin URI:  
Description: This plugin is used to set the minimum order of any product before checkout
Version: 2.0.0
Author: Hemant 
Author URI: 
*/
ob_start();
global $wpdbb_content_dir;
$plugin_dir = plugin_dir_url( __FILE__ ).'images/';
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
if(!function_exists('wp_get_current_user')){
	include(ABSPATH."wp-includes/pluggable.php") ; // Include pluggable.php for current user	
}
/*
 * Method :-- bd_installation_plugin
 * Task   :-- Add the option when the plugin is installed 
 * Hook   :-- register_activation_hook
*/

/**
 * Check if WooCommerce is active
 **/
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
function bd_installation_plugin() {
	global $wpdb;	
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    add_option( 'bd_woo_min_weight', '5', '', 'yes' );
}
register_activation_hook( __FILE__, 'bd_installation_plugin' );	
}
/*
 * Method :-- add_menu
 * Task   :-- Add menu to the admin 
 * Action   :-- admin_menu
*/ 
add_action('admin_menu', 'bd_add_menu');
function bd_add_menu() {
	add_menu_page('WooCommerce Weight', 'WooCommerce Weight', 'add_users', 'manage_link', 'edit_weight',plugin_dir_url( __FILE__ ).'image/members_icon.png');
}
/*
 * Method :-- edit_list
 * Task   :-- list all the backlinks that are save in the database 
 * Note   :-- Include the backlink_list.php
*/
function edit_weight() {
    global $menu, $submenu;
    require('edit-weight.php');
}

/*
 * Method :-- bd_min_weight
 * Task   :-- Set the minimum weight for a order before checkout process . 
 * Hook   :-- register_activation_hook
*/
add_action( 'woocommerce_check_cart_items','bd_min_weight' );
function bd_min_weight() {
	global $woocommerce;
	$minimum_weight_required = get_option( 'bd_woo_min_weight' );
	$weight = $woocommerce->cart->cart_contents_weight;
	if( $weight < $minimum_weight_required )
			$woocommerce->add_error( 'Minimum Weight of '. $minimum_weight_required
			. get_option( 'woocommerce_weight_unit' ) 
			.' Must Be Met. <a class="button" href="'
			. get_permalink( woocommerce_get_page_id( 'shop' ) ) 
			.'">&larr; Return To Shop</a>'  );
}
?>