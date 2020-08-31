<?php
/**
 * This file contains the base interface for do-regex-stuff plus the
 * abstract class that provides default functionality.
 *
 * PHP VERSION: ^7.2
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */

require_once __DIR__.'/actions.interface.php';

/**
 * Defines the basic interface for objects that Do Regex Stuff
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */
abstract class RegexAction implements IRegexAction
{
    /**
     * Title for this action
     *
     * @var string
     */
    static protected $title = '';

    /**
     * Action string used to call the do stuff class
     *
     * NOTE: $_action must be the same as the classname
     *
     * @var string
     */
    static protected $action = '';

    private $_action = '';

    /**
     * Name of the group intended to use this action
     *
     * NOTE: Group name is supplied by user via $_GET variable.
     *       If $_group set here is either empty, or matches the
     *       "group" value in the get string then this action is
     *       listed in the menu
     *
     * @var string
     */
    static protected $group = '';

    /**
     * Whether or not to disable this action
     *
     * @var boolean
     */
    static protected $disable = false;

    /**
     * A brief description for this action
     *
     * @var string
     */
    static protected $description = '';

    /**
     * Help text to assist users of the action in understanding what
     * the action does (or is intended to do) and how to use the
     * action.
     *
     * @var string (HTML)
     */
    static protected $help = '';

    /**
     * Any additional form fields that should be rendered before the
     * main input field
     *
     * NOTE: This content in wrapped inside a <ul></ul> block
     *
     * @var string
     */
    protected $fieldsBefore = array();

    /**
     * Any additional form fields that should be rendered after the
     * main input field
     *
     * NOTE: This content in is also wrapped inside the same
     *       <ul></ul> block as $form_before
     *
     * @var string
     */
    protected $fieldsAfter = array();

    /**
     * Whether or not to hide the input textarea when returning the output
     * [default: FALSE]
     *
     * @var boolean
     */
    protected $hideInput = false;

    /**
     * Whether or not to return an empty input after each submission
     *
     * @var boolean
     */
    protected $cleanInput = false;

    /**
     * Whether or not to show UI to allow user to control whether or not
     * to return an empty input after each submission
     *
     * @var boolean
     */
    protected $userControlInputEmpty = false;

    /**
     * Whether or not to automatially clear the contents of the input
     * textarea field 5 seconds after the page is loaded.
     *
     * @var boolean
     */
    protected $autoCleanInput = false;

    /**
     * Whether or not to strip white space from the begining of the output string
     *
     * @var boolean
     */
    protected $doTrim = true;

    /**
     * Whether or not to show a second submit button after the form inputs
     *
     * @var boolean
     */
    protected $submitAfter = false;

    /**
     * Whether or not to show a reset button along with the second
     * submit button
     *
     * @var boolean
     */
    protected $showReset = false;

    /**
     * Whether or not to hide the "action" menu
     *
     * @var boolean
     */
    protected $hideMenu = false;

    /**
     * Error message caused by issues with user supplied content
     *
     * @var boolean
     */
    protected $error = '';

    /**
     * Custom CSS styling
     *
     * @var string
     */
    protected $css = '';


    protected $getKeys = array();
    protected $getVars = array();

    protected $postKeys = array();
    protected $postVars = array();


    // ==========================================
    // START: shared methods definitions

    /**
     * Get any form fields that should be rendered before the main
     * input field
     *
     * @param array $postVars Contents of the $_POST variable
     * @param array $getVars  Contents of the $_GET variable
     */
    public function __construct($postVars, $getVars)
    {
        if (!is_array($postVars)) {
            throw new Exception(
                'Action constructor expects first parameter '.
                '$postVars to be an array. '.
                gettype($postVars).' given.'
            );
        }

        $this->postVars = $this->extractValues($this->postKeys, $postVars);
        $this->getVars = $this->extractValues($this->getKeys, $getVars);
    }

    /**
     * Modify the user supplied input for this type of action
     *
     * @param string $input User input from post request
     *
     * @return string
     */
    abstract public function modify($input);

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
    final public function title()
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
     * Get the title for this action
     *
     * @return string
     */
    public function action()
    {
        return self::$action;
    }

    /**
     * Whether or not this action is disabled
     *
     * @return boolean
     */
    static final public function isDisabled()
    {
        return self::$disable;
    }

    /**
     * The name of the group who uses this action
     *
     * NOTE: Group name is supplied by user via $_GET variable.
     *       If $_group set here is either empty, or matches the
     *       "group" value in the get string then this action is
     *       listed in the menu
     *
     * @return string
     */
    static final public function getGroupName()
    {
        return self::$group;
    }

    /**
     * Get a brief description for this action
     *
     * @return string
     */
    static final public function getDescription()
    {
        return self::$description;
    }

    /**
     * Get name of group this action belongs to
     *
     * @return string
     */
    final public function getGroup()
    {
        return self::$group;
    }

    /**
     * Get the description for this action
     *
     * @return string
     */
    public final function description()
    {
        return self::$description;
    }

    /**
     * Get the HTML help content to assist user with using this action
     *
     * @return string
     */
    public function getHelp()
    {
        return $this->help;
    }

    /**
     * Error message caused by issues with user supplied content
     *
     * @return string
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * Get any custom CSS required by the UI for this action
     *
     * @return string
     */
    public final function getCustomCSS()
    {
        return $this->css;
    }

    /**
     * Get any form fields that should be rendered after the main
     * input field
     *
     * @return array
     */
    public function getFieldsAfter()
    {
        return $this->fieldsAfter;
    }

    /**
     * Get any form fields that should be rendered before the main
     * input field
     *
     * @return array
     */
    public function getFieldsBefore()
    {
        return $this->_fieldsBefore;
    }

    /**
     * Whether or not to hide user input field
     *
     * Used when generating content collected from the local file
     * system or a remote server
     *
     * @return boolean
     */
    public function hideInput()
    {
        return $this->hideInput;
    }

    /**
     * Whether or not return empty user input field with response
     *
     * @return boolean
     */
    public function cleanInput()
    {
        return $this->cleanInput;
    }

    /**
     * Whether or not return empty user input field with response
     *
     * @return boolean
     */
    public function autoCleanInput()
    {
        return $this->autoCleanInput;
    }

    /**
     * Whether or not to strip white space from the begining of the output string
     *
     * @return boolean
     */
    public function doTrim()
    {
        return $this->doTrim;
    }

    /**
     * Whether or not to strip white space from the begining of the output string
     *
     * @return boolean
     */
    public function submitAfter()
    {
        return $this->submitAfter;
    }

    /**
     * Whether or not to show a reset button along with the second
     * submit button
     *
     * @return boolean
     */
    public function showReset()
    {
        return $this->showReset;
    }

    /**
     * Whether or not to hide the "action" menu
     *
     * @return boolean
     */
    public function hideMenu()
    {
        return $this->hideMenu;
    }

    /**
     * Whether or not the user can control the what happens to the
     * main input field
     *
     * @return boolean
     */
    public function userControlInputEmpty()
    {
        return $this->userControlInputEmpty;
    }

    /**
     * Extract appropriate key/value pairs from array
     *
     * @param array $keys   List of keys expected to be found in $values
     * @param array $values $_POST or $_GET
     *
     * @return array;
     */
    protected function extractValues($keys, $values)
    {
        $output = array();
        for ($a = 0; $a < count($keys); $a += 1) {
            if (array_key_exists($keys[$a], $values)) {
                $output[$keys[$a]] = $values[$keys[$a]];
            }
        }
        return $output;
    }

    /**
     * Get a value from an array or use default value if the key is
     * not in the array
     *
     * @param string $key      Key to search for in the values array
     * @param array  $values   List of key/value pairs
     * @param mixed  $_default Value to use as default if key is not found
     *
     * @return mixed
     */
    protected function getVarOrDefault($key, $values, $_default)
    {
        return (array_key_exists($key, $values)) ? $values[$key] : $_default;
    }
}

// $doStuff->register('ActionName');
