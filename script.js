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
          parsedData = JSON.parse(data1);
          var countryCode = parsedData.alpha2Code;
          var countryName = parsedData.name;
          $("#select").val(countryCode).change();

          var circle = L.circle([parsedData.latlng[0], parsedData.latlng[1]], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.2,
            radius: 500,
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
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
        parsedData = JSON.parse(data1);
        var countryCode = parsedData.alpha2Code;
        var countryName = parsedData.name;
        $("#select").val(countryCode).change();
      },
    });
  });

  $("#form").change(function (e) {
    e.preventDefault();
    var data1 = $("#form").serializeArray();
    var selectedCountry = data1[0].value;
    $.ajax({
      type: "POST",
      url: "getCountryBorderFromCountryCode.php",
      data: {x: selectedCountry},
      dataType: "json",
      success: function (data, error, status) {
        const layer = L.geoJSON(data.data, {
          weight: 3,
          color: "rebeccapurple",
        });
        const layer2 = L.geoJSON(data.data, {
          weight: 3,
          color: "rgb(252, 32, 142)",
        });

        if (data.data.geometry.type === "Polygon") {
          layer;
          const latLngs = L.GeoJSON.coordsToLatLngs(
            data.data.geometry.coordinates,
            1
          );

          layer.bindPopup(data.data.properties.name).addTo(map);
          map.fitBounds(latLngs);
        } else {
          const latLngs = L.GeoJSON.coordsToLatLngs(
            data.data.geometry.coordinates,
            2
          );

          layer2.bindPopup(data.data.properties.name).addTo(map);
          map.fitBounds(latLngs);
        }
        $("#form").change(function (e) {
          map.removeLayer(layer);
          map.removeLayer(layer2);
        });
      },
      error: function (error) {},
    });

    var datastring = $("#form").serialize();
    var data2 = $("#form").serializeArray();
    var selectedCountry = data2[0].value;

    if (localStorage.getItem("city") !== selectedCountry) {
      $.ajax({
        url: "test2.php",
        type: "POST",
        data: {countries: datastring},
        dataType: "json",
        async: true,
        success: function (res) {
          var result = JSON.parse(res[0]);
          JSONdata1 = JSON.parse(res[1]);
          JSONdata2 = JSON.parse(res[2]);
          JSONdata3 = JSON.parse(res[3]);
          JSONdata4 = JSON.parse(res[4]);
          JSONdata6 = JSON.parse(res[6]);

          var city = result.name;
          var timezone = result.timezones;
          var area = result.area;
          var currencyCode = result.currencies[0].code;
          var currencySymbol = result.currencies[0].symbol;
          var currency = currencyCode + ", " + currencySymbol;
          var Lat = Math.round(JSONdata3[1][0].longitude * 100) / 100;
          var Lng = Math.round(JSONdata3[1][0].latitude * 100) / 100;
          var geometry = Lat + " " + Lng;
          var borders = result.borders;
          var callingCodes = result.callingCodes;
          var languages = result.languages[0].name;
          var population = result.population;
          var region = result.region;
          var regionalBlocks = result.regionalBlocs[0].name;

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
          var EU = JSONdata6.result;

          var marker = L.marker([result.latlng[0], result.latlng[1]], {
            icon: customIcon,
            draggable: "true",
          })
            .bindPopup(
              "<b>" +
                result.name +
                ", " +
                result.region +
                ' </b><br> <svg width="50" height="40"><image href="' +
                result.flag +
                '" height="40" width="50"/> </svg>'
            )
            .openPopup()
            .addTo(map);
          $("#form").change(function (e) {
            marker.remove();
          });

          if (result.status == 404) {
            $("#EU").empty();
            $("#EU").append("-");
            $("#area").empty();
            $("#area").append("-");
            $("#currency").empty();
            $("#currency").append("-");
            $("#timezone").empty();
            $("#timezone").append("-");
            $("#city").empty();
            $("#city").append("-");
            $("#geometry").empty();
            $("#geometry").append("-");
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
            $("#city").empty();
            $("#city").append(result.name);
            $("#timezone").empty();
            $("#timezone").append(result.timezones);
            $("#area").empty();
            $("#area").append(result.area);
            $("#currency").empty();
            $("#currency").append(
              result.currencies[0].code + " " + result.currencies[0].symbol
            );
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
            $("#flag").empty();
            $("#flag").append(
              '<svg width="50" height="40"><image href="' +
                result.flag +
                '" height="40" width="50"/> </svg>'
            );
            localStorage.setItem("city", city);
            localStorage.setItem("timezone", timezone);
            localStorage.setItem("area", area);
            localStorage.setItem("currencyCode", currencyCode);
            localStorage.setItem("currencySymbol", currencySymbol);
            localStorage.setItem("currency", currency);
            localStorage.setItem("borders", borders);
            localStorage.setItem("callingCodes", callingCodes);
            localStorage.setItem("languages", languages);
            localStorage.setItem("population", population);
            localStorage.setItem("region", region);
            localStorage.setItem("regionalBlocks", regionalBlocks);
          }
          if (JSONdata1.weather) {
            $("#icon").empty();
            $("#icon").append(
              "<img src='https://openweathermap.org/img/wn/" +
                JSONdata1.weather[0].icon +
                "@2x.png'><br>" +
                JSONdata1.weather[0].main
            );
            $("#min_temp").empty();
            $("#min_temp").append(JSONdata1.main.temp_min + "°F<br>");
            $("#max_temp").empty();
            $("#max_temp").append(JSONdata1.main.temp_max + "°F<br>");
            $("#humidity").empty();
            $("#humidity").append(JSONdata1.main.humidity + "%");

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
            $("#geometry").empty();
            var Lat = Math.round(JSONdata3[1][0].longitude * 100) / 100;
            var Lng = Math.round(JSONdata3[1][0].latitude * 100) / 100;
            $("#geometry").append(Lat + ", " + Lng);
            $("#address").empty();
            $("#address").append(JSONdata3[1][0].capitalCity);
            $("#incomeLevel").empty();
            $("#incomeLevel").append(JSONdata3[1][0].incomeLevel.value);
            localStorage.setItem("Lat", Lat);
            localStorage.setItem("Lng", Lng);
            localStorage.setItem("geometry", geometry);
            localStorage.setItem("address", address);
            localStorage.setItem("incomeLevel", incomeLevel);
          } else {
            $("#geometry").empty();
            $("#geometry").append("-");
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
          if (JSONdata6) {
            $("#EU").empty();
            $("#EU").append(JSONdata6.result);
            localStorage.setItem("EU", EU);
          } else {
            $("#EU").empty();
            $("#EU").append("-");
          }
        },
        error: function (xhr, status, error) {
          $("#EU").empty();
          $("#EU").append("-");
          $("#area").empty();
          $("#area").append("-");
          $("#city").empty();
          $("#city").append("-");
          $("#geometry").empty();
          $("#geometry").append("-");
          $("#currency").empty();
          $("#currency").append("-");
          $("#timezone").empty();
          $("#timezone").append("-");
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
        url: "googleMaps.php",
        type: "POST",
        data: datastring,
        dataType: "json",
        async: true,
        success: function (res) {
          var lat = res.results[0].geometry.lat;
          var lng = res.results[0].geometry.lng;

          $("#wiki").empty();
          $("#wiki").append(
            "<div class='google'><a href='https://www.google.com/maps/search/?api=1&query=" +
              lat +
              "," +
              lng +
              "' target='_blank'><img src='googlemaps.jpeg' alt='Google Map' width='30' height='30'></a></div>"
          );
        },
      });
    } else {
      var area = localStorage.getItem("area");
      var borders = localStorage.getItem("borders");
      var callingCodes = localStorage.getItem("callingCodes");
      var languages = localStorage.getItem("languages");
      var population = localStorage.getItem("population");
      var region = localStorage.getItem("region");
      var regionalBlocks = localStorage.getItem("regionalBlocks");

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
      var currencyCode = localStorage.getItem("currencyCode", currencyCode);
      var currencySymbol = localStorage.getItem(
        "currencySymbol",
        currencySymbol
      );
      var currency = localStorage.getItem("currency", currency);
      var Lat = localStorage.getItem("Lat", Lat);
      var Lng = localStorage.getItem("Lng", Lng);
      var geometry = localStorage.getItem("geometry", geometry);
      var EU = localStorage.getItem("EU", EU);
      $("#borders").empty();
      $("#borders").append(borders + "<br>");
      $("#area").empty();
      $("#area").append(area);
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
      $("#icon").empty();
      $("#icon").append(
        "<img src='https://openweathermap.org/img/wn/" +
          icon +
          "@2x.png'>" +
          weather +
          "<br>"
      );
      $("#min_temp").append(min_temp + "°F<br>");
      $("#max_temp").append(max_temp + "°F<br>");
      $("#humidity").append(humidity + "%<br>");
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
      $("#EU").empty();
      $("#EU").append(EU);
    }
  });
});
