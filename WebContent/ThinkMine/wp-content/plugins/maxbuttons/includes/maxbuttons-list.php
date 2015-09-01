<?php
$result = '';
$button = new maxButton(); 

$view = (isset($_GET["view"])) ? sanitize_text_field($_GET["view"]) : "all"; 


if (isset($_POST) && isset($_POST["mb-list-nonce"])  ) {
	$verify = wp_verify_nonce( $_POST['mb-list-nonce'], 'mb-list' );
	if (! $verify ) echo " Nonce not verifed"; 

	if ($verify && isset($_POST['button-id']) && isset($_POST['bulk-action-select'])) {
		if ($_POST['bulk-action-select'] == 'trash') {
			$count = 0;
			
			foreach ($_POST['button-id'] as $id) {
				$id = intval($id);
				$button->set($id);
				$button->setStatus('trash'); 
				$count++;
			}
			
			if ($count == 1) {
				$result = __('Moved 1 button to the trash.', 'maxbuttons');
			}
			
			if ($count > 1) {
				$result = __('Moved ', 'maxbuttons') . $count . __(' buttons to the trash.', 'maxbuttons');
			}
		}
	}
	if ($verify && $_POST['bulk-action-select'] == 'restore') {
			$count = 0;
			
			foreach ($_POST['button-id'] as $id) {
				$id = intval($id);
				$set = $button->set($id,'','trash');
				$button->setStatus('publish'); 
				
				//maxbuttons_button_restore($id);
				$count++;
			}

			if ($count == 1) {
				$result = __('Restored 1 button.', 'maxbuttons');
			}
			
			if ($count > 1) {
				$result = __('Restored ', 'maxbuttons') . $count . __(' buttons.', 'maxbuttons');
			}
			$view = 'all'; // switch to normal list. 
	}
		
	if ($verify && $_POST['bulk-action-select'] == 'delete') {
		$count = 0;
		
		foreach ($_POST['button-id'] as $id) {
			$id = intval($id);
			$button->delete($id);
			$count++;
		}

		if ($count == 1) {
			$result = __('Deleted 1 button.', 'maxbuttons');
		}
		
		if ($count > 1) {
			$result = __('Deleted ', 'maxbuttons') . $count . __(' buttons.', 'maxbuttons');
		}
	}	
}

if (isset($_GET['message']) && $_GET['message'] == '1') {
	$result = __('Moved 1 button to the trash.', 'maxbuttons');
}

if (isset($_GET['message']) && $_GET['message'] == '1restore') {
	$result = __('Restored 1 button.', 'maxbuttons');
}

if (isset($_GET['message']) && $_GET['message'] == '1delete') {
	$result = __('Deleted 1 button.', 'maxbuttons');
}

$args = array();
if (isset($_GET["orderby"])) 
	$args["orderby"] = $_GET["orderby"]; 
if (isset($_GET["order"])) 
	$args["order"] = $_GET["order"]; 

$mbadmin = MaxButtonsAdmin::getInstance(); 

if (isset($_GET["paged"]) && $_GET["paged"] != '') 
{
	$page = intval($_GET["paged"]); 
	$args["paged"] = $page;
}  

if ($view == 'trash') 
	$args["status"] = "trash"; 
$published_buttons = $mbadmin->getButtons($args);

//$trashed_buttons = $mbadmin->getButtons(array("status" => "trash"));
$published_buttons_count = $mbadmin->getButtonCount(array());
$trashed_buttons_count = $mbadmin->getButtonCount(array("status" => "trash")); 

$args["view"] = $view; 

$pagination = $mbadmin->getButtonPages($args); 

?>

<script type="text/javascript">
	jQuery(document).ready(function() {
		jQuery("#bulk-action-all").click(function() {
			jQuery("#maxbuttons input[name='button-id[]']").each(function() {
				if (jQuery("#bulk-action-all").is(":checked")) {
					jQuery(this).attr("checked", "checked");
				}
				else {
					jQuery(this).removeAttr("checked");
				}
			});
		});
		
	});
</script>

<div id="maxbuttons">
	<div class="wrap">
		<div class="icon32">
			<a href="http://maxbuttons.com" target="_blank"><img src="<?php echo maxButtons::get_plugin_url() ?>images/mb-32.png" alt="MaxButtons" /></a>
		</div>
		
		<h2 class="title"><?php _e('MaxButtons: Button List', 'maxbuttons') ?></h2>
		
		<div class="logo">
			<?php do_action("mb-display-logo"); ?> 

		</div>
		
		<div class="clear"></div>
		<div class="main">
			<?php do_action('mb-display-tabs'); ?> 

			<div class="form-actions">
				<a class="button-primary" href="<?php echo admin_url() ?>admin.php?page=maxbuttons-controller&action=button"><?php _e('Add New', 'maxbuttons') ?></a>
			</div>

			<?php if ($result != '') { ?>
				<div class="mb-message"><?php echo $result ?></div>
			<?php } ?>
			
			<p class="status">
			<?php
				$url = admin_url() . "admin.php?page=maxbuttons-controller&action=list";
				$trash_url =  $url . "&view=trash"; 
				
				if ($view == 'trash') 
				{
					$all_line = "<strong><a href='$url'>"  .  __('All', 'maxbuttons') . "</strong></a>";
					$trash_line = __("Trash", "maxbuttons"); 
				}
				else
				{
					$all_line = __("All","maxbuttons"); 
					$trash_line = "<a href='$trash_url'>" . __("Trash","maxbuttons") . "</strong></a>"; 
				}
			?>
				 <?php echo $all_line ?><span class="count">(<?php echo $published_buttons_count ?>)</span>

				<?php if ($trashed_buttons_count > 0) { ?>
					<span class="separator">|</span>
					<?php echo $trash_line ?> <span class="count">(<?php echo $trashed_buttons_count ?>)</span>
				<?php } ?>
			</p>

			<ul class="pagination"> 
				<?php echo $pagination ?> 
			</ul>			
			
			<form method="post">
				<input type="hidden" name="view" value="<?php echo $view ?>" /> 
				<?php wp_nonce_field("mb-list","mb-list-nonce");  ?>
				
				<select name="bulk-action-select" id="bulk-action-select">
					<option value=""><?php _e('Bulk Actions', 'maxbuttons') ?></option>
				<?php if ($view == 'all'): ?>
	
					<option value="trash"><?php _e('Move to Trash', 'maxbuttons') ?></option>
				<?php endif; 
					if ($view == 'trash'): ?>
						<option value="restore"><?php _e('Restore', 'maxbuttons') ?></option>
						<option value="delete"><?php _e('Delete Permanently', 'maxbuttons') ?></option>
				<?php endif; ?> 
				</select>
				<input type="submit" class="button" value="<?php _e('Apply', 'maxbuttons') ?>" />
			
<?php 

			$link_order = (! isset($_GET["order"]) || $_GET["order"] == "DESC") ? "ASC" : 'DESC';
								
			$sort_url = add_query_arg(array(
				"orderby" => "name",
				"order" => $link_order
				));		
?>
			
				<div class="button-list preview-buttons">		
				
					<div class="heading"> 
						<span class='col col_check'><input type="checkbox" name="bulk-action-all" id="bulk-action-all" /></span>
						<span class='col col_button'><?php _e('Button', 'maxbuttons') ?></span>
						<span class="col col_name manage-column column-name sortable <?php echo strtolower($link_order) ?>">
							<a href="<?php echo $sort_url ?>">
							<span><?php _e('Name and Description', 'maxbuttons') ?></span>							
							<span class="sorting-indicator"></span>
							</a>
						</span>
						<span class='col col_shortcode'><?php _e('Shortcode', 'maxbuttons') ?></span>
 
													
					</div>
					<?php foreach ($published_buttons as $b): 
						$id = $b["id"]; 
						if($view == 'trash') 
							$button->set($id,'','trash');
						else 
							$button->set($id);
						
					?> 
						<div class='button-row'>
						<span class="col col_check"><input type="checkbox" name="button-id[]" id="button-id-<?php echo $id ?>" value="<?php echo $id ?>" /></span>
						<span class="col col_button"><div class="shortcode-container">
										<?php 
											//echo do_shortcode('[maxbutton id="' . $id . '" externalcss="false" ignorecontainer="true"]'); 
										
										$button->display( array("mode" => "preview") ); 
										?>
								</div>
								<div class="actions">
								<?php if($view == 'all') : ?>
								<a href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=button&id=<?php echo $id ?>"><?php _e('Edit', 'maxbuttons') ?></a>
									<span class="separator">|</span>
									<a href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=copy&id=<?php echo $id ?>"><?php _e('Copy', 'maxbuttons') ?></a>
									<span class="separator">|</span>
									<a href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=trash&id=<?php echo $id ?>"><?php _e('Move to Trash', 'maxbuttons') ?></a>
								<?php endif; 
								if ($view == 'trash'): 
								?> 
								<a href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=restore&id=<?php echo $id ?>"><?php _e('Restore', 'maxbuttons') ?></a>
								<span class="separator">|</span>
								<a href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=delete&id=<?php echo $id ?>"><?php _e('Delete Permanently', 'maxbuttons') ?></a>
								<?php endif; ?> 	
								</div>
									
						</span>
						<span class="col col_name"><a class="button-name" href="<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=button&id=<?php echo $id ?>"><?php echo $button->getName() ?></a>
									<br />
									<p><?php echo $button->getDescription() ?></p>
						</span>
						<span class="col col_shortcode">									[maxbutton id="<?php echo $id ?>"]<br />
									[maxbutton name="<?php echo $button->getName() ?>"]</span>
						</div> 
					<?php endforeach; // buttons ?>	 
		

				</div>
			</form>
			
		<ul class="pagination"> 
				<?php echo $pagination ?> 
		</ul>
					
		</div>
	</div>
	<div class="ad-wrap">
		<?php do_action("mb-display-ads"); ?> 
	</div>

</div>
