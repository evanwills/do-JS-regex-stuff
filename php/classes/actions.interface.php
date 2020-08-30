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

/**
 * Defines the basic interface for objects that Do Regex Stuff
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */
interface IRegexAction
{
    /**
     * Get any form fields that should be rendered before the main
     * input field
     *
     * @param array $postVars Contents of the $_POST variable
     * @param array $getVars  Contents of the $_GET variable
     */
    public function __construct($postVars, $getVars);

    /**
     * Modify the user supplied input for this type of action
     *
     * @param string $input User input from post request
     *
     * @return string
     */
    function modify($input);

    /**
     * Get the title for this action
     *
     * @return string
     */
    static public function getTitle();

    /**
     * Get the title for this action
     *
     * @return string
     */
    static public function getAction();

    /**
     * Get the title for this action
     *
     * @return string
     */
    static public function getGroupName();

    /**
     * Whether or not this action is disabled
     *
     * @return boolean
     */
    static public function isDisabled();

    /**
     * Get a brief description for this action
     *
     * @return string
     */
    static public function getDescription();

    /**
     * Get the HTML help content to assist user with using this action
     *
     * @return string
     */
    public function getHelp();

    /**
     * Get the description for this action
     *
     * @return string
     */
    public function description();

    /**
     * Error message caused by issues with user supplied content
     *
     * @return string
     */
    public function getError();

    /**
     * Get any form fields that should be rendered after the main
     * input field
     *
     * @return string
     */
    public function getFieldsAfter();

    /**
     * Get any form fields that should be rendered before the main
     * input field
     *
     * @return string
     */
    public function getFieldsBefore();

    /**
     * Whether or not to hide user input field
     *
     * Used when generating content collected from the local file
     * system or a remote server
     *
     * @return boolean
     */
    public function hideInput();

    /**
     * Whether or not return empty user input field with response
     *
     * @return boolean
     */
    function cleanInput();

    /**
     * Whether or not return empty user input field with response
     *
     * @return boolean
     */
    public function autoCleanInput();

    /**
     * Whether or not the user can control the what happens to the
     * main input field
     *
     * @return boolean
     */
    public function userControlInputEmpty();

    /**
     * Whether or not to strip white space from the begining of the output string
     *
     * @return boolean
     */
    public function doTrim();

    /**
     * Whether or not to strip white space from the begining of the output string
     *
     * @return boolean
     */
    public function submitAfter();

    /**
     * Whether or not to show a reset button along with the second
     * submit button
     *
     * @return boolean
     */
    public function showReset();

    /**
     * Whether or not to hide the "action" menu
     *
     * @return boolean
     */
    public function hideMenu();

    /**
     * Error message caused by issues with user supplied content
     *
     * @return string
     */
    public function getCustomCSS();

}
