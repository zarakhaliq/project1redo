<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
#require "vendor/autoload.php";

include('openCage/AbstractGeocoder.php');
include('openCage/Geocoder.php');

$geocoder = new \OpenCage\Geocoder\Geocoder('f633db6e5a2842dd96bf3b1b66a53a23');
$result = $geocoder->geocode('43.831,4.360'); # latitude,longitude (y,x)
print $result['results'][0]['formatted'];
# 3 Rue de Rivarol, 30020 Nîmes, France
console.log($result);


?>