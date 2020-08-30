<?php
/**
 * This file contains a sample action class declaration to be used
 * as a template for creating new actions
 *
 * PHP VERSION: ^7.2
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */

/**
 * Defines a class that can be copied and used as the base code for
 * new actions
 *
 * __NOTE ALSO:__ see [README.actions.md](README.actions.md) for
 *           documentation about methods and properties that are
 *           declared on the base (abstract) class
 *           `actions-base.class.php`
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */
class BackwardsSort extends RegexAction
{
    /**
     * Title for this action
     *
     * @var string
     */
    static private $_title = 'Backwards sort';

    /**
     * Action string used to call the do stuff class
     *
     * NOTE: $_action must be the same as the classname
     *
     * @var string
     */
    static private $_action = 'BackwardsSort';

    /**
     * Description for this action
     *
     * @var string
     */
    static private $_description = '';

    /**
     * Get any form fields that should be rendered before the main
     * input field
     *
     * @param array $postVars Contents of the $_POST variable
     * @param array $getVars  Contents of the $_GET variable
     */
    public function __construct($postVars, $getVars)
    {
        parent::__construct($postVars, $getVars);

        // Initialise extra input fields here
    }

    /**
     * Modify the user supplied input for this type of stuff
     *
     * @param string $input User input from post request
     *
     * @return string
     */
    public function modify($input)
    {
        debug($input);
        $output = preg_split('`[\n\r]+`', $input);
        debug($output);

        for ($a = 0; $a < count($output); $a += 1) {
            $output[$a] = strrev(trim($output[$a]));
        }

        sort($output);

        for ($a = 0; $a < count($output); $a += 1) {
            $output[$a] = strrev($output[$a]);
        }
        $output = implode("\n", $output);

        return $output;
    }
}


$doStuff->register('BackwardsSort');
