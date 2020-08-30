<?php
/**
 * This file contains the code for bootstrapping all the classes and
 * addtional functionality requried for doRegexStuff
 *
 * PHP VERSION: ^7.2
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */

// ==================================================================
// START: debug include

if (!function_exists('debug')) {
    if (isset($_SERVER['HTTP_HOST'])) {
        $path = $_SERVER['HTTP_HOST'];
        $pwd = dirname($_SERVER['SCRIPT_FILENAME']).'/';
    } else {
        $path = $_SERVER['USER'];
        $pwd = $_SERVER['PWD'].'/';
    };
    if (substr_compare($path, '192.168.', 0, 8) == 0) {
        $path = 'localhost';
    }
    switch ($path) {
    case 'pademelon':
    case 'localhost':
    case 'evan':
    case '192.168.153.129':
        $root = '/var/www/html/';
        $inc = $root.'includes/';
        $classes = $cls = $root.'classes/';
        break; // home laptop

    case 'apps.acu.edu.au':            // ACU
    case 'testapps.acu.edu.au':        // ACU
    case 'dev1.acu.edu.au':            // ACU
    case 'blogs.acu.edu.au':           // ACU
    case 'studentblogs.acu.edu.au':    // ACU
    case 'dev-blogs.acu.edu.au':       // ACU
    case 'webapps.acu.edu.au':         // ACU
    case 'panvpuwebapps01.acu.edu.au': // ACU
    case 'test-webapps.acu.edu.au':    // ACU
    case 'panvtuwebapps01.acu.edu.au': // ACU
    case 'dev-webapps.acu.edu.au':     // ACU
    case 'panvduwebapps01.acu.edu.au': // ACU
    case 'evwills':
        if (isset($_SERVER['HOSTNAME'])
            && $_SERVER['HOSTNAME'] = 'panvtuwebapps01.acu.edu.au'
        ) {
            $root = '/home/evwills/';
            $inc = $root.'includes/';
            $classes = $cls = $root.'classes/';
            break; // ACU
        } else {
            $root = '/var/www/html/mini-apps/';
            $inc = $root.'includes_ev/';
            $classes = $cls = $root.'classes_ev/'; break; // ACU
        }
    };

    set_include_path(
        get_include_path().PATH_SEPARATOR.
        $inc.PATH_SEPARATOR.
        $cls.PATH_SEPARATOR.$pwd
    );

    if (file_exists($inc.'debug.inc.php')) {
        if (!file_exists($pwd.'debug.info')
            && is_writable($pwd)
            && file_exists($inc.'template.debug.info')
        ) {
            copy($inc.'template.debug.info', $pwd.'debug.info');
        }
        include $inc.'debug.inc.php';
    } else {
        /**
         * Dummy debug function
         *
         * @return void
         */
        function debug()
        {

        }
    }
};

// END: debug include
// ==================================================================

define('ACTIONS_DIR', __DIR__.'/actions/');

require_once __DIR__.'/classes/doStuff.class.php';

$doStuff = new DoStuff($_GET);

require_once __DIR__.'/actions-base.class.php';

$actionFiles = scandir(ACTIONS_DIR);

for ($a = 0; $a < count($actionFiles); $a += 1) {
    if (strlen($actionFiles[$a]) > 10
        && substr(strtolower($actionFiles[$a]), -10, 10) === '.class.php'
    ) {
        // Loop through and register all the action classes
        // available for the current user
        include ACTIONS_DIR.$actionFiles[$a];
    }
}

