<?php

  $url = "https://eds-api.ebscohost.com/AuthService/rest/ipauth";
  $params = array(
    'Options' => ["autocomplete"]
  );
  $params_string = json_encode($params);

  $session = curl_init($url); 	                         // Open the Curl session
  curl_setopt($session, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($session, CURLOPT_POSTFIELDS, $params_string);
  curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($session, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($params_string))
  );

  $res = curl_exec($session); 	                     // Make the call
  $errors = curl_error($session);
  $http = curl_getinfo($session, CURLINFO_HTTP_CODE);
  curl_close($session);                                  // And close the session
  $results = json_decode($res, true);
  echo $res;
?>
