<?php
/*
Plugin Name: ThinkMine_Color_Picker
Description: Color Picker for ThinkMine
Author: DJ.JANG
Author URI: N/A
*/
?>
<?php
add_action( 'admin_enqueue_scripts', 'my_color_picker_function' );

function jcorgytce_enqueue_color_picker() {
   wp_enqueue_style( 'wp-color-picker' );
   wp_enqueue_script( 'script_handle', plugins_url('your_javascript_file.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
}

add_action('wp_head', 'my_style_incl_function', 10);
 
function my_style_incl_function() {
    wp_enqueue_style( 'wp-color-picker' );
}


?>