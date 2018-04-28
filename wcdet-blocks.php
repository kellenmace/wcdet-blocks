<?php
/**
 * Plugin Name: WordCamp Detroit Gutenberg Blocks
 * Description: Gutenberg Blocks for WordCamp Detroit
 * Author: Kellen Mace
 * Author URI: https://kellenmace.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function wcdet_init() {

	// @todo: When Gutenberg is rolled into WP core, change this
	// to a version_compare() and update the error message.
	if ( ! function_exists( 'register_block_type' ) ) {
		add_action( 'admin_notices', 'wcdet_require_gutenberg' );
		return;
	}

	require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
}
add_action( 'plugins_loaded', 'wcdet_init' );

/**
 * If Gutenberg is not active, display an admin error message
 * and deactivate this plugin.
 */
function wcdet_require_gutenberg() {
	?>
	<div class="error"><p><?php esc_html_e( 'WordCamp Detroit Gutenberg Blocks requires that the Gutenberg plugin is activated.', 'wcdet' ); ?></p></div>
	<?php

	deactivate_plugins( array( 'wcdet-blocks/wcdet-blocks.php' ) );
}
