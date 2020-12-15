<?php
/**
 * GFx Multiple Date Selector
 *
 *
 * @package   GFx Multiple Date Selector
 * @author    Branch
 * @license   GPL-3.0
 * @link      https://copt.dev
 */

namespace GFx\MultiDateSelector;

/**
 * @subpackage Plugin
 */
class Plugin
{

    /**
     * The variable name is used as the text domain when internationalizing strings
     * of text. Its value should match the Text Domain file header in the main
     * plugin file.
     *
     * @since    0.0.1
     *
     *
     * @var      string
     */
    protected $plugin_slug = GFX_PLUGIN_PLUGIN_SLUG;

    /**
     * Instance of this class.
     *
     * @since    0.0.1
     *
     *
     * @var      object
     */
    protected static $instance = null;
    /**
     * @var string
     */
    private $plugin_version;

    /**
     * Setup instance attributes
     *
     * @since     0.0.1
     *
     */
    private function __construct()
    {
        $this->plugin_version = GFX_MULTIDATESELECTOR_VERSION;
    }

    /**
     * Return the plugin slug.
     *
     * @return Plugin|string
     * @since    0.0.1
     *
     *
     */
    public function get_plugin_slug()
    {
        return $this->plugin_slug;
    }

    /**
     * Return the plugin version.
     *
     * @return string
     * @since    0.0.1
     *
     *
     */
    public function get_plugin_version()
    {
        return $this->plugin_version;
    }

    /**
     * Fired when the plugin is activated.
     *
     * @since    0.0.1
     *
     */
    public static function activate()
    {
        add_option('gfx_selected_dates');
    }

    /**
     * Fired when the plugin is deactivated.
     *
     * @since    0.0.1
     *
     */
    public static function deactivate()
    {
        //delete_option( 'gfx_selected_dates' );
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
        if (null === self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }
}
