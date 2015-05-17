<li class="forum-lastposts">
	<div class="forum-lastposts-avatar"><?php bbp_author_link( array( 'post_id' => bbp_get_topic_last_active_id(), 'size' => 45, 'type' => 'avatar' ) ); ?></div>

	<div class="activity-content">
	<a href="<?php bbp_topic_permalink(); ?>" class="widget_topic_title" title="<?php bbp_topic_title(); ?>"><?php bbp_topic_title(); ?></a><br />

		<div class="activity-content-details">
		<?php bbp_author_link( array( 'post_id' => bbp_get_topic_last_active_id(), 'type' => 'name' ) ); ?>
		<?php bbp_topic_freshness_link(); ?>
		<?php  _e( 'in',  'OneCommunity' ); ?> <a href="<?php echo bbp_get_forum_permalink( bbp_get_topic_forum_id() ) ?>"><?php echo bbp_get_forum_title( bbp_get_topic_forum_id() ); ?></a>
		</div>
	</div>
</li>