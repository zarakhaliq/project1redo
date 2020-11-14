<?php

$x = $_POST['x'];
$y = $_POST['y'];
$ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,'https://api.opencagedata.com/geocode/v1/json?q='.$x.','.$y.'&pretty=1&key=f633db6e5a2842dd96bf3b1b66a53a23');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        $yummy = json_decode($output);
       $country=$yummy->results[0]->components->country_code;
        if($output!==0){
                $url1= 'https://restcountries.eu/rest/v2/alpha/'.$country;
                $nodes = array($url1);
                $node_count = count($nodes);
                
                $curl_arr = array();
                $master = curl_multi_init();
                
                for($i = 0; $i < $node_count; $i++)
                {
                    $url =$nodes[$i];
                    $curl_arr[$i] = curl_init($url);
                    curl_setopt($curl_arr[$i], CURLOPT_RETURNTRANSFER, true);
                    curl_multi_add_handle($master, $curl_arr[$i]);
                }
                
                do {
                    curl_multi_exec($master,$running);
                } while($running > 0);
                
                
                for($i = 0; $i < $node_count; $i++)
                {
                    $results[] = curl_multi_getcontent  ( $curl_arr[$i]  );
                }

        }
        // close curl resource to free up system resources
        //curl_close($ch);     

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($results, JSON_UNESCAPED_UNICODE);




?>
