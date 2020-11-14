<?php

$country=$_POST['countries'];



        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.opencagedata.com/geocode/v1/json?q='.urlencode($country).'&key=f633db6e5a2842dd96bf3b1b66a53a23');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        $yummy = json_decode($output);
   
        //Instead of city use country code, or country in components geolocate result to access rest counrties info
       $countryCode=$yummy->results[0]->components->country_code;
       $flag=$yummy->results[0]->annotations->flag;
       $x=$yummy->results[0]->geometry->lat;
       $y=$yummy->results[0]->geometry->lng;
        if($output!==0){
                $url1= 'https://restcountries.eu/rest/v2/alpha/'.$countryCode;
                $url2='http://api.openweathermap.org/data/2.5/weather?lat='.$x.'&lon='.$y.'&appid=c5e47bda76961d3cbe80edc453c83858';
                $url3='http://api.geonames.org/wikipediaSearchJSON?q='.$countryCode.'&maxRows=10&username=zarakhaliq';
                $url4='http://api.worldbank.org/v2/country/'.$countryCode.'?format=json';
                $url5='https://api.ipgeolocationapi.com/countries/'.$countryCode;
                $url6="http://www.geognos.com/api/en/countries/flag/".$flag.".png";
                $url7="https://api-2445580194301.production.gw.apicast.io/1.0/region/country/is_eu.php?country=".$countryCode."&app_id=5949a101&app_key=demokey";

                $nodes = array($url1, $url2, $url3, $url4, $url5, $url6, $url7);
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
