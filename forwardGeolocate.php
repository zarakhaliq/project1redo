<?php

include('openCage/AbstractGeocoder.php');
include('openCage/Geocoder.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

//Geolocation API

function geolocation(){
	$country=$_POST['countries'];
  
$geocoder = new \OpenCage\Geocoder\Geocoder('b668de0559524ca6a3431dc3ac248c4b');
//$result = $geocoder->geocode('43.831,4.360'); # latitude,longitude (y,x)
$result = $geocoder->geocode(urlencode($country)); # latitude,longitude (y,x)

        $searchResult = [];
		$searchResult['results'] = [];

		$temp = [];
 
		foreach ($result['results'] as $entry) {

			$temp['source'] = 'opencage';
			$temp['formatted'] = $entry['formatted'];
			$temp['geometry']['lat'] = $entry['geometry']['lat'];
			$temp['geometry']['lng'] = $entry['geometry']['lng'];
			$temp['countryCode'] = strtoupper($entry['components']['country_code']);
            $temp['timezone'] = $entry['annotations']['timezone']['name'];
			
			$temp['currency'] = $entry['annotations']['currency']['iso_code'];

            array_push($searchResult['results'], $temp);
        }
        //print_r($temp['components']['city'] = $entry['components']['city']);

    header('Content-Type: application/json; charset=UTF-8');
   // echo $searchResult;
echo json_encode($searchResult, JSON_UNESCAPED_UNICODE);//<<gives correct json data
}
geolocation();
  

?>
