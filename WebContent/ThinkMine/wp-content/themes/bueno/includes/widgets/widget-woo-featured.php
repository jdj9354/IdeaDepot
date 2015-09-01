<?php

class Bueno_featured extends WP_Widget {

   function Bueno_featured() {
	   $widget_ops = array('description' => 'Populate your sidebar with posts from a tag category.' );
       parent::WP_Widget(false, __('Woo - Featured Posts', 'woothemes'),$widget_ops);
   }


   function widget($args, $instance) {

    $args = array();
    $tag_name = '';
    $title = '';

    if ( ( isset( $instance['tag_id'] ) && '' != $instance['tag_id'] ) ) {
      $tag_name = get_term_by('id', $instance['tag_id'], 'post_tag');
    }

    if ( $tag_name && '' != $tag_name ) {
      $args = array( 'tag' => $tag_name->name, 'posts_per_page' => 5 );
    }

     $posts = get_posts( $args );

	  if( $title == '' ){
      $title = __( 'Featured Posts', 'woothemes' );
    }

     global $post;
     ?>
     <div id="featured" class="widget">
     <h3><?php echo $title; ?></h3>
        <ul>

            <?php if ($posts) : $count = 0; ?>
            <?php foreach ($posts as $post) : setup_postdata($post); $count++; ?>

			<li>
				<span class="thumb">
					<?php woo_get_image('image',70,70,'thumbnail',90,get_the_id(),'src',1,0,'','',true); ?>
				</span>
				<div class="right">
					<h4><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>
					<p><?php
					    if ( $instance['content'] == "excerpt") {
                the_excerpt();
              } else {
                the_content();
              }
					   ?></p>
				</div>
			</li>
                <!-- Post Ends -->

            <?php endforeach; else: ?>
            <?php endif; ?>
            </ul>

            <div class="fix"></div>

            </div>

            <?php




   }

   function update($new_instance, $old_instance) {
       return $new_instance;
   }

   function form($instance) {

      $tag_id = '';
      $num = '';
      $title = '';
      $content = 'exerpt';

      if ( isset( $instance['tag_id'] ) ) {
        $tag_id = esc_attr( $instance['tag_id'] );
      }

      if ( isset( $instance['num'] ) ) {
        $num = esc_attr( $instance['num'] );
      }

      if ( isset( $instance['title'] ) ) {
        $title = esc_attr( $instance['title'] );
      }

      if ( isset( $instance['content'] ) ) {
        $content = esc_attr( $instance['content'] );
      }

  ?>


		<p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:','woothemes'); ?></label> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
        </p>
        <p>
	   	   <label for="<?php echo $this->get_field_id('tag_id'); ?>"><?php _e('Media Tag:','woothemes'); ?></label>
	       <?php $tags = get_tags(); ?>
	       <select name="<?php echo $this->get_field_name('tag_id'); ?>" class="widefat" id="<?php echo $this->get_field_id('tag_id'); ?>">
           <option value="">-- Please Select --</option>
			<?php

           	foreach ($tags as $tag){
           	?><option value="<?php echo $tag->term_id; ?>" <?php if($tag_id == $tag->term_id){ echo "selected='selected'";} ?>><?php echo $tag->name . ' (' . $tag->count . ')'; ?></option><?php
           	}
           ?>
           </select>
       </p>
       <p>
          <label for="<?php echo $this->get_field_id('content'); ?>"><?php _e('Show Content:','woothemes'); ?></label>
          <select name="<?php echo $this->get_field_name('content'); ?>" class="widefat" id="<?php echo $this->get_field_id('content'); ?>">
           <option value="content" <?php if($content == "content"){ echo "selected='selected'";} ?>>The Content</option>
           <option value="excerpt" <?php if($content == "excerpt"){ echo "selected='selected'";} ?>>The Excerpt</option>
           </select>
       </p>
      <?php
   }

}

register_widget('Bueno_featured');