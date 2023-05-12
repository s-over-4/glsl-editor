<?php
$id                 = $_POST['id'];
$url 				= 'https://pastebin.run/' . $id . '.txt';
$ch 				= curl_init($url);

$response  			= curl_exec($ch);
header('Content-Type: text/plain');
echo rtrim($response, '1');
?>