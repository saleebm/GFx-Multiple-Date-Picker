<?php

/**
 * @wordpress-plugin
 * Plugin Name:       GFx Multiple Date Selector
 * Plugin URI:        https://saleeb.org
 * Description:       React gravity forms calendar management integration for admin to select dates to block from multiple forms at once, used in conjunction with Gravity Forms and Gravity Perks Limit Dates.
 * Version:           0.0.1
 * Author:            Branch
 * Author URI:        https://saleeb.org
 * Text Domain:       gfx-multidateselector
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 *
 * GFx Multiple Date Selector
 *
 *
 * @package   GFx Multiple Date Selector
 * @author    Branch
 * @license   GPL-3.0
 * @link      https://copt.dev
 *
 */

namespace GFx\MultiDateSelector;

// If this file is called directly, abort.

defined('ABSPATH') || exit;

require __DIR__ . '/vendor/autoload.php';

use GFAddOn;
use GFx\MultiDateSelector\Endpoint\MultiDateSelectorRestController;
use GFx\MultiDateSelector\GFAddonSettings\GFMultiDateSelectorAddOn;

if (!defined('GFX_MULTIDATESELECTOR_VERSION')) {
    define('GFX_MULTIDATESELECTOR_VERSION', '0.0.1');
}

if (!defined('GFX_PLUGIN_PLUGIN_DIR')) {
    define('GFX_PLUGIN_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

if (!defined('GFX_PLUGIN_PLUGIN_URL')) {
    define('GFX_PLUGIN_PLUGIN_URL', plugin_dir_url(__FILE__));
}
if (!defined('GFX_PLUGIN_PLUGIN_SLUG')) {
    define('GFX_PLUGIN_PLUGIN_SLUG', 'gfx_multidateselector');
}

if (!defined('GFX_PLUGIN_PLUGIN_TITLE')) {
    define('GFX_PLUGIN_PLUGIN_TITLE', 'GFx Multiple Date Selector');
}

add_action('plugins_loaded', array('GFx\MultiDateSelector\GF_MultiDateSelector_AddOn_Bootstrap', 'load'));
add_action('gform_loaded', array('GFx\MultiDateSelector\GF_MultiDateSelector_AddOn_Bootstrap', 'initGFAddon'), 5);

/**
 * todo: make sure gf active, and gravity perks cond logic else display notice
 *
 * Class GF_MultiDateSelector_AddOn_Bootstrap
 * @package GFx\MultiDateSelector
 */
class GF_MultiDateSelector_AddOn_Bootstrap
{

    /**
     * Loads the date selector admin page
     */
    public static function load()
    {
        Plugin::get_instance();
        MultiDateSelectorRestController::get_instance();

        self::initializeDateLimitations();
    }

    /**
     * Loads the GF addon
     */
    public static function initGFAddon()
    {

        if (!method_exists('GFForms', 'include_addon_framework')) {
            return;
        }

        require_once('includes/GFAddOnSettings/GFMultiDateSelectorAddOn.php');

        GFAddOn::register('GFx\MultiDateSelector\GFAddonSettings\GFMultiDateSelectorAddOn');
    }

    public static function initializeDateLimitations()
    {
        $gfx_options = get_option('gfx_selected_dates');
        if (!empty($gfx_options)) {
            foreach ($gfx_options as $gfx_option) {
                if (!empty($gfx_option['name'])) {
                    $calendar_context = $gfx_option['name'];
                    new DateLimiter(array('calendar_context' => $calendar_context));
                }
            }
        }
    }
}

// returns instance for gf
function gf_multidateselector_addon()
{
    return GFMultiDateSelectorAddOn::get_instance();
}

/**
 * Register activation and deactivation hooks
 */
register_activation_hook(__FILE__, ['GFx\\MultiDateSelector\\Plugin', 'activate']);
register_deactivation_hook(__FILE__, ['GFx\\MultiDateSelector\\Plugin', 'deactivate']);
