//instantiate leaflet Map
function createMap(){
    var map= L.map('map',{
        center: [25, 10],
        zoom: 2
    });

    //add OSM base tilelayer
    //https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    getData(map);
};

function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = "<p><b>City:</b> " + properties.City + "</p>";

     //add formatted attribute to panel content string
    var year = attribute.split("_")[0];
    popupContent += "<p><b>Gas price in " + year + ":</b> " + "$" + properties[attribute].toFixed(2) + " per gallon</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
    offset: new L.Point(0,-radius),
    closeButton: false
    });
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 60;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

function pointToLayer(feature, latlng, attributes){
    //create marker options

    var attribute = attributes[0];


    var options = {
        // radius: 8,
        fillColor: "#DC143C ",
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
            
        createPopup(feature.properties, attribute, layer, options.radius)
        

        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },

            mouseout: function(){
                this.closePopup();
            },
           closeButton: false
        });
    return layer;
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("(")[0];
    var content = "Price Per Gallon in " + year;

    //replace legend content
    $('#temporal-legend').html(content);
    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);

    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 49 - radius,
            r: radius
        });
        
      //Step 4: add legend text
        $('#'+key+'-text').text("$" + Math.round(circleValues[key]*100)/100);

    };
};

function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" >';

            //object to base loop on
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            //loop to add each circle and text to svg string
            for (var circle in circles){
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#DC143C" fill-opacity="0.8" stroke="#FFFFFF" cx="60"/>';

                //text string
                svg += '<text id="' + circle + '-text" fill="#FFFFFF" x="85" y="' + circles[circle] + '"></text>';
            };

        //close svg string
        svg += "</svg>";

        //add attribute legend svg to container
        $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
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
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

             //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });

            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');

            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            


            return container;        
        }
    });

    map.addControl(new SequenceControl());
    
    $('#reverse').html('<img src="img/newrev.png">');
    $('#forward').html('<img src="img/newfor.png">');


    //set slider attributes
    $('.range-slider').attr({
        max: 5,
        min: 0,
        value: 0,
        step: 1
    });

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

            createPopup(props, attribute, layer, radius)
            
        };
    });
        //update sequence legend
        updateLegend(map, attribute);
};

 //retrieves data and places it on map
function getData(map){
    //load the data
    $.ajax("data/GasPrices.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
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