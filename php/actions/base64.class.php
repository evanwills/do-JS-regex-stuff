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
 * __LASTLY:__ Don't forget to change $_disable to `FALSE`
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */
class Base64 extends RegexAction
{
    /**
     * Title for this action
     *
     * @var string
     */
    static protected $title = 'Base64 encode/decode';

    /**
     * Action string used to call the do stuff class
     *
     * NOTE: $_action must be the same as the classname
     *
     * @var string
     */
    static protected $action = 'Base64';

    /**
     * Whether or not to disable this action
     *
     * @var boolean
     */
    static protected $disable = true;

    /**
     * Description for this action
     *
     * @var string
     */
    static protected $description = '';

    protected $postKeys = array('mode');

    private $_encode = true;

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

        $mode = $this->getVarOrDefault('mode', $postVars, 'true');

        $this->_encode = (trim($mode) !== 'false');
    }

    /**
     * Get the title for this action
     *
     * @return string
     */
    static public function getTitle()
    {
        return self::$title;
    }

    /**
     * Get the title for this action
     *
     * @return string
     */
    static public function getAction()
    {
        return self::$action;
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
        if ($this->_encode) {
            return base64_encode($input);
        } else {
            $output = base64_decode($input, true);
            if ($output === false) {
                $this->error = 'Input contained invalid Base64 '.
                    'content. Could not decode input.';
                return '';
            } else {
                return $output;
            }
        }
    }
}


$doStuff->register('Base64');
