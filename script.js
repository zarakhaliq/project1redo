$(window).on("load", function () {
  $(".loader-wrapper").fadeOut("slow");
});
$(document).ready(function () {
  var map = L.map("mapid", {
    zoomControl: false,
  }).fitWorld();
  $("mapid").on("mousedown", L.DomEvent.stopPropagation);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      minZoom: 2,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiemFyYWtoYWxpcSIsImEiOiJja2RvazV1eXAxc3FzMnhxMzhtdXR4dnhvIn0.dMALGZc6TvoR80B31DmxDg",
    }
  ).addTo(map);
  map.addControl(new L.Control.ZoomMin());
  //var data = "countriesComp.geojson";

  //var geoData = [countries];

  //Creating marker and circle that appears on html location when page loads:

  var customIcon = L.icon({
    iconUrl: "marker.svg",
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      $.ajax({
        type: "POST",
        url: "capitalCity.php",
        data: {
          x: position.coords.latitude,
          y: position.coords.longitude,
        },
        dataType: "json",
        success: function (data1) {
          console.log(JSON.parse(data1));
          parsedData = JSON.parse(data1);
          var countryCode = parsedData.alpha3Code;
          var countryName = parsedData.nativeName;
          $("#select").val(countryName).change();
          //for (i = 0; i < geoData[0].features.length; i++) {
          // console.log(geoData[0].features[i].properties.ISO_A3);
          //if (geoData[0].features[i].properties.ISO_A3 == countryCode) {
          // const latLngs = L.GeoJSON.coordsToLatLngs(
          //  geoData[0].features[i].geometry.coordinates,
          // 2
          //);
          //L.geoJSON(geoData[0].features[i])
          // .bindPopup(geoData[0].features[i].properties.ADMIN)
          //.addTo(map);
          //map.fitBounds(latLngs);
          //$("#select")
          // .val(geoData[0].features[i].properties.ADMIN)
          //.change();
          // }
          // }

          //vectorLayer.bringToBack();

          console.log(countryCode);
          var marker = L.marker([parsedData.latlng[0], parsedData.latlng[1]], {
            icon: customIcon,
            draggable: "true",
          })
            .bindPopup(parsedData.nativeName + ", " + parsedData.region)
            .openPopup()
            .addTo(map);

          marker.on("dragend", function (event) {
            var marker = event.target;
            var position = marker.getLatLng();
            console.log(position);
            marker
              .setLatLng(position, {draggable: "true"})

              .update();
          });

          marker.on("click", function (e) {
            map.setView([e.latlng.lat, e.latlng.lng], 12);
          });

          var circle = L.circle([parsedData.latlng[0], parsedData.latlng[1]], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.2,
            radius: 10000,
          }).addTo(map);
        },
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  ///End of ajax call////////////////////

  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  var geoIcon = L.Icon.extend({
    iconUrl: "marker.svg",
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
  });

  map.on("click", function (e, latlng) {
    $.ajax({
      type: "POST",
      url: "capitalCity.php",
      data: {
        x: e.latlng.lat,
        y: e.latlng.lng,
      },
      dataType: "json",
      success: function (data1) {
        console.log(e.latlng.lat);
        console.log(JSON.parse(data1));
        parsedData = JSON.parse(data1);
        var countryCode = parsedData.alpha3Code;
        var countryName = parsedData.name;
        console.log(countryName);
        $("#select").val(countryName).change();

        // var polygon = L.geoJSON(latLngs, {
        // color: "green",
        // weight: 4,
        // opacity: 1,
        //}).addTo(map);
        // }
        //  }
        // }

        console.log(countryCode);
        var marker = L.marker([parsedData.latlng[0], parsedData.latlng[1]], {
          icon: customIcon,
          draggable: "true",
        })
          .bindPopup(parsedData.nativeName + ", " + parsedData.region)
          .openPopup()
          .addTo(map);

        marker.on("dragend", function (event) {
          var marker = event.target;
          var position = marker.getLatLng();
          console.log(position);
          marker
            .setLatLng(position, {draggable: "true"})

            .update();
        });

        marker.on("click", function (e) {
          map.setView([e.latlng.lat, e.latlng.lng], 12);
        });
      },
    });
  });

  // function highlightFeature(e) {
  // this.setStyle({
  // weight: 5,
  //color: "green",
  //dashArray: "",
  //fillOpacity: 0.4,
  //});
  //("");
  //}

  // function resetHighlight(e) {
  // vectorLayer.resetStyle(this);
  //this.bringToBack();
  //}
  //function clickColorChange(e) {
  // this.setStyle({
  //  color: "yellow",
  //});
  //this.bringToBack();
  //}
  $("#form").change(function (e) {
    e.preventDefault();
    //var datastring = $("#form").serialize();
    var data1 = $("#form").serializeArray();
    //console.log(data1[0].value);
    var selectedCountry = data1[0].value;
    console.log(data1);

    $.ajax({
      type: "POST",
      url: "getCountryBorderFromCountryCode.php",
      data: {x: selectedCountry},
      dataType: "json",
      success: function (data, error, status) {
        console.log(data.data);
        if (data.data.geometry.type === "Polygon") {
          const latLngs = L.GeoJSON.coordsToLatLngs(
            data.data.geometry.coordinates,
            1
          );
          console.log(latLngs);
          L.geoJSON(data.data).bindPopup(data.data.properties.name).addTo(map);
          map.fitBounds(latLngs);
        } else {
          const latLngs = L.GeoJSON.coordsToLatLngs(
            data.data.geometry.coordinates,
            2
          );
          console.log(latLngs);
          L.geoJSON(data.data).bindPopup(data.data.properties.name).addTo(map);
          map.fitBounds(latLngs);
        }

        //console.log(latLngs);
        //L.geoJSON(data.data).bindPopup(data.data.properties.name).addTo(map);
        //map.fitBounds(latLngs);
        //$("#select").val(data.data.properties.name).change();
      },
      error: function (error) {
        console.log(error);
      },
    });

    //HERE ADD THE OCOUNTRY DETAILS

    var datastring = $("#form").serialize();
    var data2 = $("#form").serializeArray();

    var selectedCountry = data2[0].value;
    console.log(localStorage.city);

    if (localStorage.getItem("city") !== selectedCountry) {
      $.ajax({
        url: "test2.php",
        type: "POST",
        data: datastring,
        dataType: "json",
        async: true,
        success: function (res) {
          console.log(res);
          var result = JSON.parse(res[0]);
          JSONdata1 = JSON.parse(res[1]);
          JSONdata2 = JSON.parse(res[2]);
          JSONdata3 = JSON.parse(res[3]);
          JSONdata4 = JSON.parse(res[4]);
          console.log(JSONdata1);
          var borders = result.borders;
          var callingCodes = result.callingCodes;
          var languages = result.languages[0].name;
          var population = result.population;
          var region = result.region;
          var regionalBlocks = result.regionalBlocs[0].name;

          var weather = JSONdata1.weather[0].description;
          var icon = JSONdata1.weather[0].icon;
          var min_temp = JSONdata1.main.temp_min;
          var max_temp = JSONdata1.main.temp_max;
          var humidity = JSONdata1.main.humidity;

          var wiki1Title = JSONdata2.geonames[0].title;
          var wiki1Summary = JSONdata2.geonames[0].summary;
          var wiki1Ref = JSONdata2.geonames[0].wikipediaUrl;
          var wiki2Title = JSONdata2.geonames[1].title;
          var wiki2Summary = JSONdata2.geonames[1].summary;
          var wiki2Ref = JSONdata2.geonames[1].wikipediaUrl;
          var wiki3Title = JSONdata2.geonames[2].title;
          var wiki3Summary = JSONdata2.geonames[2].summary;
          var wiki3Ref = JSONdata2.geonames[2].wikipediaUrl;

          var address = JSONdata3[1][0].capitalCity;
          var incomeLevel = JSONdata3[1][0].incomeLevel.value;
          var alpha2 = JSONdata4.alpha2;
          var alpha3 = JSONdata4.alpha3;
          var subregion = JSONdata4.subregion;

          if (result.status == 404) {
            $("#borders").empty();
            $("#borders").append("-");
            $("#callingCodes").empty();
            $("#callingCodes").append("-");
            $("#languages").empty("-");
            $("#languages").append("-");
            $("#population").empty("-");
            $("#population").append("-");
            $("#region").empty();
            $("#region").append("-");
            $("#regionalBlocks").empty();
            $("#regionalBlocks").append("-");
          } else {
            $("#borders").empty();
            $("#borders").append(result.borders + "<br>");
            $("#callingCodes").empty();
            $("#callingCodes").append(result.callingCodes + "<br>");
            $("#languages").empty();
            $("#languages").append(result.languages[0].name + "<br>");
            $("#population").empty();
            $("#population").append(result.population + "<br>");
            $("#region").empty();
            $("#region").append(result.region + "<br>");
            $("#regionalBlocks").empty();
            $("#regionalBlocks").append(result.regionalBlocs[0].name + "<br>");
            localStorage.setItem("borders", borders);
            localStorage.setItem("callingCodes", callingCodes);
            localStorage.setItem("languages", languages);
            localStorage.setItem("population", population);
            localStorage.setItem("region", region);
            localStorage.setItem("regionalBlocks", regionalBlocks);
          }
          if (JSONdata1.weather) {
            $("#weather").empty();
            $("#weather").append(
              "Weather: <img src='https://openweathermap.org/img/wn/" +
                JSONdata1.weather[0].icon +
                "@2x.png'>" +
                JSONdata1.weather[0].description +
                "<br>"
            );
            $("#weather").append(
              "Min Temperature: " + JSONdata1.main.temp_min + "°F<br>"
            );
            $("#weather").append(
              "Max Temperature: " + JSONdata1.main.temp_max + "°F<br>"
            );
            $("#weather").append("Humidity: " + JSONdata1.main.humidity + "%");
            localStorage.setItem("weather", weather);
            localStorage.setItem("icon", icon);
            localStorage.setItem("min_temp", min_temp);
            localStorage.setItem("max_temp", max_temp);
            localStorage.setItem("humidity", humidity);
          } else {
            console.log("Error: could not find climate");
            $("#weather").empty();
            $("#weather").append("-");
          }
          if (JSONdata2.geonames[0]) {
            $("#wikipost1").empty();
            $("#wikipost1").append(
              "Title: " + JSONdata2.geonames[0].title + "<br>"
            );
            $("#wikipost1").append(
              "Summary: " + JSONdata2.geonames[0].summary + "<br>"
            );
            $("#wikipost1").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[0].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki1Title", wiki1Title);
            localStorage.setItem("wiki1Summary", wiki1Summary);
            localStorage.setItem("wiki1Ref", wiki1Ref);
          } else {
            $("#wikipost1").empty();
            $("#wikipost1").append("-");
          }

          if (JSONdata2.geonames[1]) {
            $("#wikipost2").empty();
            $("#wikipost2").append(
              "Title: " + JSONdata2.geonames[1].title + "<br>"
            );
            $("#wikipost2").append(
              "Summary: " + JSONdata2.geonames[1].summary + "<br>"
            );
            $("#wikipost2").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[1].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki2Title", wiki2Title);
            localStorage.setItem("wiki2Summary", wiki2Summary);
            localStorage.setItem("wiki2Ref", wiki2Ref);
          } else {
            $("#wikipost2").empty();
            $("#wikipost2").append("-");
          }
          if (JSONdata2.geonames[2]) {
            $("#wikipost3").empty();
            $("#wikipost3").append(
              "Title: " + JSONdata2.geonames[2].title + "<br>"
            );
            $("#wikipost3").append(
              "Summary: " + JSONdata2.geonames[2].summary + "<br>"
            );
            $("#wikipost3").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[2].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki3Title", wiki3Title);
            localStorage.setItem("wiki3Summary", wiki3Summary);
            localStorage.setItem("wiki3Ref", wiki3Ref);
          } else {
            $("#wikipost3").empty();
            $("#wikipost3").append("-");
          }
          if (JSONdata3[1][0]) {
            $("#address").empty();
            $("#address").append(JSONdata3[1][0].capitalCity);
            $("#incomeLevel").empty();
            $("#incomeLevel").append(JSONdata3[1][0].incomeLevel.value);
            localStorage.setItem("address", address);
            localStorage.setItem("incomeLevel", incomeLevel);
          } else {
            $("#address").empty();
            $("#address").append("-");
            $("#incomeLevel").empty();
            $("#incomeLevel").append("-");
          }
          if (JSONdata4) {
            $("#alpha2").empty();
            $("#alpha2").append(JSONdata4.alpha2);
            $("#alpha3").empty();
            $("#alpha3").append(JSONdata4.alpha3);
            $("#subregion").empty();
            $("#subregion").append(JSONdata4.subregion);
            localStorage.setItem("alpha2", alpha2);
            localStorage.setItem("alpha3", alpha3);
            localStorage.setItem("subregion", subregion);
          } else {
            $("#alpha2").empty();
            $("#alpha2").append("-");
            $("#alpha3").empty();
            $("#alpha3").append("-");
            $("#subregion").empty();
            $("#subregion").append("-");
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
          $("#borders").empty();
          $("#borders").append("-");
          $("#callingCodes").empty();
          $("#callingCodes").append("-");
          $("#languages").empty("-");
          $("#languages").append("-");
          $("#population").empty("-");
          $("#population").append("-");
          $("#region").empty();
          $("#region").append("-");
          $("#regionalBlocks").empty();
          $("#regionalBlocks").append("-");
          $("#wikipost1").empty();
          $("#wikipost1").append("-");
          $("#wikipost2").empty();
          $("#wikipost2").append("-");
          $("#wikipost3").empty();
          $("#wikipost3").append("-");
          $("#alpha2").empty();
          $("#alpha2").append("-");
          $("#alpha3").empty();
          $("#alpha3").append("-");
          $("#subregion").empty();
          $("#subregion").append("-");
          $("#address").empty();
          $("#address").append("-");
          $("#incomeLevel").empty();
          $("#incomeLevel").append("-");
        },
      });

      $.ajax({
        type: "POST",
        url: "forwardGeolocate.php",
        data: datastring,
        dataType: "json",
        success: function (data, error, status) {
          console.log(data);
          console.log(error);
          console.log(status);
          var city = data.results[0].formatted;
          var timezone = data.results[0].timezone;
          var currency = data.results[0].currency;
          var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
          var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
          var geometry = Lat + ", " + Lng;
          if (data !== 0) {
            $("#city").empty();
            $("#city").append(data.results[0].formatted);
            $("#timezone").empty();
            $("#timezone").append(data.results[0].timezone);
            $("#currency").empty();
            $("#currency").append(data.results[0].currency);
            $("#geometry").empty();
            var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
            var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
            $("#geometry").append(Lat + ", " + Lng);
            localStorage.setItem("city", city);
            localStorage.setItem("timezone", timezone);
            localStorage.setItem("currency", currency);
            localStorage.setItem("Lat", Lat);
            localStorage.setItem("Lng", Lng);
            localStorage.setItem("geometry", geometry);
          } else {
            console.log("Error: could not find city and timezone");
            $("#city").empty();
            $("#timezone").empty();
            $("#currency").empty();
            $("#geometry").empty();
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
          $("#city").empty();
          $("#city").append("-");
          $("#timezone").empty();
          $("#timezone").append("-");
          $("#currency").empty();
          $("#currency").append("-");
          $("#geometry").empty();
          $("#geometry").append("-");
        },
      });
    } else {
      var borders = localStorage.getItem("borders");
      var callingCodes = localStorage.getItem("callingCodes");
      var languages = localStorage.getItem("languages");
      var population = localStorage.getItem("population");
      var region = localStorage.getItem("region");
      var regionalBlocks = localStorage.getItem("regionalBlocks");
      var weather = localStorage.getItem("weather");
      var icon = localStorage.getItem("icon");
      var min_temp = localStorage.getItem("min_temp");
      var max_temp = localStorage.getItem("max_temp");
      var humidity = localStorage.getItem("humidity");

      var wiki1Title = localStorage.getItem("wiki1Title");
      var wiki1Summary = localStorage.getItem("wiki1Summary");
      var wiki1Ref = localStorage.getItem("wiki1Ref");
      var wiki2Title = localStorage.getItem("wiki2Title");
      var wiki2Summary = localStorage.getItem("wiki2Summary");
      var wiki2Ref = localStorage.getItem("wiki2Ref");
      var wiki3Title = localStorage.getItem("wiki3Title");
      var wiki3Summary = localStorage.getItem("wiki3Summary");
      var wiki3Ref = localStorage.getItem("wiki3Ref");
      var address = localStorage.getItem("address", address);
      var incomeLevel = localStorage.getItem("incomeLevel", incomeLevel);
      var alpha2 = localStorage.getItem("alpha2", alpha2);
      var alpha3 = localStorage.getItem("alpha3", alpha3);
      var subregion = localStorage.getItem("subregion", subregion);
      var city = localStorage.getItem("city", city);
      var timezone = localStorage.getItem("timezone", timezone);
      var currency = localStorage.getItem("currency", currency);
      var Lat = localStorage.getItem("Lat", Lat);
      var Lng = localStorage.getItem("Lng", Lng);
      var geometry = localStorage.getItem("geometry", geometry);
      $("#borders").empty();
      $("#borders").append(borders + "<br>");
      $("#callingCodes").empty();
      $("#callingCodes").append(callingCodes + "<br>");
      $("#languages").empty();
      $("#languages").append(languages + "<br>");
      $("#population").empty();
      $("#population").append(population + "<br>");
      $("#region").empty();
      $("#region").append(region + "<br>");
      $("#regionalBlocks").empty();
      $("#regionalBlocks").append(regionalBlocks + "<br>");
      $("#weather").empty();
      $("#weather").append(
        "Weather: <img src='https://openweathermap.org/img/wn/" +
          icon +
          "@2x.png'>" +
          weather +
          "<br>"
      );
      $("#weather").append("Min Temperature: " + min_temp + "°F<br>");
      $("#weather").append("Max Temperature: " + max_temp + "°F<br>");
      $("#weather").append("Humidity: " + humidity + "%<br>");
      $("#wikipost1").empty();
      $("#wikipost1").append("Title: " + wiki1Title + "<br>");
      $("#wikipost1").append("Summary: " + wiki1Summary + "<br>");
      $("#wikipost1").append(
        "Reference: <a href='https://" +
          wiki1Ref +
          "' target='_blank'>Read more</a>"
      );
      $("#wikipost2").empty();
      $("#wikipost2").append("Title: " + wiki2Title + "<br>");
      $("#wikipost2").append("Summary: " + wiki2Summary + "<br>");
      $("#wikipost2").append(
        "Reference: <a href='https://" +
          wiki2Ref +
          "' target='_blank'>Read more</a>"
      );
      $("#wikipost3").empty();
      $("#wikipost3").append("Title: " + wiki3Title + "<br>");
      $("#wikipost3").append("Summary: " + wiki3Summary + "<br>");
      $("#wikipost3").append(
        "Reference: <a href='https://" +
          wiki3Ref +
          "' target='_blank'>Read more</a>"
      );
      $("#address").empty();
      $("#address").append(address);
      $("#incomeLevel").empty();
      $("#incomeLevel").append(incomeLevel);
      $("#alpha2").empty();
      $("#alpha2").append(alpha2);
      $("#alpha3").empty();
      $("#alpha3").append(alpha3);
      $("#subregion").empty();
      $("#subregion").append(subregion);
      $("#city").empty();
      $("#city").append(city);
      $("#timezone").empty();
      $("#timezone").append(timezone);
      $("#currency").empty();
      $("#currency").append(currency);
      $("#geometry").empty();
      $("#geometry").append(Lat + ", " + Lng);
    }
  });
  //add hereee!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //  layer.on({
  ///  mouseover: highlightFeature,
  // mouseout: resetHighlight,
  //click: clickColorChange,
  //});

  //}
  //  }
  //layer.on({
  // mouseover: highlightFeature,
  // mouseout: resetHighlight,
  //click: clickColorChange,
  // });
  //  layer.bindPopup(country.properties.ADMIN);
  // layer.on("click", function (e) {
  //  map.fitBounds(layer.getBounds());
  // e.target.setStyle({
  //  color: "green",
  //});
  //$("#select").val(country.properties.ADMIN).change();
  //console.log("clicked");
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //$("#select").val(country.properties.ADMIN).change();
  //HERE ADD THE OCOUNTRY DETAILS
  //console.log("clicked");
  //$("#form").submit(function (e) {
  // e.preventDefault();
  var datastring = $("#form").serialize();
  var data2 = $("#form").serializeArray();
  console.log(data2);
  var selectedCountry = data2[0].value;
  console.log(localStorage.city);

  if (localStorage.getItem("city") !== selectedCountry) {
    $.ajax({
      url: "test2.php",
      type: "POST",
      data: datastring,
      dataType: "json",
      async: true,
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res[0]);
        JSONdata1 = JSON.parse(res[1]);
        JSONdata2 = JSON.parse(res[2]);
        JSONdata3 = JSON.parse(res[3]);
        JSONdata4 = JSON.parse(res[4]);
        console.log(JSONdata1);
        var borders = result.borders;
        var callingCodes = result.callingCodes;
        var languages = result.languages[0].name;
        var population = result.population;
        var region = result.region;
        var regionalBlocks = result.regionalBlocs[0].name;

        var weather = JSONdata1.weather[0].description;
        var icon = JSONdata1.weather[0].icon;
        var min_temp = JSONdata1.main.temp_min;
        var max_temp = JSONdata1.main.temp_max;
        var humidity = JSONdata1.main.humidity;

        var wiki1Title = JSONdata2.geonames[0].title;
        var wiki1Summary = JSONdata2.geonames[0].summary;
        var wiki1Ref = JSONdata2.geonames[0].wikipediaUrl;
        var wiki2Title = JSONdata2.geonames[1].title;
        var wiki2Summary = JSONdata2.geonames[1].summary;
        var wiki2Ref = JSONdata2.geonames[1].wikipediaUrl;
        var wiki3Title = JSONdata2.geonames[2].title;
        var wiki3Summary = JSONdata2.geonames[2].summary;
        var wiki3Ref = JSONdata2.geonames[2].wikipediaUrl;

        var address = JSONdata3[1][0].capitalCity;
        var incomeLevel = JSONdata3[1][0].incomeLevel.value;
        var alpha2 = JSONdata4.alpha2;
        var alpha3 = JSONdata4.alpha3;
        var subregion = JSONdata4.subregion;

        if (result.status == 404) {
          $("#borders").empty();
          $("#borders").append("-");
          $("#callingCodes").empty();
          $("#callingCodes").append("-");
          $("#languages").empty("-");
          $("#languages").append("-");
          $("#population").empty("-");
          $("#population").append("-");
          $("#region").empty();
          $("#region").append("-");
          $("#regionalBlocks").empty();
          $("#regionalBlocks").append("-");
        } else {
          $("#borders").empty();
          $("#borders").append(result.borders + "<br>");
          $("#callingCodes").empty();
          $("#callingCodes").append(result.callingCodes + "<br>");
          $("#languages").empty();
          $("#languages").append(result.languages[0].name + "<br>");
          $("#population").empty();
          $("#population").append(result.population + "<br>");
          $("#region").empty();
          $("#region").append(result.region + "<br>");
          $("#regionalBlocks").empty();
          $("#regionalBlocks").append(result.regionalBlocs[0].name + "<br>");
          localStorage.setItem("borders", borders);
          localStorage.setItem("callingCodes", callingCodes);
          localStorage.setItem("languages", languages);
          localStorage.setItem("population", population);
          localStorage.setItem("region", region);
          localStorage.setItem("regionalBlocks", regionalBlocks);
        }
        if (JSONdata1.weather) {
          $("#weather").empty();
          $("#weather").append(
            "Weather: <img src='https://openweathermap.org/img/wn/" +
              JSONdata1.weather[0].icon +
              "@2x.png'>" +
              JSONdata1.weather[0].description +
              "<br>"
          );
          $("#weather").append(
            "Min Temperature: " + JSONdata1.main.temp_min + "°F<br>"
          );
          $("#weather").append(
            "Max Temperature: " + JSONdata1.main.temp_max + "°F<br>"
          );
          $("#weather").append("Humidity: " + JSONdata1.main.humidity + "%");
          localStorage.setItem("weather", weather);
          localStorage.setItem("icon", icon);
          localStorage.setItem("min_temp", min_temp);
          localStorage.setItem("max_temp", max_temp);
          localStorage.setItem("humidity", humidity);
        } else {
          console.log("Error: could not find climate");
          $("#weather").empty();
          $("#weather").append("-");
        }
        if (JSONdata2.geonames[0]) {
          $("#wikipost1").empty();
          $("#wikipost1").append(
            "Title: " + JSONdata2.geonames[0].title + "<br>"
          );
          $("#wikipost1").append(
            "Summary: " + JSONdata2.geonames[0].summary + "<br>"
          );
          $("#wikipost1").append(
            "Reference: <a href='https://" +
              JSONdata2.geonames[0].wikipediaUrl +
              "' target='_blank'>Read more</a>"
          );
          localStorage.setItem("wiki1Title", wiki1Title);
          localStorage.setItem("wiki1Summary", wiki1Summary);
          localStorage.setItem("wiki1Ref", wiki1Ref);
        } else {
          $("#wikipost1").empty();
          $("#wikipost1").append("-");
        }

        if (JSONdata2.geonames[1]) {
          $("#wikipost2").empty();
          $("#wikipost2").append(
            "Title: " + JSONdata2.geonames[1].title + "<br>"
          );
          $("#wikipost2").append(
            "Summary: " + JSONdata2.geonames[1].summary + "<br>"
          );
          $("#wikipost2").append(
            "Reference: <a href='https://" +
              JSONdata2.geonames[1].wikipediaUrl +
              "' target='_blank'>Read more</a>"
          );
          localStorage.setItem("wiki2Title", wiki2Title);
          localStorage.setItem("wiki2Summary", wiki2Summary);
          localStorage.setItem("wiki2Ref", wiki2Ref);
        } else {
          $("#wikipost2").empty();
          $("#wikipost2").append("-");
        }
        if (JSONdata2.geonames[2]) {
          $("#wikipost3").empty();
          $("#wikipost3").append(
            "Title: " + JSONdata2.geonames[2].title + "<br>"
          );
          $("#wikipost3").append(
            "Summary: " + JSONdata2.geonames[2].summary + "<br>"
          );
          $("#wikipost3").append(
            "Reference: <a href='https://" +
              JSONdata2.geonames[2].wikipediaUrl +
              "' target='_blank'>Read more</a>"
          );
          localStorage.setItem("wiki3Title", wiki3Title);
          localStorage.setItem("wiki3Summary", wiki3Summary);
          localStorage.setItem("wiki3Ref", wiki3Ref);
        } else {
          $("#wikipost3").empty();
          $("#wikipost3").append("-");
        }
        if (JSONdata3[1][0]) {
          $("#address").empty();
          $("#address").append(JSONdata3[1][0].capitalCity);
          $("#incomeLevel").empty();
          $("#incomeLevel").append(JSONdata3[1][0].incomeLevel.value);
          localStorage.setItem("address", address);
          localStorage.setItem("incomeLevel", incomeLevel);
        } else {
          $("#address").empty();
          $("#address").append("-");
          $("#incomeLevel").empty();
          $("#incomeLevel").append("-");
        }
        if (JSONdata4) {
          $("#alpha2").empty();
          $("#alpha2").append(JSONdata4.alpha2);
          $("#alpha3").empty();
          $("#alpha3").append(JSONdata4.alpha3);
          $("#subregion").empty();
          $("#subregion").append(JSONdata4.subregion);
          localStorage.setItem("alpha2", alpha2);
          localStorage.setItem("alpha3", alpha3);
          localStorage.setItem("subregion", subregion);
        } else {
          $("#alpha2").empty();
          $("#alpha2").append("-");
          $("#alpha3").empty();
          $("#alpha3").append("-");
          $("#subregion").empty();
          $("#subregion").append("-");
        }
      },
      error: function (xhr, status, error) {
        console.log(error);
        $("#borders").empty();
        $("#borders").append("-");
        $("#callingCodes").empty();
        $("#callingCodes").append("-");
        $("#languages").empty("-");
        $("#languages").append("-");
        $("#population").empty("-");
        $("#population").append("-");
        $("#region").empty();
        $("#region").append("-");
        $("#regionalBlocks").empty();
        $("#regionalBlocks").append("-");
        $("#wikipost1").empty();
        $("#wikipost1").append("-");
        $("#wikipost2").empty();
        $("#wikipost2").append("-");
        $("#wikipost3").empty();
        $("#wikipost3").append("-");
        $("#alpha2").empty();
        $("#alpha2").append("-");
        $("#alpha3").empty();
        $("#alpha3").append("-");
        $("#subregion").empty();
        $("#subregion").append("-");
        $("#address").empty();
        $("#address").append("-");
        $("#incomeLevel").empty();
        $("#incomeLevel").append("-");
      },
    });

    $.ajax({
      type: "POST",
      url: "forwardGeolocate.php",
      data: datastring,
      dataType: "json",
      success: function (data, error, status) {
        console.log(data);
        console.log(error);
        console.log(status);
        var city = data.results[0].formatted;
        var timezone = data.results[0].timezone;
        var currency = data.results[0].currency;
        var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
        var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
        var geometry = Lat + ", " + Lng;
        if (data !== 0) {
          $("#city").empty();
          $("#city").append(data.results[0].formatted);
          $("#timezone").empty();
          $("#timezone").append(data.results[0].timezone);
          $("#currency").empty();
          $("#currency").append(data.results[0].currency);
          $("#geometry").empty();
          var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
          var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
          $("#geometry").append(Lat + ", " + Lng);
          localStorage.setItem("city", city);
          localStorage.setItem("timezone", timezone);
          localStorage.setItem("currency", currency);
          localStorage.setItem("Lat", Lat);
          localStorage.setItem("Lng", Lng);
          localStorage.setItem("geometry", geometry);
        } else {
          console.log("Error: could not find city and timezone");
          $("#city").empty();
          $("#timezone").empty();
          $("#currency").empty();
          $("#geometry").empty();
        }
      },
      error: function (xhr, status, error) {
        console.log(error);
        $("#city").empty();
        $("#city").append("-");
        $("#timezone").empty();
        $("#timezone").append("-");
        $("#currency").empty();
        $("#currency").append("-");
        $("#geometry").empty();
        $("#geometry").append("-");
      },
    });
  } else {
    var borders = localStorage.getItem("borders");
    var callingCodes = localStorage.getItem("callingCodes");
    var languages = localStorage.getItem("languages");
    var population = localStorage.getItem("population");
    var region = localStorage.getItem("region");
    var regionalBlocks = localStorage.getItem("regionalBlocks");
    var weather = localStorage.getItem("weather");
    var icon = localStorage.getItem("icon");
    var min_temp = localStorage.getItem("min_temp");
    var max_temp = localStorage.getItem("max_temp");
    var humidity = localStorage.getItem("humidity");

    var wiki1Title = localStorage.getItem("wiki1Title");
    var wiki1Summary = localStorage.getItem("wiki1Summary");
    var wiki1Ref = localStorage.getItem("wiki1Ref");
    var wiki2Title = localStorage.getItem("wiki2Title");
    var wiki2Summary = localStorage.getItem("wiki2Summary");
    var wiki2Ref = localStorage.getItem("wiki2Ref");
    var wiki3Title = localStorage.getItem("wiki3Title");
    var wiki3Summary = localStorage.getItem("wiki3Summary");
    var wiki3Ref = localStorage.getItem("wiki3Ref");
    var address = localStorage.getItem("address", address);
    var incomeLevel = localStorage.getItem("incomeLevel", incomeLevel);
    var alpha2 = localStorage.getItem("alpha2", alpha2);
    var alpha3 = localStorage.getItem("alpha3", alpha3);
    var subregion = localStorage.getItem("subregion", subregion);
    var city = localStorage.getItem("city", city);
    var timezone = localStorage.getItem("timezone", timezone);
    var currency = localStorage.getItem("currency", currency);
    var Lat = localStorage.getItem("Lat", Lat);
    var Lng = localStorage.getItem("Lng", Lng);
    var geometry = localStorage.getItem("geometry", geometry);
    $("#borders").empty();
    $("#borders").append(borders + "<br>");
    $("#callingCodes").empty();
    $("#callingCodes").append(callingCodes + "<br>");
    $("#languages").empty();
    $("#languages").append(languages + "<br>");
    $("#population").empty();
    $("#population").append(population + "<br>");
    $("#region").empty();
    $("#region").append(region + "<br>");
    $("#regionalBlocks").empty();
    $("#regionalBlocks").append(regionalBlocks + "<br>");
    $("#weather").empty();
    $("#weather").append(
      "Weather: <img src='https://openweathermap.org/img/wn/" +
        icon +
        "@2x.png'>" +
        weather +
        "<br>"
    );
    $("#weather").append("Min Temperature: " + min_temp + "°F<br>");
    $("#weather").append("Max Temperature: " + max_temp + "°F<br>");
    $("#weather").append("Humidity: " + humidity + "%<br>");
    $("#wikipost1").empty();
    $("#wikipost1").append("Title: " + wiki1Title + "<br>");
    $("#wikipost1").append("Summary: " + wiki1Summary + "<br>");
    $("#wikipost1").append(
      "Reference: <a href='https://" +
        wiki1Ref +
        "' target='_blank'>Read more</a>"
    );
    $("#wikipost2").empty();
    $("#wikipost2").append("Title: " + wiki2Title + "<br>");
    $("#wikipost2").append("Summary: " + wiki2Summary + "<br>");
    $("#wikipost2").append(
      "Reference: <a href='https://" +
        wiki2Ref +
        "' target='_blank'>Read more</a>"
    );
    $("#wikipost3").empty();
    $("#wikipost3").append("Title: " + wiki3Title + "<br>");
    $("#wikipost3").append("Summary: " + wiki3Summary + "<br>");
    $("#wikipost3").append(
      "Reference: <a href='https://" +
        wiki3Ref +
        "' target='_blank'>Read more</a>"
    );
    $("#address").empty();
    $("#address").append(address);
    $("#incomeLevel").empty();
    $("#incomeLevel").append(incomeLevel);
    $("#alpha2").empty();
    $("#alpha2").append(alpha2);
    $("#alpha3").empty();
    $("#alpha3").append(alpha3);
    $("#subregion").empty();
    $("#subregion").append(subregion);
    $("#city").empty();
    $("#city").append(city);
    $("#timezone").empty();
    $("#timezone").append(timezone);
    $("#currency").empty();
    $("#currency").append(currency);
    $("#geometry").empty();
    $("#geometry").append(Lat + ", " + Lng);
  }

  $("#form").change(function (e) {
    e.preventDefault();
    var datastring = $("#form").serialize();

    var data2 = $("#form").serializeArray();
    var country = data2[0].value;
    console.log(localStorage.city);

    if (localStorage.getItem("city") !== country) {
      $.ajax({
        url: "test2.php",
        type: "POST",
        data: datastring,
        dataType: "json",
        async: true,
        success: function (res) {
          console.log(res);
          var result = JSON.parse(res[0]);
          JSONdata1 = JSON.parse(res[1]);
          JSONdata2 = JSON.parse(res[2]);
          JSONdata3 = JSON.parse(res[3]);
          JSONdata4 = JSON.parse(res[4]);
          console.log(JSONdata1);
          var borders = result.borders;
          var callingCodes = result.callingCodes;
          var languages = result.languages[0].name;
          var population = result.population;
          var region = result.region;
          var regionalBlocks = result.regionalBlocs[0].name;

          var weather = JSONdata1.weather[0].description;
          var icon = JSONdata1.weather[0].icon;
          var min_temp = JSONdata1.main.temp_min;
          var max_temp = JSONdata1.main.temp_max;
          var humidity = JSONdata1.main.humidity;

          var wiki1Title = JSONdata2.geonames[0].title;
          var wiki1Summary = JSONdata2.geonames[0].summary;
          var wiki1Ref = JSONdata2.geonames[0].wikipediaUrl;
          var wiki2Title = JSONdata2.geonames[1].title;
          var wiki2Summary = JSONdata2.geonames[1].summary;
          var wiki2Ref = JSONdata2.geonames[1].wikipediaUrl;
          var wiki3Title = JSONdata2.geonames[2].title;
          var wiki3Summary = JSONdata2.geonames[2].summary;
          var wiki3Ref = JSONdata2.geonames[2].wikipediaUrl;

          var address = JSONdata3[1][0].capitalCity;
          var incomeLevel = JSONdata3[1][0].incomeLevel.value;
          var alpha2 = JSONdata4.alpha2;
          var alpha3 = JSONdata4.alpha3;
          var subregion = JSONdata4.subregion;

          if (result.status == 404) {
            $("#borders").empty();
            $("#borders").append("-");
            $("#callingCodes").empty();
            $("#callingCodes").append("-");
            $("#languages").empty("-");
            $("#languages").append("-");
            $("#population").empty("-");
            $("#population").append("-");
            $("#region").empty();
            $("#region").append("-");
            $("#regionalBlocks").empty();
            $("#regionalBlocks").append("-");
          } else {
            $("#borders").empty();
            $("#borders").append(result.borders + "<br>");
            $("#callingCodes").empty();
            $("#callingCodes").append(result.callingCodes + "<br>");
            $("#languages").empty();
            $("#languages").append(result.languages[0].name + "<br>");
            $("#population").empty();
            $("#population").append(result.population + "<br>");
            $("#region").empty();
            $("#region").append(result.region + "<br>");
            $("#regionalBlocks").empty();
            $("#regionalBlocks").append(result.regionalBlocs[0].name + "<br>");
            localStorage.setItem("borders", borders);
            localStorage.setItem("callingCodes", callingCodes);
            localStorage.setItem("languages", languages);
            localStorage.setItem("population", population);
            localStorage.setItem("region", region);
            localStorage.setItem("regionalBlocks", regionalBlocks);
          }
          if (JSONdata1.weather) {
            $("#weather").empty();
            $("#weather").append(
              "Weather: <img src='https://openweathermap.org/img/wn/" +
                JSONdata1.weather[0].icon +
                "@2x.png'>" +
                JSONdata1.weather[0].description +
                "<br>"
            );
            $("#weather").append(
              "Min Temperature: " + JSONdata1.main.temp_min + "°F<br>"
            );
            $("#weather").append(
              "Max Temperature: " + JSONdata1.main.temp_max + "°F<br>"
            );
            $("#weather").append("Humidity: " + JSONdata1.main.humidity + "%");
            localStorage.setItem("weather", weather);
            localStorage.setItem("icon", icon);
            localStorage.setItem("min_temp", min_temp);
            localStorage.setItem("max_temp", max_temp);
            localStorage.setItem("humidity", humidity);
          } else {
            console.log("Error: could not find climate");
            $("#weather").empty();
            $("#weather").append("-");
          }
          if (JSONdata2.geonames[0]) {
            $("#wikipost1").empty();
            $("#wikipost1").append(
              "Title: " + JSONdata2.geonames[0].title + "<br>"
            );
            $("#wikipost1").append(
              "Summary: " + JSONdata2.geonames[0].summary + "<br>"
            );
            $("#wikipost1").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[0].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki1Title", wiki1Title);
            localStorage.setItem("wiki1Summary", wiki1Summary);
            localStorage.setItem("wiki1Ref", wiki1Ref);
          } else {
            $("#wikipost1").empty();
            $("#wikipost1").append("-");
          }

          if (JSONdata2.geonames[1]) {
            $("#wikipost2").empty();
            $("#wikipost2").append(
              "Title: " + JSONdata2.geonames[1].title + "<br>"
            );
            $("#wikipost2").append(
              "Summary: " + JSONdata2.geonames[1].summary + "<br>"
            );
            $("#wikipost2").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[1].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki2Title", wiki2Title);
            localStorage.setItem("wiki2Summary", wiki2Summary);
            localStorage.setItem("wiki2Ref", wiki2Ref);
          } else {
            $("#wikipost2").empty();
            $("#wikipost2").append("-");
          }
          if (JSONdata2.geonames[2]) {
            $("#wikipost3").empty();
            $("#wikipost3").append(
              "Title: " + JSONdata2.geonames[2].title + "<br>"
            );
            $("#wikipost3").append(
              "Summary: " + JSONdata2.geonames[2].summary + "<br>"
            );
            $("#wikipost3").append(
              "Reference: <a href='https://" +
                JSONdata2.geonames[2].wikipediaUrl +
                "' target='_blank'>Read more</a>"
            );
            localStorage.setItem("wiki3Title", wiki3Title);
            localStorage.setItem("wiki3Summary", wiki3Summary);
            localStorage.setItem("wiki3Ref", wiki3Ref);
          } else {
            $("#wikipost3").empty();
            $("#wikipost3").append("-");
          }
          if (JSONdata3[1][0]) {
            $("#address").empty();
            $("#address").append(JSONdata3[1][0].capitalCity);
            $("#incomeLevel").empty();
            $("#incomeLevel").append(JSONdata3[1][0].incomeLevel.value);
            localStorage.setItem("address", address);
            localStorage.setItem("incomeLevel", incomeLevel);
          } else {
            $("#address").empty();
            $("#address").append("-");
            $("#incomeLevel").empty();
            $("#incomeLevel").append("-");
          }
          if (JSONdata4) {
            $("#alpha2").empty();
            $("#alpha2").append(JSONdata4.alpha2);
            $("#alpha3").empty();
            $("#alpha3").append(JSONdata4.alpha3);
            $("#subregion").empty();
            $("#subregion").append(JSONdata4.subregion);
            localStorage.setItem("alpha2", alpha2);
            localStorage.setItem("alpha3", alpha3);
            localStorage.setItem("subregion", subregion);
          } else {
            $("#alpha2").empty();
            $("#alpha2").append("-");
            $("#alpha3").empty();
            $("#alpha3").append("-");
            $("#subregion").empty();
            $("#subregion").append("-");
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
          $("#borders").empty();
          $("#borders").append("-");
          $("#callingCodes").empty();
          $("#callingCodes").append("-");
          $("#languages").empty("-");
          $("#languages").append("-");
          $("#population").empty("-");
          $("#population").append("-");
          $("#region").empty();
          $("#region").append("-");
          $("#regionalBlocks").empty();
          $("#regionalBlocks").append("-");
          $("#wikipost1").empty();
          $("#wikipost1").append("-");
          $("#wikipost2").empty();
          $("#wikipost2").append("-");
          $("#wikipost3").empty();
          $("#wikipost3").append("-");
          $("#alpha2").empty();
          $("#alpha2").append("-");
          $("#alpha3").empty();
          $("#alpha3").append("-");
          $("#subregion").empty();
          $("#subregion").append("-");
          $("#address").empty();
          $("#address").append("-");
          $("#incomeLevel").empty();
          $("#incomeLevel").append("-");
        },
      });

      $.ajax({
        type: "POST",
        url: "forwardGeolocate.php",
        data: datastring,
        dataType: "json",
        success: function (data, error, status) {
          console.log(data);
          console.log(error);
          console.log(status);
          var city = data.results[0].formatted;
          var timezone = data.results[0].timezone;
          var currency = data.results[0].currency;
          var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
          var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
          var geometry = Lat + ", " + Lng;
          if (data !== 0) {
            $("#city").empty();
            $("#city").append(data.results[0].formatted);
            $("#timezone").empty();
            $("#timezone").append(data.results[0].timezone);
            $("#currency").empty();
            $("#currency").append(data.results[0].currency);
            $("#geometry").empty();
            var Lat = Math.round(data.results[0].geometry.lat * 100) / 100;
            var Lng = Math.round(data.results[0].geometry.lng * 100) / 100;
            $("#geometry").append(Lat + ", " + Lng);
            localStorage.setItem("city", city);
            localStorage.setItem("timezone", timezone);
            localStorage.setItem("currency", currency);
            localStorage.setItem("Lat", Lat);
            localStorage.setItem("Lng", Lng);
            localStorage.setItem("geometry", geometry);
          } else {
            console.log("Error: could not find city and timezone");
            $("#city").empty();
            $("#timezone").empty();
            $("#currency").empty();
            $("#geometry").empty();
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
          $("#city").append("-");
          $("#timezone").append("-");
          $("#currency").append("-");
          $("#geometry").append("-");
        },
      });
    } else {
      var borders = localStorage.getItem("borders");
      var callingCodes = localStorage.getItem("callingCodes");
      var languages = localStorage.getItem("languages");
      var population = localStorage.getItem("population");
      var region = localStorage.getItem("region");
      var regionalBlocks = localStorage.getItem("regionalBlocks");
      var weather = localStorage.getItem("weather");
      var icon = localStorage.getItem("icon");
      var min_temp = localStorage.getItem("min_temp");
      var max_temp = localStorage.getItem("max_temp");
      var humidity = localStorage.getItem("humidity");

      var wiki1Title = localStorage.getItem("wiki1Title");
      var wiki1Summary = localStorage.getItem("wiki1Summary");
      var wiki1Ref = localStorage.getItem("wiki1Ref");
      var wiki2Title = localStorage.getItem("wiki2Title");
      var wiki2Summary = localStorage.getItem("wiki2Summary");
      var wiki2Ref = localStorage.getItem("wiki2Ref");
      var wiki3Title = localStorage.getItem("wiki3Title");
      var wiki3Summary = localStorage.getItem("wiki3Summary");
      var wiki3Ref = localStorage.getItem("wiki3Ref");
      var address = localStorage.getItem("address", address);
      var incomeLevel = localStorage.getItem("incomeLevel", incomeLevel);
      var alpha2 = localStorage.getItem("alpha2", alpha2);
      var alpha3 = localStorage.getItem("alpha3", alpha3);
      var subregion = localStorage.getItem("subregion", subregion);
      var city = localStorage.getItem("city", city);
      var timezone = localStorage.getItem("timezone", timezone);
      var currency = localStorage.getItem("currency", currency);
      var Lat = localStorage.getItem("Lat", Lat);
      var Lng = localStorage.getItem("Lng", Lng);
      var geometry = localStorage.getItem("geometry", geometry);
      $("#borders").empty();
      $("#borders").append(borders + "<br>");
      $("#callingCodes").empty();
      $("#callingCodes").append(callingCodes + "<br>");
      $("#languages").empty();
      $("#languages").append(languages + "<br>");
      $("#population").empty();
      $("#population").append(population + "<br>");
      $("#region").empty();
      $("#region").append(region + "<br>");
      $("#regionalBlocks").empty();
      $("#regionalBlocks").append(regionalBlocks + "<br>");
      $("#weather").empty();
      $("#weather").append(
        "Weather: <img src='https://openweathermap.org/img/wn/" +
          icon +
          "@2x.png'>" +
          weather +
          "<br>"
      );
      $("#weather").append("Min Temperature: " + min_temp + "°F<br>");
      $("#weather").append("Max Temperature: " + max_temp + "°F<br>");
      $("#weather").append("Humidity: " + humidity + "%<br>");
      $("#wikipost1").empty();
      $("#wikipost1").append("Title: " + wiki1Title + "<br>");
      $("#wikipost1").append("Summary: " + wiki1Summary + "<br>");
      $("#wikipost1").append(
        "Reference: <a href='" + wiki1Ref + "' target='_blank'>Read more</a>"
      );
      $("#wikipost2").empty();
      $("#wikipost2").append("Title: " + wiki2Title + "<br>");
      $("#wikipost2").append("Summary: " + wiki2Summary + "<br>");
      $("#wikipost2").append(
        "Reference: <a href='https://" +
          wiki2Ref +
          "' target='_blank'>Read more</a>"
      );
      $("#wikipost3").empty();
      $("#wikipost3").append("Title: " + wiki3Title + "<br>");
      $("#wikipost3").append("Summary: " + wiki3Summary + "<br>");
      $("#wikipost3").append(
        "Reference: <a href='https://" +
          wiki3Ref +
          "' target='_blank'>Read more</a>"
      );
      $("#address").empty();
      $("#address").append(address);
      $("#incomeLevel").empty();
      $("#incomeLevel").append(incomeLevel);
      $("#alpha2").empty();
      $("#alpha2").append(alpha2);
      $("#alpha3").empty();
      $("#alpha3").append(alpha3);
      $("#subregion").empty();
      $("#subregion").append(subregion);
      $("#city").empty();
      $("#city").append(city);
      $("#timezone").empty();
      $("#timezone").append(timezone);
      $("#currency").empty();
      $("#currency").append(currency);
      $("#geometry").empty();
      $("#geometry").append(Lat + ", " + Lng);
    }
  });

  function routerAddress(i, wp, nWps) {}

  var control = L.Routing.control({
    router: new L.Routing.openrouteservice(
      "5b3ce3597851110001cf6248f49cb3ec17894324bfbb33a81edd3d07"
    ),
    waypoints: [
      // L.latLng(position.coords.latitude, position.coords.longitude),
    ],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    fitSelectedRoutes: true,
    createMarker: function (i, wp, nWps) {
      // here change the starting and ending icons
      return (
        L.marker(wp.latLng, {
          icon: customIcon,
          draggable: "true",
        })
          //.bindPopup(routerAddress(i, wp, nWps))
          .addTo(map)
      );
    },
    pointMarkerStyle: {
      radius: 5,
      color: "green",
      fillColor: "white",
      opacity: 1,
      fillOpacity: 0.7,
    },
    collapsible: true,
    containerClassName: "routingContainer",
    addButtonClassName: "routingButton",
    lineOptions: {
      styles: [
        {color: "black", opacity: 0.15, weight: 9},
        {color: "white", opacity: 0.8, weight: 7},
        {color: "rebeccapurple", opacity: 1, weight: 3},
      ],
    },
  }).addTo(map);
});

//});
