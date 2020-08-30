<?php
/**
 * This file contains all the procedural code for doRegexStuff
 *
 * PHP VERSION: ^7.2
 *
 * @category DoRegexStuff
 * @package  DoRegexStuff
 * @author   Evan Wills <evan.wills@acu.edu.au>
 * @license  MIT <url>
 * @link     https://test-webapps.acu.edu.au/mini-apps/do-regex-stuff/
 */

require_once __DIR__.'bootstrap.inc.php';

$action = $doStuff->initAction($_POST, $_GET);

if ($action !== false) {
    $input = '';
    if (array_key_exists('input', $_POST)) {
        $input = $_POST['input'];
        $output = $action->modify($input);
    }
}
