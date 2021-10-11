<?php
/**
 * GFx Multiple Date Selector
 *
 *
 * @package   gfx-multidateselector
 * @author    Branch
 * @license   GPL-3.0
 * @link      https://copt.dev
 */

namespace GFx\MultiDateSelector\Endpoint;

use GFx\MultiDateSelector\Plugin;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * @subpackage REST_Controller
 */
class MultiDateSelectorRestController
{
    /**
     * Instance of this class.
     *
     * @since    0.0.1
     *
     *
     * @var      object
     */
    protected static $instance = null;
    public $plugin_slug = null;

    /**
     * Initialize the plugin by setting localization and loading public scripts
     * and styles.
     *
     * @since     0.0.1
     *
     */
    private function __construct()
    {
        $plugin = Plugin::get_instance();
        $this->plugin_slug = $plugin->get_plugin_slug();
    }

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks()
    {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Return an instance of this class.
     *
     * @return    object    A single instance of this class.
     * @since     0.0.1
     *
     *
     */
    public static function get_instance()
    {

        // If the single instance hasn't been set, set it now.
        if (null == self::$instance) {
            self::$instance = new self;
            self::$instance->do_hooks();
        }

        return self::$instance;
    }

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes()
    {
        $version = '1';
        $namespace = $this->plugin_slug . '/v' . $version;
        $endpoint = '/gfx-mds/';

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_gfx_mds'),
                'permission_callback' => array($this, 'gfx_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'update_gfx_mds'),
                'permission_callback' => array($this, 'gfx_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_gfx_mds'),
                'permission_callback' => array($this, 'gfx_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_gfx_mds'),
                'permission_callback' => array($this, 'gfx_permissions_check'),
                'args' => array(),
            ),
        ));

    }

    /**
     * Get Example
     *
     * @param WP_REST_Request $request Full data about the request.
     *
     * @return WP_Error|WP_REST_Response
     */
    public function get_gfx_mds($request)
    {
        $gfx_option = get_option('gfx_selected_dates');

        // Don't return false if there is no option
        if (!$gfx_option) {
            return new WP_REST_Response(array(
                'success' => true,
                'value' => ''
            ), 200);
        }

        return new WP_REST_Response(array(
            'success' => true,
            'value' => $gfx_option
        ), 200);
    }

    /**
     * Create OR Update Example
     *
     * @param WP_REST_Request $request Full data about the request.
     *
     * @return WP_Error|WP_REST_Response
     */
    public function update_gfx_mds($request)
    {
        $updated = update_option('gfx_selected_dates', $request->get_param('gfx_selected_dates'));

        return new WP_REST_Response(array(
            'success' => $updated,
            'value' => $request->get_param('gfx_selected_dates')
        ), 200);
    }

    /**
     * Delete Example
     *
     * @param WP_REST_Request $request Full data about the request.
     *
     * @return WP_Error|WP_REST_Response
     */
    public function delete_gfx_mds($request)
    {
        $deleted = delete_option('gfx_selected_dates');

        return new WP_REST_Response(array(
            'success' => $deleted,
            'value' => ''
        ), 200);
    }

    /**
     * Check if a given request has access to update a setting
     *
     * @param WP_REST_Request $request Full data about the request.
     *
     * @return WP_Error|bool
     */
    public function gfx_permissions_check($request)
    {
        return current_user_can('gravityforms_gfx');
    }
}
