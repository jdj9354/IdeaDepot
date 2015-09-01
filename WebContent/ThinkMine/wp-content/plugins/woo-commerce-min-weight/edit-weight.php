<?php
global $wpdb;
if(isset($_POST['blt_submit'])){
		extract($_POST);
		update_option( 'bd_woo_min_weight', $weight );	
		echo '<script>window.location = "?page=manage_link";</script>';
	}
$result = get_option( 'bd_woo_min_weight' );
?>
<div class="woo_form" style="width:50%;background-color: #ffffff;padding: 38px 20px 42px 37px;">
	<div class="text_msg" style="font-size: 18px;">This plugin allow you to set the Minimum Weight for an order in Woo-Coomerce</div>
    <br  />
    <br  />

<form action="" method="post">
	Set the Weight in K.G <input type="text" name="weight" value="<?php if(isset($result)){ echo $result;}?>" />
    <input type="submit" name="blt_submit" value="Save"  /><br/>
    <span style="color:#FF0000">Default Min Weight is 5 KG</span>
</form>
</div>
