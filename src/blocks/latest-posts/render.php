<?php

/**
 * Render WCDET Latest Posts block.
 *
 * @param  array  $attributes The block attributes.
 * @return string             The block markup.
 */
function wcdet_render_latest_posts_block( $attributes ) {

  if ( ! $attributes['numberOfPosts'] ) {
    return '';
  }

  $posts = wcdet_fetch_latest_posts( $attributes['numberOfPosts'] );

  if ( ! is_array( $posts ) ) {
    return '';
  }

  ob_start();

  ?>
  <div class="wp-block-wcdet-latest-posts">
    <?php foreach ( $posts as $post ) : ?>
      <p>
        <a href="<?php echo esc_url( $post->link ); ?>"><?php echo esc_html( $post->title->rendered ); ?></a>
      </p>
    <?php endforeach; ?>
  </div>
  <?php

  return ob_get_clean();
}
register_block_type( 'wcdet/latest-posts', array( 'render_callback' => 'wcdet_render_latest_posts_block' ) );

/**
 * Fetch the latest WCDET posts.
 *
 * @param  int        $number_of_posts The number of posts to fetch.
 * @return array|null                  The posts on null on failure.
 */
function wcdet_fetch_latest_posts( $number_of_posts ) {
  $url           = 'https://2018.detroit.wordcamp.org/wp-json/wp/v2/posts/?per_page=' . $number_of_posts;
  $response      = wp_remote_get( $url );
  $response_code = wp_remote_retrieve_response_code( $response );

  if ( 200 !== $response_code ) {
    return null;
  }

  return json_decode( wp_remote_retrieve_body( $response ) );
}
