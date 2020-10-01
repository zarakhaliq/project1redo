<?php
$country=$_POST['countries'];
//$x = $_POST['x'];
//$y = $_POST['y'];


$ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, 'https://api.opencagedata.com/geocode/v1/json?q='.urlencode($country).'&key=f633db6e5a2842dd96bf3b1b66a53a23');
        //curl_setopt($ch, CURLOPT_URL,'https://api.opencagedata.com/geocode/v1/json?q='.$x.','.$y.'&pretty=1&key=f633db6e5a2842dd96bf3b1b66a53a23');
        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      
        $output = curl_exec($ch);
       
        $yummy = json_decode($output);
        //echo $yummy;
        //Instead of city use country code, or country in components geolocate result to access rest counrties info
//echo $yummy;
      // $countryCode=$yummy->results[0]->components->country_code;
      // $flag=$yummy->results[0]->annotations->flag;
      // print_r($flag);
      // $countryCodeUpper=strtoupper($countryCode);
      // $currency=$yummy->results[0]->annotations->currency->iso_code;
      // $x=$yummy->results[0]->geometry->lat;
      // $y=$yummy->results[0]->geometry->lng;
    //$latitude=$x;
    //$longitude=$y;
 
   
// close curl resource to free up system resources
//curl_close($ch);     

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($yummy, JSON_UNESCAPED_UNICODE);

        ?>