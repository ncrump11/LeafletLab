// Map of GeoJSON dtaa from MegaCities.GeoJSON

//instantiate leaflet Map
function createMap(){
    var map= L.map('map',{
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    //https://leaflet-extras.github.io/leaflet-providers/preview/
<<<<<<< HEAD
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
=======
	L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
>>>>>>> origin/master
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

    getData(map);
};


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

<<<<<<< HEAD
function pointToLayer(feature, latlng, attributes){
=======
function pointToLayer(feature, latlng){
>>>>>>> origin/master
    //create marker options

    var attribute = attributes[0];

<<<<<<< HEAD

=======
>>>>>>> origin/master
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
<<<<<<< HEAD

         //Step 6: Give each feature's circle marker a radius based on its attribute value
         options.radius = calcPropRadius(attValue);

         //create circle marker layer
         var layer = L.circleMarker(latlng, options);

         
            
        //build popup content
         var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

=======

         //Step 6: Give each feature's circle marker a radius based on its attribute value
         options.radius = calcPropRadius(attValue);

         //create circle marker layer
         var layer = L.circleMarker(latlng, options);

         
            
        //build popup content
         var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

>>>>>>> origin/master
         //add formatted attribute to panel content string
         var year = attribute.split("(")[0];
         panelContent += "<p><b>Gas price in " + year + ":</b> " + "$" + feature.properties[attribute].toFixed(2) + " per gallon</p>";
         
         //popup content is now just the city name
         var popupContent = feature.properties.City;
<<<<<<< HEAD

         //bind to circle marker
        layer.bindPopup(panelContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: true
        });

        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },

            mouseout: function(){
                this.closePopup();
            },
            // click: function(){
            //     $("#panel").html(panelContent);
            //     closeButton: true
            // }
        });

        //return the circle marker to the L.geoJson pointToLayer option
        return layer;
    
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};



//create sequence controls
function createSequenceControls(map, attributes){
=======

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
>>>>>>> origin/master
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');

    //set slider attributes
    $('.range-slider').attr({
        max: 5,
        min: 0,
        value: 0,
        step: 1
    });
<<<<<<< HEAD

    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');

     //Step 5: click listener for buttons
    $('.skip').click(function(){
         //get the old index value
        var index = $('.range-slider').val();

         //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 5 ? 0 : index;

        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 5 : index;
        
        };

        //update slider
        $('.range-slider').val(index);
            //pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);
        
    });
    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();

        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });

};

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("gal") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};    

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
         if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[0];
            popupContent += "<p><b>Gas price in " + year + ":</b> " + "$" + props[attribute].toFixed(2) + " per gallon</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
    });
};
=======
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="images/forward.png">');
};
    

>>>>>>> origin/master

 //retrieves data and places it on map
function getData(map){
    //load the data
    $.ajax("data/GasPrices.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
<<<<<<< HEAD
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            
=======
            createPropSymbols(response, map);
            createSequenceControls(map);
>>>>>>> origin/master
        }
    });
    $.ajax("data/oil.geojson",{
        dataType: "json",
        success: function(response){
        overlayOilData(response, map);
        }
    })
};

//fifth operator - overlay World's largest oil reserves
//source: https://www.eia.gov/cfapps/ipdbproject/IEDIndex3.cfm?tid=5&pid=57&aid=6
function overlayOilData(response, map){
   
            //create marker styles

            var overlayOptions = {
                radius: 8,
                fillColor: "#6A5ACD ",
                color: "#FFFFFF",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            var newLayer = L.geoJson(response, {

                pointToLayer: function(feature,latlng){
                    return L.circleMarker(latlng, overlayOptions);  
                }

            });


            var oilLayer = {
                "Largest Proven Oil Reserves" : newLayer
            };

            L.control.layers(null, oilLayer).addTo(map);

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