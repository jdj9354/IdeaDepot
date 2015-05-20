<?php
/*
Template Name: Full Width
*/
?>

<script src="/ThinkMineCV/js/ThinkMineLib.js"></script>
<script src="/ThinkMineCV/js/ThinkMineUILib.js"></script>
<?php get_header(); ?>

	<div id="content">

	<div class="page-title"><?php the_title(); ?></div>

		<?php do_action( 'bp_before_blog_page' ); ?>

		<div class="page" id="blog-page" role="main">
			<canvas id="tmCanvas" height = "800" width="1500"></canvas>	

			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>


				<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<div class="entry">

						<?php the_content( __('Read more','OneCommunity') ); ?>

						<?php wp_link_pages( array( 'before' => '<div class="page-link"><p>' . __( 'Pages: ', 'OneCommunity' ), 'after' => '</p></div>', 'next_or_number' => 'number' ) ); ?>

					</div>

				</div>

			<?php endwhile; endif; ?>

		</div><!-- .page -->

		<?php do_action( 'bp_after_blog_page' ); ?>

	<?php comments_template(); ?>

	</div><!-- #content -->

<?php get_footer(); ?>