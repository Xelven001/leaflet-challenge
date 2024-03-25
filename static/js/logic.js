// Function to create the map
function createMap(earthquakeData) {
    // Create the map centered at a specific location
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5
    });
  
    // Add tile layer (the background map image)
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      accessToken: "pk.eyJ1IjoieGVsdmVuMTAxIiwiYSI6ImNsdTc5YnJ3dzAzaTMyanFyanU1Mmtpc2sifQ.Ef-WN34_L86e4ZHeFPHwvg"
    }).addTo(myMap);
  
    // Function to determine the color of the marker based on depth
    function getColor(depth) {
      return depth > 90 ? "#ff0000" :
        depth > 70 ? "#ff6f00" :
        depth > 50 ? "#ffbf00" :
        depth > 30 ? "#fffa00" :
        depth > 10 ? "#bfff00" :
        "#00ff40";
    }
  
    // Function to create the marker style
    function markerStyle(feature) {
      return {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }
  
    // Function to bind popup to each marker
    function onEachFeature(feature, layer) {
      if (feature.properties && feature.properties.place && feature.properties.mag && feature.geometry.coordinates) {
        layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    }
  
    // Add GeoJSON layer with earthquake data
    L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, markerStyle(feature));
      },
      onEachFeature: onEachFeature
    }).addTo(myMap);
  
    // Create a legend
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  }
  
  // Fetch earthquake data from GeoJSON URL and create map
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    createMap(data.features);
  });
  