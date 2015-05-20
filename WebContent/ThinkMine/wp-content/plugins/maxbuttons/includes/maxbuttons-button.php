<?php
include_once 'arrays.php';
//include_once 'constants.php';


$button = new maxButton();
$button_id = 0; 

 
if ($_POST) {
	$button_id = intval($_POST["button_id"]); 

	if ($button_id > 0) 
		$button->set($button_id);
	$return = $button->save($_POST); 
	if (is_int($return) && $button_id <= 0) 
		$button_id = $return;
 
	$button->set($button_id);	
	wp_redirect(admin_url('admin.php?page=maxbuttons-controller&action=button&id=' . $button_id));
}
	
if (isset($_GET['id']) && $_GET['id'] != '') { 
	$button_id = intval($_GET["id"]); 
	$button->set($button_id);
}

 
?>
<div id="maxbuttons">
	<div class="wrap">
		<div class="icon32">
			<a href="http://maxbuttons.com" target="_blank"><img src="<?php echo maxButtons::get_plugin_url() ?>/images/mb-peach-icon.png" alt="MaxButtons" /></a>
		</div>
		
		<h2 class="title"><?php _e('MaxButtons: Add/Edit Button', 'maxbuttons') ?></h2>
		
		<div class="logo">
			<?php do_action("mb-display-logo"); ?> 
		</div>
		
		<div class="clear"></div>

			<?php do_action('mb-display-tabs'); ?> 
	
		<form id="new-button-form" action="<?php echo admin_url('admin.php?page=maxbuttons-controller&action=button&noheader=true'); ?>" method="post">
			<input type="hidden" name="button_id" value="<?php echo $button_id ?>"> 
			<?php wp_nonce_field("button-edit","maxbuttons_button") ?>
			
			<div class="form-actions">				
				<a class="button-primary button-save"><?php _e('Save', 'maxbuttons') ?></a>
				<a id="button-copy" class="button" href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=copy&id=<?php echo $button_id ?>"><?php _e('Copy', 'maxbuttons') ?></a>
				<a id="button-trash" class="button" href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=trash&id=<?php echo $button_id ?>"><?php _e('Move to Trash', 'maxbuttons') ?></a>
				<a id="button-delete" class="button" href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=delete&id=<?php echo $button_id ?>"><?php _e('Delete Permanently', 'maxbuttons') ?></a>
			</div>
			
			<?php if ($button_id > 0): ?>
			<div class="mb-message">
				<?php _e('To use this button, place the following shortcode anywhere in your site content:', 'maxbuttons') ?>
				<strong>[maxbutton id="<?php echo $button_id ?>"]</strong> or <strong>[maxbutton name="<?php echo $button->getName(); ?>"]</strong> 
			</div>
			<?php endif; ?>
			
			<?php #### STARTING FIELDS; 
			
				
			$button->admin_fields();
			
			?> 

			<div class="form-actions">				
				<a class="button-primary button-save"><?php _e('Save', 'maxbuttons') ?></a>
			</div>
		</form>

		<div class="output">
			<div class="header"><?php _e('Button Output', 'maxbuttons') ?></div>
			<div class="inner">
 
				<?php _e('The top is the normal button, the bottom one is the hover.', 'maxbuttons') ?>
				<div class="result">

					<?php $button->display(array("mode" => 'editor', "load_css" => "element"));  ?> 
 
					<p>&nbsp;</p>
 
					<?php $button->display(array("mode" => 'editor', "preview_part" => ":hover", "load_css" => "element")); ?> 
					
					<?php $button->display_field_map(); ?> 
				</div>
				
				<input type='hidden' id='colorpicker_current' value=''>
				
				<span class="colorpicker-box" id="button_preview_box">
					
					<span></span>
				</span>
				<input  type="hidden" id="button_preview" value='' />
				<input style="display: none;" type="text" id="button_output" name="button_output" value="" />
				<div class="note"><?php _e('Change this color to see your button on a different background.', 'maxbuttons') ?></div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>
