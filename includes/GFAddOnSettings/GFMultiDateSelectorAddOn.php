<?php

namespace GFx\MultiDateSelector\GFAddOnSettings;

use GFAddOn;
use GFAPI;
use GFForms;
use GFx\MultiDateSelector\Plugin;

GFForms::include_addon_framework();

class GFMultiDateSelectorAddOn extends GFAddOn {

	protected $_min_gravityforms_version = '1.9';
    //	protected $_path = 'gfx-multiple-date-picker/includes/GravityFormsAddon/class-gfmultidateselectoraddon.php';
	protected $_full_path = __FILE__;
	protected $_title = 'GFx Multiple Date Selector';
	protected $_short_title = 'Multiple Date Selector';

	private static $_instance = null;

	/**
	 * Get an instance of this class.
	 *
	 * @return GFMultiDateSelectorAddOn
	 */
	public static function get_instance() {
		if ( self::$_instance == null ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 *
	 */
	public function init() {
		parent::init();
		$plugin         = Plugin::get_instance();
		$this->_slug    = $plugin->get_plugin_slug();
		$this->_version = $plugin->get_plugin_version();
		$this->init_roles();
		$plugin_basename = plugin_basename( plugin_dir_path( realpath( __DIR__ ) ) . $this->_slug . '.php' );
		// Add plugin action link point to settings page
		add_filter( 'plugin_action_links_' . $plugin_basename, array(
			$this,
			'add_action_links'
		) );
	}

	private function init_roles() {
		$roles = array( get_role( 'administrator' ) );
		foreach ( $roles as $role ) {
			$role->add_cap( 'edit_gfx_calendar' );
		}
	}


	/**
	 * Add settings action link to the plugins page.
	 *
	 * @param $links
	 *
	 * @return array
	 * @since    0.0.1
	 *
	 */
	public function add_action_links( $links ) {
		return array_merge(
			array(
				'settings' => '<a title="Go to ' . $this->_title . ' settings" href="' . admin_url( 'options-general.php?page=' . $this->_slug ) . '">' . __( 'Settings', $this->_slug ) . '</a>',
			),
			$links
		);
	}

	// # SCRIPTS & STYLES -----------------------------------------------------------------------------------------------

	/**
	 * Return the scripts which should be enqueued.
	 *
	 * @return array
	 */
	public function scripts() {
		$scripts = array(
			array(
				'handle'    => $this->_slug . '_runtime_script',
				'src'       => GFX_PLUGIN_PLUGIN_URL . '/dist/runtime.js',
				'version'   => $this->_version,
				'strings'   => array(
					'api_nonce'   => wp_create_nonce( 'wp_rest' ),
					'api_url'     => rest_url( $this->_slug . '/v1/' ),
					'date_fields' => $this->get_gfx_fields()
				),
				'enqueue'   => array(
					array(
						'admin_page' => array( 'plugin_page' ),
					)
				),
				'in_footer' => true
			),
			array(
				'handle'    => $this->_slug . '-common-script',
				'src'       => GFX_PLUGIN_PLUGIN_URL . '/dist/common.js',
				'version'   => $this->_version,
				'enqueue'   => array(
					array(
						'admin_page' => array( 'plugin_page' ),
					)
				),
				'in_footer' => true
			),
			array(
				'handle'    => $this->_slug . '-admin-script',
				'src'       => GFX_PLUGIN_PLUGIN_URL . '/dist/admin.js',
				'version'   => $this->_version,
				'enqueue'   => array(
					array(
						'admin_page' => array( 'plugin_page' ),
					)
				),
				'in_footer' => true
			),
		);

		return array_merge( parent::scripts(), $scripts );
	}

	/**
	 * Return the stylesheets which should be enqueued.
	 *
	 * @return array
	 */
	public function styles() {
		$styles = array(
			array(
				'handle'  => $this->_slug . '-common-style',
				'src'     => GFX_PLUGIN_PLUGIN_URL . '/dist/styles/common.css',
				'version' => $this->_version,
				'enqueue' => array(
					array( 'admin_page' => array( 'plugin_page' ) )
				)
			)
		);

		return array_merge( parent::styles(), $styles );
	}

	// # FRONTEND FUNCTIONS --------------------------------------------------------------------------------------------

	/**
	 * Creates a custom page for this add-on.
	 */
	public function plugin_page() {
		echo '<div id="⚛"></div>';
	}

	// # ADMIN FUNCTIONS -----------------------------------------------------------------------------------------------

	/**
	 * @return array The choices of form calendars available
	 */
	public function get_gfx_fields() {
		$form_date_fields = array();
		$forms            = GFAPI::get_forms();
		foreach ( $forms as $form ) {
			$form_id = $form['id'];
			$form_name = $form['title'];
			$fields  = GFAPI::get_fields_by_type( $form, array( 'date' ), true );
			if ( ! empty( $fields ) ) {
				$choices = array();

				foreach ( $fields as $GF_field ) {
					$field_key = "Field #{$GF_field['id']} - {$GF_field['label']}";
					array_push( $choices, array(
						'label' => esc_html__( $field_key, 'gfx-multidateselector' ),
						'value' => "{$form_id}_{$GF_field['id']}"
					) );
				}

				array_push( $form_date_fields, array(
					'label'   => esc_html__( "{$form_name} ID #{$form_id}", 'gfx-multidateselector' ),
					'choices' => $choices
				) );
			}
		}

		return $form_date_fields;
	}

}
