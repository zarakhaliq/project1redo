<?php
$country=$_POST['countries'];



$ch = curl_init();

       
        curl_setopt($ch, CURLOPT_URL, 'https://api.opencagedata.com/geocode/v1/json?q='.urlencode($country).'&key=f633db6e5a2842dd96bf3b1b66a53a23');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        $yummy = json_decode($output);   

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($yummy, JSON_UNESCAPED_UNICODE);

        ?>
