// Map of GeoJSON dtaa from MegaCities.GeoJSON

//instantiate leaflet Map
function createMap(){
	var map= L.map('map',{
		center: [20, 0],
		zoom: 2
	});

	//add OSM base tilelayer
    //https://leaflet-extras.github.io/leaflet-providers/preview/
	L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

    getData(map);
};

// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 35;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

function pointToLayer(feature, latlng){
    //create marker options

    var attribute = "2010(gal)";

    var options = {
        // radius: 8,
        fillColor: "#FF6347 ",
        color: "#FFFFFF",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8

    };

    //create a Leaflet GeoJSON layer and add it to the map

        var attValue = Number(feature.properties[attribute]);

         //Step 6: Give each feature's circle marker a radius based on its attribute value
         options.radius = calcPropRadius(attValue);

         //create circle marker layer
         var layer = L.circleMarker(latlng, options);

         
            
        //build popup content
         var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

         //add formatted attribute to panel content string
         var year = attribute.split("(")[0];
         panelContent += "<p><b>Gas price in " + year + ":</b> " + "$" + feature.properties[attribute].toFixed(2) + " per gallon</p>";
         
         //popup content is now just the city name
         var popupContent = feature.properties.City;

         //bind to circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        });

        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            },
            click: function(){
                $("#panel").html(panelContent);
            }
        });

        //return the circle marker to the L.geoJson pointToLayer option
        return layer;
    
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};

//create sequence controls
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');

    //set slider attributes
    $('.range-slider').attr({
        max: 5,
        min: 0,
        value: 0,
        step: 1
    });
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="images/forward.png">');
};
    


 //retrieves data and places it on map
function getData(map){
    //load the data
    $.ajax("data/GasPrices.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
            createSequenceControls(map);
        }
    });
};

 $(document).ready(createMap);

 //GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//1. Create the Leaflet map--done (in createMap())
//2. Import GeoJSON data--done (in getData())
//3. Add circle markers for point features to the map--done (in AJAX callback)
//4. Determine which attribute to visualize with proportional symbols
//5. For each feature, determine its value for the selected attribute
//6. Give each feature's circle marker a radius based on its attribute value