<?php
/*-----------------------------------------------------------------------------------*/
/* Load the widgets, with support for overriding the widget via a child theme.
/*-----------------------------------------------------------------------------------*/

$widgets = array(
				'includes/widgets/widget-woo-adspace.php',
				'includes/widgets/widget-woo-flickr.php',
				'includes/widgets/widget-woo-featured.php',
				'includes/widgets/widget-woo-campaign-monitor.php'
				);

// Allow child themes/plugins to add widgets to be loaded.
$widgets = apply_filters( 'woo_widgets', $widgets );

	foreach ( $widgets as $w ) {
		locate_template( $w, true );
	}

?>