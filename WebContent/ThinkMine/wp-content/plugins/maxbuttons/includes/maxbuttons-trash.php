<?php
if (isset($_GET['id']) && $_GET['id'] != '') {
	$button_id = intval($_GET["id"]); // validation
	$button = new maxButton();
	$button->set($button_id);
	$button->setStatus('trash'); 
}
?>
<script type="text/javascript">
	window.location = "<?php admin_url() ?>admin.php?page=maxbuttons-controller&action=list&message=1";
</script>
