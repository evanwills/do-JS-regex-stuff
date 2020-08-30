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
class DoStuff
{
    /**
     * User supplied action
     *
     * @var string
     */
    private $_getAction = '';

    /**
     * Name of action class
     *
     * @var string
     */
    private $_action = '';

    /**
     * Name of action class
     *
     * @var IAction
     */
    private $_actionObject = null;

    /**
     * Name of group current request applies to.
     *
     * @var string
     */
    private $_group = '';

    /**
     * List of all actions available for current request
     *
     * @var array
     */
    private $_allActions = array();

    private $_error = '';

    /**
     * Undocumented function
     *
     * @param array $getVars contents of the $_GET variable
     */
    public function __construct($getVars)
    {
        if (array_key_exists('action', $getVars)) {
            $ok = false;
            try {
                $ok = $this->_validateAction($getVars['action'], true);
            } catch (Exception $e) {
                if (substr($e->getMessage(), 0, 5) !== 'DoStuff') {
                    $this->_error = $e->getMessage();
                } else {
                    throw new Exception(
                        'DoStuff constructor expects $getVars key '.
                        '"action" to be a non-empty string'
                    );
                }
            }
            if ($ok === true) {
                $this->_getAction = strtolower($getVars['action']);
            }
        }
        if (array_key_exists('group', $getVars)
            && strlen($getVars['group']) < 32
        ) {
            $this->_group = $getVars['group'];
        }
    }

    /**
     * Register a new action
     *
     * @param string $actionClass Name of the action's class
     *
     * @return void
     */
    public function register($actionClass)
    {
        if (!class_exists($actionClass)) {
            throw new Exception(
                'Action does not exist (or at least the class for '.
                'the action does not exist)'
            );
        }
        if (!is_subclass_of($actionClass, 'RegexAction')
            && !is_subclass_of($actionClass, 'IRegexAction')
        ) {
            throw new Exception(
                '"'.$actionClass.'" does not extend RegexAction '.
                'class and does not implement IRegexAction '.
                'interface so cannot be used'
            );
        }

        try {
            $this->_validateAction($actionClass::getAction());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $action = $actionClass::getAction();
        $title = $actionClass::getTitle();
        $group = $actionClass::getGroup();
        $disabled = $actionClass::isDisabled();

        if ($disabled !== true) {
            $_action = ucfirst($action);

            // Add action to menu list (if approprate)
            if ($group === '') {
                // This is a global action.
                // Anyone can use it
                // Include it in the list of available actions
                $this->_allActions[$_action] = $title;
            } elseif ($this->_group === $group) {
                // This is group specific
                // The current request's group matches this the
                // action's group so include it in the list of
                // available actions
                $this->_allActions[$group][$_action] = $title;
            }

            if (strtolower($_action) === $this->_getAction) {
                // Set the current action
                $this->_action = $action;
            }
        }
    }

    /**
     * Get the Action object for the current request
     *
     * @param array $postVars Contents of the $_POST variable
     * @param array $getVars  Contents of the $_GET variable
     *
     * @return IAction,false
     */
    public function initAction($postVars, $getVars)
    {
        if (is_null($this->_actionObject)) {
            if ($this->_action !== '') {
                $className = $this->_action;
                $this->_actionObject = new $className($postVars, $getVars);

                return $this->_actionObject;
            }
        }
        return false;
    }

    /**
     * Perform action on user input
     *
     * @param string $input User supplied main input
     *
     * @return string
     */
    public function modify($input)
    {
        $output = $input;

        return $output;
    }

    /**
     * Get the Action object for the current request
     *
     * @return IAction,false
     */
    public function getAction()
    {
        return (is_null($this->_actionObject)) ? $this->_actionObject : false;
    }

    /**
     * Get the list of all actions available to this request
     *
     * @return array
     */
    public function getAllActions()
    {
        return $this->_allActions;
    }

    /**
     * Get any error message caused by bad user data.
     *
     * @return string
     */
    public function getError()
    {
        return $this->_error;
    }

    /**
     * Validate the action string
     *
     * @param string  $action       Action name
     * @param boolean $userSupplied Whether action was supplied by user
     *
     * @return true
     */
    private function _validateAction($action, $userSupplied = false)
    {
        $i = ($userSupplied === true) ? 'i' : '';

        if (!is_string($action)) {
            throw new Exception(
                'DoStuff::_validateAction() expects first parameter '.
                '$action to be a non-empty string'
            );
        }
        if (!preg_match('`^[A-Z][a-zA-Z0-9]{9,49}$'.$i.'`', $action)) {
            throw new Exception(
                'Action name is invalid. '.
                'Action name must start with start with a capital letter, '.
                'must be at between 10 and 50 characters long and '.
                'must only contain alpha-numeric characters'
            );
        }
        return true;
    }
}
