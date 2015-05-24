<?php
/*
Template Name: Full Width
*/
?>

<script src="/ThinkMineCV/js/ThinkMineLib.js"></script>
<script src="/ThinkMineCV/js/ThinkMineUILib.js"></script>

<script src="/thidparty/gradx-master/lib/js/jquery.js"></script>


<script src="/thidparty/gradx-master/colorpicker/js/colorpicker.js"></script>
<script src="/thidparty/gradx-master/dom-drag.js"></script>

<script src="/thidparty/gradx-master/gradX.js"></script>

<link type="text/css" rel="stylesheet" href="/thidparty/gradx-master/gradX.css" />
<link type="text/css" rel="stylesheet" href="/thidparty/gradx-master/colorpicker/css/colorpicker.css" />

<style type='text/css'>
.maxbutton-1.maxbutton {
  position : relative;
  text-decoration : none;
  display : inline-block;
  cursor : default;
  width : 158px;
  border-color : #eb0316;
  border-top-left-radius : 4px;
  border-top-right-radius : 4px;
  border-bottom-left-radius : 4px;
  border-bottom-right-radius : 4px;
  border-style : double;
  border-width : 1px;
  background: #f70000;
  -pie-background: linear-gradient(#f70000 45%, #b01515);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(45%, #f70000), color-stop(1, #b01515));
  background: -moz-linear-gradient(#f70000 45%, #b01515);
  background: -o-linear-gradient(#f70000 45%, #b01515);
  background: linear-gradient(#f70000 45%, #b01515);
  -webkit-box-shadow: 0px 0px 2px #333;
  -moz-box-shadow: 0px 0px 2px #333;
  box-shadow: 0px 0px 2px #333; }

.maxbutton-1.maxbutton:hover {
  border-color : #eb0316;
  background: #b01515;
  -pie-background: linear-gradient(#b01515 45%, #f70000);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(45%, #b01515), color-stop(1, #f70000));
  background: -moz-linear-gradient(#b01515 45%, #f70000);
  background: -o-linear-gradient(#b01515 45%, #f70000);
  background: linear-gradient(#b01515 45%, #f70000);
  -webkit-box-shadow: 0px 0px 2px #333;
  -moz-box-shadow: 0px 0px 2px #333;
  box-shadow: 0px 0px 2px #333; }

.maxbutton-1.maxbutton .mb-text {
  font-family : Verdana;
  font-size : 16px;
  font-style : normal;
  font-weight : normal;
  padding-top : 15px;
  padding-right : 25px;
  padding-bottom : 15px;
  padding-left : 25px;
  line-height : 1em;
  box-sizing : border-box;
  display : block;
  color : #fff; }

.maxbutton-1.maxbutton:hover .mb-text {
  color : #fff; }</style>

<?php get_header(); ?>

	<div id="content">

	<div class="page-title"><?php the_title(); ?></div>
		<?php do_action( 'bp_before_blog_page' );  ?>

	
		<a  class="maxbutton-1 maxbutton" href="javascript:void(0);"><span class='mb-text'>Add MindMap</span></a>
		<div class="page" id="blog-page" role="main">
			
			<div id="tmWorkingArea">
				<div style="display:inline; vertical-align: top;"><canvas id="tmCanvas"  style="border:1px solid #000000;"></canvas></div>
				<div style="display:inline; vertical-align: middle;"><div id="tm_main_cp"></div></td></div>
			</div>
			
			<script>
				$('#tm_main_cp').spectrum({
					move: function(color) {
						;
					},
					change: function() {
						;
					},
					flat: true,
					showAlpha: true,
					color: "#ffffff",
					clickoutFiresChange: true,
					showInput: true,
					showButtons: false
				});
				
				$('#tmCanvas')[0].width = $('#blog-page')[0].offsetWidth - $('.sp-container')[0].offsetWidth * 1.1;
				$('#tmCanvas')[0].height = $('#tmCanvas')[0].offsetWidth * 0.8;
				$('.sp-container')[0].style.verticalAlign="top";
		
			</script>

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