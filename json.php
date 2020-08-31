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

if (!array_key_exists('test', $_GET)) {
    header('Content-Type: application/json');
}

require_once __DIR__.'/php/bootstrap.inc.php';

$action = $doStuff->initAction($_POST, $_GET);
if ($action !== false) {
    $input = '';
    if (array_key_exists('data', $_POST)) {
        $data = json_decode($_POST['data'], true);

        $input = $action->modify($data['input']);
        echo $doStuff->getJSON($input, $action);
        exit;
    } else {
        $actionName = $doStuff->getActionName();
        $errorMsg = 'No input supplied';
    }
} else {
    $actionName = '';
    $errorMsg = 'Could not find valid action';
}

echo json_encode(
    array(
        'success' => false,
        'action' => $actionName,
        'error' => $errorMsg,
        'post' => $_POST,
        'get' => $_GET,
        'request' => $_REQUEST
    )
);
