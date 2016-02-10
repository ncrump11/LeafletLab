/*My tutorials file */
//sets the map to our geographical coordinates/zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

//this adds a tile layer to our map, sets the maximum zoom and attributes the creators
L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//adds a marker to the map
var marker = L.marker([51.5, -0.09]).addTo(map);

//creates a circle and allows you to specify the locatin, color, and size of the circle
var circle = L.circle([51.508, -0.11], 500, {
    color: 'green',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);
//adds a polygon to the map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//adds clickable popups to the features we created
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//creates a popup not tied to a particular object (popup layer)
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

//creates an event that tell you the latitude and longitude of where you click
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

//this has the same effect as the previous function, but creates a popup rather
//than an alert
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);