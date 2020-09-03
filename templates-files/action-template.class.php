<?php
/**
 * This file contains a sample action class declaration to be used
 * as a template for creating new actions.
 *
 * New actions should be saved into the /php/actions/ directory
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
class ActionTemplate extends RegexAction
{
    /**
     * Title for this action
     *
     * @var string
     */
    public const TITLE = '';

    /**
     * Action string used to call the do stuff class
     *
     * NOTE: ACTION must be the same as the classname
     *
     * @var string
     */
    public const ACTION = '';

    /**
     * Description for this action
     *
     * @var string
     */
    public const DESCRIPTION = '';

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

        // Handle GET and POST variables (but not "input") here
    }

    /**
     * Modify the user supplied input for this type of stuff
     *
     * @param string $input User input from post request
     *
     * @return string content that gets sent back to the client
     */
    public function modify($input)
    {
        // All the work for modifying should be here (or if other
        // private methods are used, those methods should be called
        // here)

        $output = $input;

        // This is what gets sent back to the client
        return $output;
    }
}

$doStuff->register('');
