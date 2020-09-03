/////////////////////////////////////////leaflet:
$(window).on("load", function () {
  $(".loader-wrapper").fadeOut("slow");
});
$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var map = L.map("mapid", {zoomControl: false}).fitWorld();

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
      var data = "countries.geojson";
      //Creating marker and circle that appears on html location when page loads:

      var customIcon = L.icon({
        iconUrl: "marker.svg",
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
      });

      $.ajax({
        type: "POST",
        url: "capitalCity.php",
        data: {
          x: position.coords.latitude,
          y: position.coords.longitude,
        },
        dataType: "json",
        success: function (data) {
          console.log(JSON.parse(data));
          parsedData = JSON.parse(data);
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
              //.bindPopup(position)
              .update();
          });

          //map.addLayer(marker);
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

      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };

      var vectorLayer = new L.GeoJSON.AJAX(data, {
        style: function (feature) {
          return {
            color: "rebeccapurple",
          };
        },

        //pointToLayer: addIcon,
        onEachFeature: onEachCountry,
      }).addTo(map);

      var geoIcon = L.Icon.extend({
        iconUrl: "marker.svg",
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
      });

      function onEachCountry(country, layer, latlng) {
        // console.log(country);
        layer.bindPopup(country.properties.ADMIN);
        //country.setIcon(customIcon);
        layer.on("click", function (e, latlng) {
          map.fitBounds(layer.getBounds());
          e.target.setStyle({
            color: "yellow",
          });
        });
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: clickColorChange,
        });
      }

      function highlightFeature(e) {
        this.setStyle({
          weight: 5,
          color: "green",
          dashArray: "",
          fillOpacity: 0.4,
        });
      }

      function resetHighlight(e) {
        vectorLayer.resetStyle(this);
        //this.bringToBack();
      }
      function clickColorChange(e) {
        this.setStyle({
          color: "yellow",
        });
        //this.bringToBack();
      }
      $("#form").submit(function (e) {
        e.preventDefault();
        //var datastring = $("#form").serialize();
        var data1 = $("#form").serializeArray();
        console.log(data1[0].value);
        var selectedCountry = data1[0].value;

        var submitLayer = new L.GeoJSON.AJAX(data, {
          style: function (feature) {},
          onEachFeature: onEachCountry,
        }).addTo(map);
        function onEachCountry(country, layer, vectorLayer, latlng) {
          if (country.properties.ADMIN == selectedCountry) {
            //get this layer id and and bind popupto that layer
            map.fitBounds(layer.getBounds());
            layer.bindPopup(country.properties.ADMIN);

            layer.on("click", function (e) {
              map.fitBounds(layer.getBounds());
              e.target.setStyle({
                color: "green",
              });
            });

            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              //click: clickColorChange,
            });

            //}
          }
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            //click: clickColorChange,
          });
          layer.bindPopup(country.properties.ADMIN);
          layer.on("click", function (e) {
            map.fitBounds(layer.getBounds());
            e.target.setStyle({
              color: "green",
            });
          });
        }
      });
      //fetching geojson data:
      //var datastring = $("#form").serialize();
      //var url = "countries.geojson";

      $("#form").submit(function (e) {
        e.preventDefault();
        var datastring = $("#form").serialize();
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
              $("#regionalBlocks").append(
                result.regionalBlocs[0].name + "<br>"
              );
            }
            if (JSONdata1.weather) {
              $("#weather").empty();
              $("#weather").append(
                "Weather: " + JSONdata1.weather[0].description + "<br>"
              );
              $("#weather").append(
                "Min Temperature: " + JSONdata1.main.temp_min + "°F<br>"
              );
              $("#weather").append(
                "Max Temperature: " + JSONdata1.main.temp_max + "°F<br>"
              );
              $("#weather").append(
                "Humidity: " + JSONdata1.main.humidity + "%"
              );
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
                "Reference: <a href='" +
                  JSONdata2.geonames[0].wikipediaUrl +
                  "'>Read more</a>"
              );
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
                "Reference: <a href='" +
                  JSONdata2.geonames[1].wikipediaUrl +
                  "'>Read more</a>"
              );
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
                "Reference: <a href='" +
                  JSONdata2.geonames[2].wikipediaUrl +
                  "'>Read more</a>"
              );
            } else {
              $("#wikipost3").empty();
              $("#wikipost3").append("-");
            }
            if (JSONdata3[1][0]) {
              $("#address").empty();
              $("#address").append(JSONdata3[1][0].capitalCity);
              $("#incomeLevel").empty();
              $("#incomeLevel").append(JSONdata3[1][0].incomeLevel.value);
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
            $("#geomtry").append("-");
          },
        });
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
  } else {
    alert("Error:Location not found.");
  }
});

$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {});
  } else {
    $("#main").append("Geolocation is not supported by this browser.");
  }
});
