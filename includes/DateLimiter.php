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

namespace GFx\MultiDateSelector;

use DateTime;
use Exception;

/**
 * Class DateLimiter
 * @package GFx\MultiDateSelector
 * @subpackage DateLimiter
 *
 * This class sets up the limits with the forms that have calendars selected
 */
class DateLimiter
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
    private $gfx_options = null;
    private $calendar_context = null;

    public $_args = array();

    public function __construct($args = array())
    {
        $this->_args = wp_parse_args($args, array(
            'calendar_context' => null
        ));
        if (empty($this->_args['calendar_context'])) {
            return;
        }
        // trying to learn from https://gist.githubusercontent.com/claygriffiths/c3ea68a141c90be678fba3bc2435fdbc/raw/0483708225ecad127af016fb52e40e19515de169/gw-gravity-forms-list-field-rows-by-field-value.php
        extract($this->_args); // gives $calendar_context
        if (!empty($calendar_context)) {
            $this->calendar_context = $calendar_context;
        }
        $this->do_hooks();
    }

    /**
     * Handle WP actions and filters.
     *
     * @since    0.0.1
     *
     */
    private function do_hooks()
    {
        $this->gfx_options = get_option('gfx_selected_dates');

        if (!empty($this->gfx_options)) {

            $gfx_ind_index = array_search($this->calendar_context, array_column($this->gfx_options, 'name'), true);
            $cal_context_options = $this->gfx_options[$gfx_ind_index];

            if (!empty($cal_context_options['fields']) && is_array($cal_context_options['fields']) && !empty($cal_context_options['name'])) {
                $fields = $cal_context_options['fields'];
                foreach ($fields as $field) {
                    add_filter("gpld_limit_dates_options_{$field}", array(
                        $this,
                        'limit_dates'
                    ), 10, 3);
                }
            }

        }

    }

    /**
     * Takes the given limitations from initialization (form id, calendar id, and the context) to enable the limitations on the calendar field
     *
     * @param $options
     * @param $_form
     * @param $_field
     *
     * @return mixed
     * @throws Exception
     */
    function limit_dates($options, $_form, $_field)
    {
        if (!empty($this->gfx_options)) {
            // find index of the all type to extract all limitations to mix into specific context limitations
            $gfx_all_index = array_search('all', array_column($this->gfx_options, 'name'), true);
            $gfx__all_opt = $this->gfx_options[$gfx_all_index];
            $all_date_opts = $gfx__all_opt['datesSelected'];

            $date_options = array();

            // add specific calendar contexts here
            if (!empty($this->calendar_context) || !(strcmp('all', $this->calendar_context))) {
                // find index of the registration type
                $gfx_ind_index = array_search($this->calendar_context, array_column($this->gfx_options, 'name'), true);
                $gfx_opts = $this->gfx_options[$gfx_ind_index];
                $date_options = $gfx_opts['datesSelected'];
            }

            // merge all with specific context type
            $dates_to_block = array_merge($all_date_opts, $date_options);

            $other_exceptions = array();

            if (!empty($options['exceptions'])) {
                $other_exceptions = array_merge($options['exceptions'], $other_exceptions);
            }
            $new_exceptions = array();

            //todo: check for proper date formatting
            foreach ($dates_to_block as $date) {
                $new_date = new DateTime($date);
                $new_exceptions[] = $new_date->format('m/d/Y');
            }
            $options['exceptionMode'] = 'disable';

            $options['exceptions'] = array_merge($new_exceptions, $other_exceptions);

            return $options;
        }

        return $options;
    }

}
