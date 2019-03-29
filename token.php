<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

if (isset($_GET['custid'])) {
    $custid = trim($_GET['custid']);
} else {
    $response = array();
    $response['error'] = "No custid specified";
    die(json_encode($response));
}

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'http://sdc-v-tgsl.epnet.com/token?username='.$custid.'&lifetime=1h',
    CURLOPT_HTTPHEADER => array(
        'Accept: application/json'
    )
]);

$resp = curl_exec($curl);
// Close request to clear up some resources
curl_close($curl);

echo $resp;

?>
