<?php
$code = $_POST['code'];

$url 				= 'https://pastebin.run/api/v1/pastes';
$ch 				= curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'code=' . $code);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response  			= curl_exec($ch);
curl_close ($ch);
echo $response;
?>