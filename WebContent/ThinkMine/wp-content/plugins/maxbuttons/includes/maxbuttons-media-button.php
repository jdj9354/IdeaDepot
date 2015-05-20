<?php
global $pagenow;
?>

<?php // Only run in post/page creation and edit screens - also don't load when button is disabled ?>
<?php if (get_option('maxbuttons_noshowtinymce') == 1) return; ?> 
<?php if (in_array($pagenow, array('post.php', 'page.php', 'post-new.php', 'post-edit.php'))) { ?>
 
	<?php
	 $button = new maxButton();
	 $mbadmin = MaxButtonsAdmin::getInstance(); 
	 
	 $published_buttons = $mbadmin->getButtons(); 
	?>
	<script type="text/javascript">
		function insertButtonShortcode(button_id) {
			if (button_id == "") {
				alert("<?php _e('Please select a button.', 'maxbuttons') ?>");
				return;
			}
			
			// Send shortcode to the editor
			window.send_to_editor('[maxbutton id="' + button_id + '"]');
		}
	</script>
	
	<div id="select-maxbutton-container" style="display:none" >
		<div class="wrap">
			<h2 style="padding-top: 3px; padding-left: 40px; background: url(<?php echo maxButtons::get_plugin_url() . 'images/mb-32.png' ?>) no-repeat;">
				<?php _e('Insert Button into Editor', 'maxbuttons') ?>
			</h2>

			<p><?php _e('Select a button from the list below to place the button shortcode in the editor.', 'maxbuttons') ?></p>
			
			<table cellpadding="10" cellspacing="0" width="100%" class='media_button_table'>
			<?php foreach ($published_buttons as $b) { ?>
				<?php $id = intval($b["id"]); 
 			  		  $button->set($id);  ?>
				
				<tr>
					<td style="border-bottom: 1px solid #ccc; padding: 20px 0;">
						<a href="#" onclick="insertButtonShortcode(<?php echo $id ?>); return false;"><?php _e('Insert This Button', 'maxbuttons') ?></a> <span class="raquo">&raquo;</span>
						
						<?php 
							echo '<p style="margin: 0; font-size: 11px;">(' . $id . ') ';
							if($button->getDescription() != '') {
							echo '<strong>Description: </strong> ' . $button->getDescription() . '</p>';
						} ?>
					</td>
					<td style="border-bottom: 1px solid #ccc; padding: 20px 0;" class='media_row'>
						<?php $button->display( array("mode" => "preview", "preview_part" => "full") );  ?>
					</td>
				</tr>
			<?php } ?>
			</table>

			<a class="button-secondary" style="margin-left: 10px; margin-top: 10px;" onclick="tb_remove();"><?php _e('Cancel', 'maxbuttons') ?></a>
		</div>
	</div>
<?php } ?>
