<?php
/**
 * Plugin Name: Formidable Pro Add Color Picker Field
 * Plugin URI: http://broadstreetnetwork.com/
 * Description: Adds a Color Picker Field type to the Advanced Fields in Formidable Pro 
 * Version: 1.0
 * Author: Darryl Erentzen
 * Author URI: https://github.com/DarrylErentzen
 * License: GPL2
 */
 
/*  Copyright 2014  Darryl Erentzen  (email : derentzen@broadstreetnetwork.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/**
 * THIS PLUGIN MAKES USE OF 
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.3
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2011-11-03
 * @link    http://jscolor.com
 */
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

add_filter('frm_pro_available_fields', 'add_color_picker_field');
function add_color_picker_field($fields){
  $fields['color_picker'] = __('Color Picker'); // the key for the field and the label
  return $fields;
}

/* Set default options
When a new color_pickerfield is created, set default settings like the field name. */
add_filter('frm_before_field_created', 'set_color_picker_defaults');
function set_color_picker_defaults($field_data){
  if($field_data['type'] != 'color_picker'){ //change to your field key
    return $field_data;
  }
  $field_data['name'] = __('Color Picker');
  return $field_data;
}

//Show the color_picker field in the builder page
add_action('frm_display_added_fields', 'show_color_picker_admin_field');
function show_color_picker_admin_field($field){
  if ( $field['type'] != 'color_picker') {
    return;
  }
            
  $field_name = 'item_meta['. $field['id'] .']';
  ?>
<div style="width:100%;margin-bottom:10px;text-align:center;">
<div class="howto button-secondary frm_html_field">This is a placeholder for your Color Picker field.</div>   
</div>
<?php
}
/* Show the field in your form
Control the output for color_picker field in your form. */
add_action('frm_form_fields', 'show_my_color_picker_field', 10, 2);
function show_my_color_picker_field($field, $field_name){
  if ( $field['type'] != 'color_picker' ) {
    return;
  }
  $field['value'] = $field['value'];
?>
<input type="text" class="color {hash:true,caps:false}" id="field_<?php echo $field['field_key'] ?>" name="item_meta[<?php echo $field['id'] ?>]" value="<?php echo esc_attr($field['value']) ?>" <?php do_action('frm_field_input_html', $field) ?>/>
<?php
wp_enqueue_script('jscolor',plugins_url( 'jscolor/jscolor.js', __FILE__ ),'jquery');
}